import { useTranslation } from 'react-i18next';
import { Ship, Facebook, Instagram, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router';

export function Footer() {
  const { t } = useTranslation();
  
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <footer className="bg-[#1A5F3B] text-white py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and description */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/10 p-2 rounded-lg">
                <Ship className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-semibold block">ViaFluvial</span>
                <span className="text-sm text-[#F9C74F]">Amazônia</span>
              </div>
            </div>
            <p className="text-white/80 text-sm">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.navigation')}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  onClick={handleLinkClick}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t('footer.home')}
                </Link>
              </li>
              <li>
                <a
                  href="/#sobre"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t('footer.aboutPlatform')}
                </a>
              </li>
              <li>
                <a
                  href="/#beneficios"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t('footer.benefits')}
                </a>
              </li>
              <li>
                <a
                  href="/#enquete"
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t('footer.poll')}
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.about')}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/nossa-missao"
                  onClick={handleLinkClick}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t('footer.ourMission')}
                </Link>
              </li>
              <li>
                <Link
                  to="/como-funciona"
                  onClick={handleLinkClick}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t('footer.howItWorks')}
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  onClick={handleLinkClick}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link
                  to="/contato"
                  onClick={handleLinkClick}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.socialMedia')}</h4>
            <div className="flex gap-3 mb-6">
              <a
                href="#"
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-white/10 hover:bg-white/20 p-2.5 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Mail className="w-4 h-4" />
              <a
                href="mailto:contato@viafluvial.com.br"
                className="hover:text-white transition-colors"
              >
                contato@viafluvial.com.br
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/60">
              {t('footer.copyright')}
            </p>
            <div className="flex gap-6 text-sm text-white/60">
              <Link to="/privacidade" onClick={handleLinkClick} className="hover:text-white transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to="/termos" onClick={handleLinkClick} className="hover:text-white transition-colors">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
