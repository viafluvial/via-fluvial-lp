import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Pause, Play } from 'lucide-react';

export function AutoScroll() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down');

  useEffect(() => {
    if (!isScrolling) return;

    let animationFrameId: number;
    let lastTimestamp = 0;
    const scrollSpeed = 5; // pixels por frame

    const scroll = (timestamp: number) => {
      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }

      const delta = timestamp - lastTimestamp;
      
      if (delta > 16) { // ~60fps
        const currentScroll = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        if (scrollDirection === 'down') {
          if (currentScroll >= maxScroll - 10) {
            // Chegou no final, muda direção para cima
            setScrollDirection('up');
          } else {
            window.scrollBy(0, scrollSpeed);
          }
        } else {
          if (currentScroll <= 10) {
            // Chegou no topo, muda direção para baixo
            setScrollDirection('down');
          } else {
            window.scrollBy(0, -scrollSpeed);
          }
        }

        lastTimestamp = timestamp;
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isScrolling, scrollDirection]);

  const toggleScroll = () => {
    setIsScrolling(!isScrolling);
  };

  const scrollToTop = () => {
    const startPosition = window.scrollY;
    const duration = 3000; // 3 segundos para scroll suave
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function para movimento suave
      const easeInOutCubic = (t: number) => 
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      
      const position = startPosition * (1 - easeInOutCubic(progress));
      window.scrollTo(0, position);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
    setScrollDirection('down');
  };

  const scrollToBottom = () => {
    const startPosition = window.scrollY;
    const targetPosition = document.documentElement.scrollHeight - window.innerHeight;
    const distance = targetPosition - startPosition;
    const duration = 3000; // 3 segundos para scroll suave
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function para movimento suave
      const easeInOutCubic = (t: number) => 
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      
      const position = startPosition + distance * easeInOutCubic(progress);
      window.scrollTo(0, position);
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
    setScrollDirection('up');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {/* Botão Play/Pause Principal */}
      <button
        onClick={toggleScroll}
        className="bg-[#1A5F3B] hover:bg-[#0f3d24] text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label={isScrolling ? 'Pausar scroll automático' : 'Iniciar scroll automático'}
      >
        {isScrolling ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>

      {/* Controles de direção */}
      <div className="bg-white rounded-full shadow-lg p-1 flex flex-col gap-1">
        <button
          onClick={scrollToTop}
          className="bg-[#1A5F3B]/10 hover:bg-[#1A5F3B]/20 text-[#1A5F3B] p-2 rounded-full transition-all"
          aria-label="Ir para o topo"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={scrollToBottom}
          className="bg-[#1A5F3B]/10 hover:bg-[#1A5F3B]/20 text-[#1A5F3B] p-2 rounded-full transition-all"
          aria-label="Ir para o final"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}