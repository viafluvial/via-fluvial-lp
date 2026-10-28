/**
 * Inicializa a telemetria uma única vez, depois do carregamento do script (o SDK entra em um chunk assíncrono e não
 * bloqueia a renderização). Sem /config.js habilitado (dev, testes) nada é carregado.
 */
import { readOtelConfig } from './config';

const config = readOtelConfig();

if (config.enabled) {
  const buildId = String(import.meta.env.PUBLIC_APP_BUILD_ID ?? 'dev');
  import('./telemetry')
    .then((module) => module.startTelemetry(config, buildId))
    .catch(() => undefined);
}
