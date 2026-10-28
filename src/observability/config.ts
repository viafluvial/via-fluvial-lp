/**
 * Configuração de telemetria em runtime. O nginx do contêiner serve /config.js (renderizado na partida a partir das
 * variáveis VIA_FLUVIAL_OTEL_*) que define window.__VIA_FLUVIAL_OTEL__. Sem esse arquivo (dev server, testes) a
 * telemetria fica desligada. A chave do Coroot NUNCA aparece aqui: ela só existe no nginx.
 */
export interface OtelRuntimeConfig {
  enabled: boolean;
  sampleRatio: number;
  environment: string;
}

interface RawConfig {
  enabled?: unknown;
  sampleRatio?: unknown;
  environment?: unknown;
}

export function parseOtelConfig(raw: RawConfig | undefined | null): OtelRuntimeConfig {
  if (!raw) return { enabled: false, sampleRatio: 1, environment: 'dev' };
  const enabled = ['1', 'true', 'yes', 'on'].includes(String(raw.enabled ?? '').trim().toLowerCase());
  const parsed = Number.parseFloat(String(raw.sampleRatio ?? '1'));
  const sampleRatio = Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 1;
  const environment = String(raw.environment ?? '').trim() || 'prd';
  return { enabled, sampleRatio, environment };
}

export function readOtelConfig(): OtelRuntimeConfig {
  if (typeof window === 'undefined') return parseOtelConfig(null);
  return parseOtelConfig((window as unknown as { __VIA_FLUVIAL_OTEL__?: RawConfig }).__VIA_FLUVIAL_OTEL__);
}
