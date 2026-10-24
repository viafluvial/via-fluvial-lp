#!/usr/bin/env python3

import argparse
import json
import os
import re
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
from typing import Dict, Optional

VAR_PATTERN = re.compile(r"\$\{([^}]+)\}")


def parse_bool(value: str) -> bool:
    normalized = str(value or "").strip().lower()
    return normalized in {"1", "true", "yes", "sim", "on"}


def parse_env_file(file_path: str) -> Dict[str, str]:
    env_values: Dict[str, str] = {}

    if not file_path:
        return env_values

    if not os.path.isfile(file_path):
        raise RuntimeError(f"Environment file not found: {file_path}")

    with open(file_path, "r", encoding="utf-8") as handle:
        for raw_line in handle:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip()

            if not key:
                continue

            if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
                value = value[1:-1]

            env_values[key] = value

    return env_values


def merge_runtime_env(defaults: Dict[str, str]) -> Dict[str, str]:
    merged = dict(defaults)

    for key, value in os.environ.items():
        if key in merged or key.startswith("VIA_FLUVIAL_") or key in {
            "APP_IMAGE",
            "DOMAIN_PRIMARY",
            "DOMAIN_WWW",
            "STACK_REPLICAS",
        }:
            merged[key] = value

    return merged


def render_compose_template(content: str, variables: Dict[str, str]) -> str:
    def replace_token(match: re.Match[str]) -> str:
        token = match.group(1)

        if ":-" in token:
            key, default = token.split(":-", 1)
            return variables.get(key, default)

        if "-" in token:
            key, default = token.split("-", 1)
            return variables.get(key, default)

        return variables.get(token, "")

    rendered = content
    for _ in range(4):
        updated = VAR_PATTERN.sub(replace_token, rendered)
        if updated == rendered:
            break
        rendered = updated

    unresolved = sorted(set(VAR_PATTERN.findall(rendered)))
    if unresolved:
        joined = ", ".join(unresolved)
        raise RuntimeError(f"Unresolved compose variables: {joined}")

    return rendered


def request_json(
    base_url: str,
    api_key: str,
    method: str,
    path: str,
    payload: Optional[dict] = None,
    insecure: bool = False,
):
    full_url = f"{base_url.rstrip('/')}{path}"
    headers = {"X-API-Key": api_key}
    body = None

    if payload is not None:
        headers["Content-Type"] = "application/json"
        body = json.dumps(payload).encode("utf-8")

    context = ssl._create_unverified_context() if insecure else ssl.create_default_context()
    request = urllib.request.Request(full_url, data=body, headers=headers, method=method)

    try:
        with urllib.request.urlopen(request, context=context, timeout=60) as response:
            raw = response.read().decode("utf-8")
            if not raw:
                return None
            return json.loads(raw)
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Portainer API error {error.code} {method} {path}: {detail}") from error


def resolve_endpoint_id(base_url: str, api_key: str, endpoint_name: str, insecure: bool) -> str:
    endpoints = request_json(base_url, api_key, "GET", "/api/endpoints", insecure=insecure) or []

    for endpoint in endpoints:
        current_name = str(endpoint.get("Name", ""))
        if current_name.lower() == endpoint_name.lower():
            return str(endpoint.get("Id"))

    available = ", ".join(sorted(str(item.get("Name", "")) for item in endpoints if item.get("Name")))
    raise RuntimeError(f"Could not resolve Portainer endpoint '{endpoint_name}'. Available: {available}")


def upsert_stack(
    base_url: str,
    api_key: str,
    endpoint_id: str,
    stack_name: str,
    stack_file_content: str,
    prune: bool,
    pull_image: bool,
    insecure: bool,
):
    stacks = request_json(
        base_url,
        api_key,
        "GET",
        f"/api/stacks?endpointId={urllib.parse.quote(endpoint_id)}",
        insecure=insecure,
    ) or []

    stack = next((item for item in stacks if item.get("Name") == stack_name), None)

    if stack is None:
        swarm = request_json(
            base_url,
            api_key,
            "GET",
            f"/api/endpoints/{urllib.parse.quote(endpoint_id)}/docker/swarm",
            insecure=insecure,
        )
        swarm_id = (swarm or {}).get("ID")
        if not swarm_id:
            raise RuntimeError("Could not resolve swarm ID from Portainer endpoint")

        payload = {
            "Name": stack_name,
            "SwarmID": swarm_id,
            "StackFileContent": stack_file_content,
            "Env": [],
            "FromAppTemplate": False,
        }

        request_json(
            base_url,
            api_key,
            "POST",
            f"/api/stacks/create/swarm/string?endpointId={urllib.parse.quote(endpoint_id)}",
            payload=payload,
            insecure=insecure,
        )
        print(f"[INFO] Stack created: {stack_name}")
        return

    stack_id = stack.get("Id")
    if stack_id is None:
        raise RuntimeError("Stack found without Id")

    payload = {
        "StackFileContent": stack_file_content,
        "Env": stack.get("Env") or [],
        "Prune": prune,
        "PullImage": pull_image,
    }

    request_json(
        base_url,
        api_key,
        "PUT",
        f"/api/stacks/{stack_id}?endpointId={urllib.parse.quote(endpoint_id)}",
        payload=payload,
        insecure=insecure,
    )

    print(f"[INFO] Stack updated: {stack_name} (id={stack_id})")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Deploy or update a Docker Swarm stack on Portainer")
    parser.add_argument("--portainer-url", required=True)
    parser.add_argument("--portainer-api-key", default=os.getenv("PORTAINER_API_KEY", ""))
    parser.add_argument("--endpoint-id", default="")
    parser.add_argument("--endpoint-name", default="application")
    parser.add_argument("--stack-name", default="viafluvial-app-prd")
    parser.add_argument("--compose-file", required=True)
    parser.add_argument("--env-file", default="")
    parser.add_argument("--image", default="")
    parser.add_argument("--prune", default="true")
    parser.add_argument("--pull-image", default="true")
    parser.add_argument("--insecure", action="store_true")
    return parser


def main() -> int:
    args = build_parser().parse_args()

    if not args.portainer_api_key:
        raise RuntimeError("Portainer API key is required")

    if not os.path.isfile(args.compose_file):
        raise RuntimeError(f"Compose file not found: {args.compose_file}")

    with open(args.compose_file, "r", encoding="utf-8") as handle:
        compose_template = handle.read()

    env_defaults = parse_env_file(args.env_file) if args.env_file else {}
    env_values = merge_runtime_env(env_defaults)

    if args.image:
        env_values["APP_IMAGE"] = args.image

    rendered_compose = render_compose_template(compose_template, env_values)

    endpoint_id = args.endpoint_id.strip()
    if not endpoint_id:
        endpoint_id = resolve_endpoint_id(
            args.portainer_url,
            args.portainer_api_key,
            args.endpoint_name,
            args.insecure,
        )

    upsert_stack(
        args.portainer_url,
        args.portainer_api_key,
        endpoint_id,
        args.stack_name,
        rendered_compose,
        parse_bool(args.prune),
        parse_bool(args.pull_image),
        args.insecure,
    )

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"[ERROR] {error}", file=sys.stderr)
        raise SystemExit(1)
