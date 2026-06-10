import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export function ProgressBar() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const totalSections = 9;

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      
      // Avoid NaN when documentHeight is 0
      const progressPercent = documentHeight > 0 
        ? (scrolled / documentHeight) * 100 
        : 0;
      
      setProgress(Math.min(progressPercent, 100));

      // Calculate current section based on scroll position
      const sections = document.querySelectorAll('section[id]');
      let current = 1;
      
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
          current = index + 1;
        }
      });
      
      setCurrentSection(Math.min(current, totalSections));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[var(--amazon-green-dark)]">
            Via Fluvial
          </span>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
            <span className="bg-[var(--amazon-green-light)] text-[var(--amazon-green-dark)] px-2 py-1 rounded-full font-semibold">
              {currentSection}/{totalSections}
            </span>
            <span className="text-gray-500">
              {Math.round(progress)}% {t('progress.explored')}
            </span>
          </div>
        </div>

        {/* Mobile section indicator */}
        <div className="sm:hidden flex items-center gap-1">
          {Array.from({ length: totalSections }).map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index + 1 <= currentSection
                  ? 'bg-[var(--amazon-green)]'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <motion.div
        className="h-1 bg-gradient-to-r from-[var(--amazon-green)] to-[var(--amazon-gold)]"
        initial={{ width: "0%" }}
        animate={{ width: `${Math.max(0, progress)}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}