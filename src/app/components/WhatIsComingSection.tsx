import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';
import { Search, ShoppingBag, Zap, Rocket } from 'lucide-react';

export function WhatIsComingSection() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Search,
      titleKey: 'whatIsComing.feature1.title',
      descriptionKey: 'whatIsComing.feature1.description',
    },
    {
      icon: ShoppingBag,
      titleKey: 'whatIsComing.feature2.title',
      descriptionKey: 'whatIsComing.feature2.description',
    },
    {
      icon: Zap,
      titleKey: 'whatIsComing.feature3.title',
      descriptionKey: 'whatIsComing.feature3.description',
    },
    {
      icon: Rocket,
      titleKey: 'whatIsComing.feature4.title',
      descriptionKey: 'whatIsComing.feature4.description',
    },
  ];

  return (
    <section id="sobre" className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A5F3B] mb-4">
            {t('whatIsComing.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            {t('whatIsComing.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow border-gray-200"
              >
                <div className="bg-[var(--amazon-green-light)] w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-[var(--amazon-green-dark)]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {t(feature.descriptionKey)}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
