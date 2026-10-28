/**
 * Telemetria leve no navegador (OpenTelemetry -> Coroot): carregamento de página, Web Vitals e erros de JS.
 * Sem fetch/XHR e sem traceparent: o site é estático e o navegador não chama as APIs da plataforma.
 * Os spans vão por POST same-origin em /otel/v1/traces; o nginx do contêiner injeta a chave do Coroot.
 */
import { trace, SpanStatusCode, type Span, type Tracer } from '@opentelemetry/api';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor, ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';
import type { OtelRuntimeConfig } from './config';

const SERVICE_NAME = 'via-fluvial-app-sobre';
const ERROR_DEDUP_WINDOW_MS = 10_000;
const ERROR_MAX_PER_MINUTE = 20;
const IGNORED_ERRORS = /ResizeObserver loop|Script error\.?$/i;

let tracer: Tracer | null = null;
let started = false;

/** Remove query string e fragmento de qualquer URL (privacidade). */
export function stripUrl(value: string): string {
  try {
    const url = new URL(value, window.location.href);
    return `${url.origin}${url.pathname}`;
  } catch {
    return value.split(/[?#]/)[0] ?? value;
  }
}

/** Caminho da página sem query string nem fragmento. */
export function pagePath(): string {
  return window.location.pathname;
}

/** Reaplica a sanitização nos atributos de URL que o document-load grava com a URL completa. */
function sanitizeUrlAttributes(span: Span): void {
  const attrs = (span as unknown as { attributes?: Record<string, unknown> }).attributes;
  if (!attrs) return;
  for (const [key, value] of Object.entries(attrs)) {
    if (typeof value === 'string' && /^https?:\/\//.test(value) && /[?#]/.test(value)) {
      span.setAttribute(key, stripUrl(value));
    }
  }
}

function recordVital(metric: Metric): void {
  if (!tracer) return;
  const span = tracer.startSpan(`web_vital.${metric.name}`);
  span.setAttribute('web_vital.name', metric.name);
  span.setAttribute('web_vital.value', metric.value);
  span.setAttribute('web_vital.rating', metric.rating);
  span.setAttribute('page.path', pagePath());
  span.end();
}

function installErrorCapture(): void {
  const seen = new Map<string, number>();
  let windowStart = Date.now();
  let count = 0;

  const report = (error: unknown, source: string) => {
    if (!tracer) return;
    const err = error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Erro desconhecido');
    if (IGNORED_ERRORS.test(err.message)) return;

    const now = Date.now();
    if (now - windowStart > 60_000) {
      windowStart = now;
      count = 0;
    }
    if (count >= ERROR_MAX_PER_MINUTE) return;
    const key = `${err.name}|${err.message}|${(err.stack ?? '').split('\n')[1] ?? ''}`;
    const last = seen.get(key);
    if (last !== undefined && now - last < ERROR_DEDUP_WINDOW_MS) return;
    seen.set(key, now);
    count += 1;

    const span = tracer.startSpan('js.error');
    span.setAttribute('error.type', err.name);
    span.setAttribute('error.message', err.message.slice(0, 300));
    span.setAttribute('error.source', source);
    span.setAttribute('page.path', pagePath());
    span.recordException(err);
    span.setStatus({ code: SpanStatusCode.ERROR, message: err.message.slice(0, 300) });
    span.end();
  };

  window.addEventListener('error', (event) => report(event.error ?? event.message, 'window.error'));
  window.addEventListener('unhandledrejection', (event) => report(event.reason, 'unhandledrejection'));
}

export function startTelemetry(config: OtelRuntimeConfig, version: string): void {
  if (started || !config.enabled) return;
  started = true;

  const endpoint = '/otel/v1/traces';
  const provider = new WebTracerProvider({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: SERVICE_NAME,
      [ATTR_SERVICE_VERSION]: version,
      'deployment.environment': config.environment,
    }),
    sampler: new ParentBasedSampler({ root: new TraceIdRatioBasedSampler(config.sampleRatio) }),
    // O processador de navegador também exporta no visibilitychange (aba oculta/fechada).
    spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter({ url: endpoint }), { scheduledDelayMillis: 5000 })],
  });
  provider.register();
  tracer = trace.getTracer(SERVICE_NAME, version);

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      new DocumentLoadInstrumentation({
        applyCustomAttributesOnSpan: {
          documentLoad: sanitizeUrlAttributes,
          documentFetch: sanitizeUrlAttributes,
          resourceFetch: sanitizeUrlAttributes,
        },
      }),
    ],
  });

  onLCP(recordVital);
  onINP(recordVital);
  onCLS(recordVital);
  onFCP(recordVital);
  onTTFB(recordVital);
  installErrorCapture();
  // Registrado depois do web-vitals: INP/CLS são emitidos no mesmo visibilitychange e precisam entrar no flush.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void provider.forceFlush().catch(() => undefined);
  });
  window.addEventListener('pagehide', () => void provider.forceFlush().catch(() => undefined));
}
