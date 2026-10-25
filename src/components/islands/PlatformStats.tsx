import { useEffect, useState } from 'react';

/** Mínimos decididos para publicar cada número (regra do item 5.9 da proposta). */
export const MIN_PASSENGERS = 1000;
export const MIN_BOOKINGS = 500;

const FALLBACK_TEXT = 'Em operação nas rotas do Amazonas';

interface Summary {
  passengersTransported?: number;
  confirmedBookings?: number;
}

const formatter = new Intl.NumberFormat('pt-BR');

async function enabled(): Promise<boolean> {
  try {
    const response = await fetch('/runtime-config.json', { cache: 'no-store', credentials: 'omit' });
    if (!response.ok) return false;
    const config = (await response.json()) as { platformStatsEnabled?: unknown };
    return config.platformStatsEnabled === true;
  } catch {
    return false;
  }
}

/**
 * Faixa "números da plataforma". Fica desligada por padrão (PLATFORM_STATS_ENABLED=false): mostra só
 * "Em operação nas rotas do Amazonas". Quando ligada, cada número aparece apenas se passar do mínimo.
 */
export default function PlatformStats() {
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!(await enabled())) return;
      try {
        const response = await fetch('/api/reservas/public/stats/summary', { credentials: 'omit' });
        if (!response.ok) return;
        const data = (await response.json()) as Summary;
        const next: { label: string; value: string }[] = [];
        if (typeof data.passengersTransported === 'number' && data.passengersTransported >= MIN_PASSENGERS) {
          next.push({ label: 'passageiros transportados', value: formatter.format(data.passengersTransported) });
        }
        if (typeof data.confirmedBookings === 'number' && data.confirmedBookings >= MIN_BOOKINGS) {
          next.push({ label: 'reservas confirmadas', value: formatter.format(data.confirmedBookings) });
        }
        if (!cancelled) setItems(next);
      } catch {
        // Sem resposta: a faixa continua com o texto padrão.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (items.length === 0) {
    return (
      <p className="text-lg font-bold text-green-800" data-testid="platform-stats-fallback">
        {FALLBACK_TEXT}
      </p>
    );
  }

  return (
    <ul className="flex flex-wrap justify-center gap-x-10 gap-y-3" data-testid="platform-stats-numbers">
      {items.map((item) => (
        <li key={item.label} className="text-center">
          <span className="block text-3xl font-extrabold text-green-800">{item.value}</span>
          <span className="text-sm font-semibold text-muted">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
