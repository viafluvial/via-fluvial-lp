import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X } from 'lucide-react';

interface Item {
  label: string;
  href: string;
}

interface Props {
  main: Item[];
  partners: Item[];
  after: Item[];
  platformUrl: string;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Menu do celular, igual ao padrão dos apps: botão ≡ de 44px que abre uma gaveta pela direita.
 * Foco preso dentro da gaveta, Esc fecha, aria-expanded no botão e rolagem da página travada enquanto aberta.
 */
export default function MobileMenu({ main, partners, after, platformUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // A gaveta vai para o <body>: o cabeçalho fixo cria uma camada própria e deixaria o dock por cima dela.
  useEffect(() => setMounted(true), []);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    drawer.toggleAttribute('inert', !open);
    if (!open) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      const nodes = Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && (active === first || !drawer.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !drawer.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia('(min-width: 80rem)').matches) close(false);
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open, close, mounted]);

  const linkClass =
    'flex min-h-11 items-center rounded-lg px-3 py-2.5 text-[1.05rem] font-semibold text-white hover:bg-white/10 hover:text-yellow-400';

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-white hover:bg-white/10 nav:hidden"
        aria-expanded={open}
        aria-controls="vf-mobile-menu"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setOpen((value) => !value)}
      >
        <Menu size={26} aria-hidden="true" />
      </button>

      {mounted &&
        createPortal(
      <div
        className={`fixed inset-0 z-[210] nav:hidden ${open ? 'visible' : 'invisible'}`}
        style={{ transitionProperty: 'visibility', transitionDuration: open ? '0s' : '0.3s' }}
      >
        <div
          className={`absolute inset-0 bg-black/55 transition-opacity duration-300 motion-reduce:transition-none ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => close()}
          aria-hidden="true"
        />
        <div
          id="vf-mobile-menu"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal"
          className={`on-green absolute right-0 top-0 flex h-full w-[min(88vw,22rem)] flex-col bg-green-800 text-white shadow-2xl transition-transform duration-300 motion-reduce:transition-none ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex h-16 flex-none items-center justify-between border-b border-white/15 px-4">
            <span className="text-lg font-extrabold">
              ViaFluvial<span className="text-yellow-400">Amazônia</span>
            </span>
            <button
              ref={closeRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-white/10"
              aria-label="Fechar menu"
              onClick={() => close()}
            >
              <X size={26} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Menu principal" className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-0.5">
              {main.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkClass} onClick={() => close(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 px-3 text-xs font-bold uppercase tracking-wider text-yellow-400">Para parceiros</p>
            <ul className="mt-1 space-y-0.5">
              {partners.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkClass} onClick={() => close(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-4 space-y-0.5 border-t border-white/15 pt-3">
              {after.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkClass} onClick={() => close(false)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-none flex-col gap-3 border-t border-white/15 p-4">
            <a href={platformUrl} className="btn btn-yellow">
              Acessar a plataforma
            </a>
            <a href="/demonstracao" data-demo-open className="btn btn-outline-light" onClick={() => close(false)}>
              Agendar demonstração
            </a>
          </div>
        </div>
      </div>,
          document.body,
        )}
    </>
  );
}
