import { useTranslation } from 'react-i18next';
import { Code2, Layers, Users } from 'lucide-react';

export function InDevelopmentSection() {
  const { t } = useTranslation();
  
  return (
    <section id="desenvolvimento" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A5F3B] mb-4">
              {t('inDevelopment.title')}
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              {t('inDevelopment.subtitle')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 lg:p-12 shadow-lg">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 md:mb-8">
              {t('inDevelopment.description1')}
            </p>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {t('inDevelopment.description2')}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="bg-[var(--amazon-green-light)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code2 className="w-8 h-8 text-[var(--amazon-green-dark)]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('inDevelopment.feature1.title')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('inDevelopment.feature1.description')}
                </p>
              </div>

              <div className="text-center">
                <div className="bg-[var(--amazon-water-light)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-8 h-8 text-[var(--amazon-water)]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('inDevelopment.feature2.title')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('inDevelopment.feature2.description')}
                </p>
              </div>

              <div className="text-center">
                <div className="bg-[var(--amazon-gold-light)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[var(--amazon-gold)]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('inDevelopment.feature3.title')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('inDevelopment.feature3.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}