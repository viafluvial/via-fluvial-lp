import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';
import { Users, Ship, Handshake, BarChart3 } from 'lucide-react';

export function ForWhoSection() {
  const { t } = useTranslation();
  
  const audiences = [
    {
      icon: Users,
      titleKey: 'forWho.passengers.title',
      descriptionKey: 'forWho.passengers.description',
      color: 'bg-[var(--amazon-green-light)]',
      iconColor: 'text-[var(--amazon-green-dark)]',
    },
    {
      icon: Ship,
      titleKey: 'forWho.boaters.title',
      descriptionKey: 'forWho.boaters.description',
      color: 'bg-[var(--amazon-water-light)]',
      iconColor: 'text-[var(--amazon-water)]',
    },
    {
      icon: Handshake,
      titleKey: 'forWho.agencies.title',
      descriptionKey: 'forWho.agencies.description',
      color: 'bg-[var(--amazon-gold-light)]',
      iconColor: 'text-[var(--amazon-gold)]',
    },
    {
      icon: BarChart3,
      titleKey: 'forWho.management.title',
      descriptionKey: 'forWho.management.description',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <section id="para-quem" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A5F3B] mb-4">
            {t('forWho.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            {t('forWho.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-gray-200 bg-white"
              >
                <div
                  className={`${audience.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-7 h-7 ${audience.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t(audience.titleKey)}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {t(audience.descriptionKey)}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}