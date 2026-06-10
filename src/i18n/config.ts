import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { translationsPt } from './locales/pt';
import { translationsEn } from './locales/en';
import { translationsEs } from './locales/es';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: translationsPt },
      en: { translation: translationsEn },
      es: { translation: translationsEs },
    },
    fallbackLng: 'pt',
    lng: 'pt', // Define pt como idioma padrão
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;