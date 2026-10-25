import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, MessageCircle, Pause, Play } from 'lucide-react';
import { LINKS } from '../../data/site';
import styles from './dock.module.css';

/*
 * Dock flutuante igual ao dos apps e do portal de conhecimento (portado de via-fluvial-app-docs:
 * src/components/dock/FloatingDock.tsx): alça amarela no canto inferior esquerdo que mostra os botões redondos
 * (suporte e rolagem automática) e, à direita, a pílula branca para ir ao topo ou ao final.
 * Mesmas chaves de armazenamento dos apps.
 */
const EXPANDED_KEY = 'vfa.floating-dock.expanded';
const DISCOVERED_KEY = 'vfa.floating-dock.discovered';

const AUTO_SCROLL_PX_PER_SECOND = 300;
const JUMP_DURATION_MS = 3000;
const EDGE_TOLERANCE_PX = 10;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
const prefersReducedMotion = () => Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

function readFlag(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function writeFlag(key: string, value: boolean) {
  try {
    window.localStorage.setItem(key, value ? '1' : '0');
  } catch {
    // Modo privado: o dock apenas começa recolhido na próxima vez.
  }
}

/** Rolagem automática (botão play) e saltos suaves para o topo e o final, como o AutoScroll dos apps. */
function useAutoScroll() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const directionRef = useRef<'down' | 'up'>('down');
  const jumpFrameRef = useRef<number | null>(null);

  const cancelJump = useCallback(() => {
    if (jumpFrameRef.current !== null) {
      cancelAnimationFrame(jumpFrameRef.current);
      jumpFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    const update = () => setCanScroll(maxScroll() > window.innerHeight * 0.5);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    if (!isScrolling) return undefined;

    let frameId = 0;
    let lastTimestamp = 0;
    // Frações de pixel acumulam para a velocidade ser a mesma em qualquer taxa de atualização.
    let pending = 0;

    const step = (timestamp: number) => {
      const elapsed = lastTimestamp === 0 ? 0 : Math.min(timestamp - lastTimestamp, 100);
      lastTimestamp = timestamp;
      pending += (AUTO_SCROLL_PX_PER_SECOND * elapsed) / 1000;
      const delta = Math.trunc(pending);
      pending -= delta;

      const current = window.scrollY;
      if (directionRef.current === 'down' && current >= maxScroll() - EDGE_TOLERANCE_PX) {
        directionRef.current = 'up';
      } else if (directionRef.current === 'up' && current <= EDGE_TOLERANCE_PX) {
        directionRef.current = 'down';
      } else if (delta > 0) {
        window.scrollBy(0, directionRef.current === 'down' ? delta : -delta);
      }
      frameId = requestAnimationFrame(step);
    };

    // Qualquer tentativa de rolar à mão devolve o controle para a pessoa.
    const stop = () => setIsScrolling(false);
    const stopOnKey = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) stop();
    };
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('keydown', stopOnKey);
    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('keydown', stopOnKey);
    };
  }, [isScrolling]);

  useEffect(() => cancelJump, [cancelJump]);

  const toggle = () => {
    cancelJump();
    setIsScrolling((value) => !value);
  };

  const jumpTo = (target: 'top' | 'bottom') => {
    cancelJump();
    setIsScrolling(false);
    const start = window.scrollY;
    const end = target === 'top' ? 0 : maxScroll();
    directionRef.current = target === 'top' ? 'down' : 'up';
    // Movimento reduzido: salta direto, sem a animação de 3 s.
    if (prefersReducedMotion()) {
      window.scrollTo(0, end);
      return;
    }
    const distance = end - start;
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / JUMP_DURATION_MS, 1);
      window.scrollTo(0, start + distance * easeInOutCubic(progress));
      jumpFrameRef.current = progress < 1 ? requestAnimationFrame(animate) : null;
    };
    jumpFrameRef.current = requestAnimationFrame(animate);
  };

  // Durante o salto animado, rolar ou tocar na tela também devolve o controle.
  useEffect(() => {
    const stopJump = () => cancelJump();
    window.addEventListener('wheel', stopJump, { passive: true });
    window.addEventListener('touchstart', stopJump, { passive: true });
    return () => {
      window.removeEventListener('wheel', stopJump);
      window.removeEventListener('touchstart', stopJump);
    };
  }, [cancelJump]);

  return { isScrolling, canScroll, toggle, jumpTo };
}

const join = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(' ');

/**
 * Dock do site (montado uma vez em Base.astro): alça amarela com suporte e rolagem automática à esquerda,
 * pílula de topo/final à direita.
 */
export default function FloatingDock() {
  // Começa recolhido (como nos apps) e lê a preferência depois de montar, para não divergir do HTML estático.
  const [expanded, setExpanded] = useState(false);
  const [discovered, setDiscovered] = useState(true);
  const itemsRef = useRef<HTMLDivElement>(null);
  const scroll = useAutoScroll();

  useEffect(() => {
    setExpanded(readFlag(EXPANDED_KEY));
    setDiscovered(readFlag(DISCOVERED_KEY));
  }, []);

  // Botões escondidos não podem ser alcançados por teclado nem por leitores de tela.
  useEffect(() => {
    itemsRef.current?.toggleAttribute('inert', !expanded);
  }, [expanded]);

  const toggle = () => {
    setExpanded((value) => {
      writeFlag(EXPANDED_KEY, !value);
      return !value;
    });
    if (!discovered) {
      setDiscovered(true);
      writeFlag(DISCOVERED_KEY, true);
    }
  };

  return (
    <>
      <div className={styles.dock} data-testid="floating-dock">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          aria-controls="vf-floating-dock-items"
          aria-label={expanded ? 'Esconder atalhos' : 'Mostrar atalhos: suporte e rolagem'}
          title={expanded ? 'Esconder' : 'Mostrar atalhos'}
          className={styles.handle}
        >
          {!expanded && !discovered ? <span className={styles.ping} aria-hidden="true" /> : null}
          {expanded ? (
            <ChevronLeft size={20} className={styles.handleIcon} aria-hidden="true" />
          ) : (
            <ChevronRight size={20} className={styles.handleIcon} aria-hidden="true" />
          )}
        </button>

        <div id="vf-floating-dock-items" ref={itemsRef} aria-hidden={!expanded} className={join(styles.items, expanded && styles.itemsOpen)}>
          <div className={styles.slot}>
            <a href={LINKS.support} target="_blank" rel="noopener" className={styles.fab} aria-label="Falar com o suporte" title="Suporte online">
              <MessageCircle size={20} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.slot} style={{ transitionDelay: expanded ? '70ms' : '0ms' }}>
            <button
              type="button"
              disabled={!scroll.canScroll}
              onClick={scroll.toggle}
              className={styles.fab}
              aria-label={scroll.isScrolling ? 'Pausar rolagem automática' : 'Iniciar rolagem automática'}
              aria-pressed={scroll.isScrolling}
              title={!scroll.canScroll ? 'Esta página não tem rolagem' : scroll.isScrolling ? 'Pausar rolagem automática' : 'Rolagem automática'}
            >
              {scroll.isScrolling ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      <div className={join(styles.pill, scroll.canScroll && styles.pillShow)}>
        <button type="button" onClick={() => scroll.jumpTo('top')} className={styles.pillBtn} aria-label="Ir para o topo" title="Ir para o topo">
          <ChevronUp size={16} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => scroll.jumpTo('bottom')} className={styles.pillBtn} aria-label="Ir para o final" title="Ir para o final">
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
