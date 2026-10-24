import { useTranslation } from 'react-i18next';
import { Mail, MessageCircle, Package, Ship } from 'lucide-react';

const PLATFORM_URL = 'https://viafluvial.com.br';
const CARGAS_URL = 'https://viafluvial.com.br/cargas/';
const WHATSAPP_URL = 'https://wa.me/5592994593224';
const CONTACT_EMAIL = 'contato@viafluvial.com.br';

export function PlatformCTASection() {
  const { t } = useTranslation();

  return (
    <section id="cta-final" className="py-24 bg-[#1A5F3B] text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{t('platformCta.title')}</h2>
          <p className="text-lg md:text-xl text-green-50 mb-10">{t('platformCta.subtitle')}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href={PLATFORM_URL}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F9C74F] px-6 py-4 font-semibold text-[#1A5F3B] hover:bg-[#f7be35]"
            >
              <Ship className="w-5 h-5" /> {t('platformCta.passengers')}
            </a>
            <a
              href={CARGAS_URL}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white px-6 py-4 font-semibold text-white hover:bg-white/10"
            >
              <Package className="w-5 h-5" /> {t('platformCta.cargo')}
            </a>
          </div>

          <p className="text-green-50 mb-4">{t('platformCta.contact')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 underline">
              <MessageCircle className="w-5 h-5" /> WhatsApp +55 92 99459-3224
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center justify-center gap-2 underline">
              <Mail className="w-5 h-5" /> {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
