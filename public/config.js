// Padrão de desenvolvimento/testes: telemetria desligada. No contêiner de produção o nginx responde /config.js
// (renderizado na partida a partir de VIA_FLUVIAL_OTEL_*), então este arquivo estático nunca é servido lá.
window.__VIA_FLUVIAL_OTEL__ = { enabled: 'false', sampleRatio: '1.0', environment: 'dev' };
