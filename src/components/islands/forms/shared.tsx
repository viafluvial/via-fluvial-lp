import { useId, type ReactNode } from 'react';
import { SITE } from '../../../data/site';

/* ---------- Endereços do proxy do próprio site (o navegador nunca chama o backend direto) ---------- */
export const CONTACT_ENDPOINT = '/api/administracao/public/contact-requests';
export const NEWSLETTER_ENDPOINT = '/api/notificacoes/public/newsletter/subscriptions';

export type SubmitOutcome =
  | { kind: 'success' }
  | { kind: 'rate-limited' }
  | { kind: 'invalid' }
  | { kind: 'failure' };

/** Envia JSON e traduz o resultado. Qualquer falha de rede ou de servidor vira "failure". */
export async function postJson(url: string, body: unknown, timeoutMs = 15000): Promise<SubmitOutcome> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
      credentials: 'omit',
    });
    if (response.status === 201 || response.status === 202) return { kind: 'success' };
    if (response.status === 429) return { kind: 'rate-limited' };
    if (response.status === 400) return { kind: 'invalid' };
    return { kind: 'failure' };
  } catch {
    return { kind: 'failure' };
  } finally {
    window.clearTimeout(timer);
  }
}

/* ---------- Validação (mensagens claras, em português) ---------- */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateName(value: string): string | null {
  return value.trim().length >= 2 ? null : 'Informe seu nome.';
}
export function validateEmail(value: string): string | null {
  return EMAIL_RE.test(value.trim()) ? null : 'Informe um e-mail válido, como nome@empresa.com.br.';
}
export function validatePhone(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return null;
  return digits.length >= 10 && digits.length <= 13 ? null : 'Informe o telefone com DDD, por exemplo (92) 99999-9999.';
}
export function validateConsent(value: boolean): string | null {
  return value ? null : 'Para enviar, é preciso aceitar o uso dos seus dados.';
}

/* ---------- Peças visuais ---------- */
interface FieldProps {
  label: string;
  name: string;
  error?: string | null;
  hint?: string;
  required?: boolean;
  children: (props: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
  className?: string;
}

export function Field({ label, name, error, hint, required, children, className }: FieldProps) {
  const uid = useId();
  const id = `${name}-${uid}`;
  const errorId = `${id}-erro`;
  const hintId = `${id}-dica`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field ${className ?? ''}`}>
      <label htmlFor={id}>
        {label}
        {required ? (
          <span aria-hidden="true" className="text-[#b42318]">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-muted"> (opcional)</span>
        )}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint && !error ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Campo isca contra robôs: invisível e fora do Tab; pessoas nunca o preenchem. */
export function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="hp" aria-hidden="true">
      <label>
        Não preencha este campo
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(event) => onChange(event.target.value)} />
      </label>
    </div>
  );
}

export function ConsentField({
  checked,
  onChange,
  error,
  text,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  error?: string | null;
  text: ReactNode;
}) {
  const uid = useId();
  const id = `consent-${uid}`;
  const errorId = `${id}-erro`;
  return (
    <div className="field">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          name="consent"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-0.5 h-6 w-6 flex-none cursor-pointer accent-[#1a5f3b]"
        />
        <label htmlFor={id} className="!mb-0 cursor-pointer text-[0.9375rem] !font-normal leading-snug text-muted">
          {text}
        </label>
      </div>
      {error ? (
        <p id={errorId} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function PrivacyLink() {
  return (
    <a href="/privacidade" target="_blank" rel="noopener" className="font-semibold text-green-700 underline underline-offset-2">
      Política de Privacidade<span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

/** Aviso de falha: mensagem amigável + os canais de contato alternativos. */
export function ErrorFallback({ outcome }: { outcome: Exclude<SubmitOutcome['kind'], 'success'> }) {
  const headline =
    outcome === 'rate-limited'
      ? 'Recebemos muitos envios em pouco tempo.'
      : outcome === 'invalid'
        ? 'Não conseguimos aceitar os dados como foram enviados.'
        : 'Não conseguimos enviar agora.';
  const advice =
    outcome === 'rate-limited'
      ? 'Aguarde alguns minutos e tente de novo. Se preferir, fale com a gente por um destes canais:'
      : outcome === 'invalid'
        ? 'Confira os campos e tente de novo. Se preferir, fale com a gente por um destes canais:'
        : 'Tente de novo em instantes. Se preferir, fale com a gente agora por um destes canais:';
  return (
    <div role="alert" className="rounded-xl border-2 border-[#b42318] bg-[#fff6f5] p-4 text-[0.95rem] text-[#7a1a12]" data-testid="form-error">
      <p className="font-bold">{headline}</p>
      <p className="mt-1">{advice}</p>
      <ul className="mt-2 space-y-1 font-semibold">
        <li>
          WhatsApp:{' '}
          <a href={`https://wa.me/5592994593224`} className="underline underline-offset-2" target="_blank" rel="noopener">
            {SITE.whatsappDisplay}
          </a>
        </li>
        <li>
          E-mail:{' '}
          <a href={`mailto:${SITE.email}`} className="underline underline-offset-2">
            {SITE.email}
          </a>
        </li>
      </ul>
    </div>
  );
}

export function SuccessMessage({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div role="status" className="rounded-xl border-2 border-green-700 bg-green-50 p-5 text-green-900" data-testid="form-success">
      <p className="text-lg font-extrabold">{title}</p>
      {children ? <div className="mt-1 text-[0.975rem]">{children}</div> : null}
    </div>
  );
}
