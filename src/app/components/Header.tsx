import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Anchor } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { LanguageSelector } from './LanguageSelector';

export function Header() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A5F3B] shadow-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Estilo similar ao design */}
          <Link to="/" className="flex items-center gap-2 group z-50">
            <Anchor className="w-8 h-8 text-white" />
            <div>
              <span className="text-white font-semibold text-lg">ViaFluvial</span>
              <span className="text-[#F9C74F] font-semibold text-lg">Amazônia</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {isHomePage ? (
              <>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="text-sm text-white/90 hover:text-white transition-colors"
                >
                  {t('nav.home')}
                </button>
                <button
                  onClick={() => scrollToSection('sobre')}
                  className="text-sm text-white/90 hover:text-white transition-colors"
                >
                  {t('nav.about')}
                </button>
                <button
                  onClick={() => scrollToSection('beneficios')}
                  className="text-sm text-white/90 hover:text-white transition-colors"
                >
                  {t('nav.benefits')}
                </button>
                <button
                  onClick={() => scrollToSection('quiz')}
                  className="text-sm text-white/90 hover:text-white transition-colors"
                >
                  Quiz
                </button>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="text-sm text-white/90 hover:text-white transition-colors"
                >
                  FAQ
                </button>
                <button
                  onClick={() => scrollToSection('cta-final')}
                  className="bg-[#F9C74F] hover:bg-[#F7BE35] text-[#1A5F3B] px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                >
                  Entrar na lista de espera
                </button>
              </>
            ) : (
              <Link to="/" className="text-sm text-white/90 hover:text-white transition-colors">
                {t('nav.backToHome')}
              </Link>
            )}
            <div className="border-l border-white/20 h-6 mx-2" />
            <LanguageSelector />
          </nav>

          {/* Right side with language selector and mobile menu */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              {/* Language selector is inside nav on desktop */}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white z-50"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 bg-[#1A5F3B] transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '64px' }}
      >
        <nav className="flex flex-col p-6 space-y-6">
          {isHomePage ? (
            <>
              <button
                onClick={() => scrollToSection('hero')}
                className="text-lg text-white/90 hover:text-white transition-colors text-left py-3 border-b border-white/10"
              >
                {t('nav.home')}
              </button>
              <button
                onClick={() => scrollToSection('sobre')}
                className="text-lg text-white/90 hover:text-white transition-colors text-left py-3 border-b border-white/10"
              >
                {t('nav.about')}
              </button>
              <button
                onClick={() => scrollToSection('beneficios')}
                className="text-lg text-white/90 hover:text-white transition-colors text-left py-3 border-b border-white/10"
              >
                {t('nav.benefits')}
              </button>
              <button
                onClick={() => scrollToSection('quiz')}
                className="text-lg text-white/90 hover:text-white transition-colors text-left py-3 border-b border-white/10"
              >
                Quiz
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-lg text-white/90 hover:text-white transition-colors text-left py-3 border-b border-white/10"
              >
                FAQ
              </button>
              <button
                onClick={() => scrollToSection('cta-final')}
                className="bg-[#F9C74F] hover:bg-[#F7BE35] text-[#1A5F3B] px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                Entrar na lista de espera
              </button>
            </>
          ) : (
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg text-white/90 hover:text-white transition-colors text-left py-3 border-b border-white/10"
            >
              {t('nav.backToHome')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}