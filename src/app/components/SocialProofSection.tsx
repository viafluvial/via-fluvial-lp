import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Users, MessageSquare, CheckCircle2, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { getNewsletterCount, getPollStats } from '../utils/api';
import { Badge } from './ui/badge';

export function SocialProofSection() {
  const { t } = useTranslation();
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [pollResponseCount, setPollResponseCount] = useState(0);
  const [topFeatures, setTopFeatures] = useState<Array<{ option: string; votes: number }>>([]);

  useEffect(() => {
    // Buscar contador de inscritos
    getNewsletterCount()
      .then((count) => setSubscriberCount(count))
      .catch(() => setSubscriberCount(0));

    // Buscar estatísticas da enquete
    getPollStats()
      .then((stats) => {
        setPollResponseCount(stats.totalResponses || 0);
        // Ordenar por votos e pegar top 4
        const sorted = [...(stats.options || [])].sort((a, b) => b.votes - a.votes).slice(0, 4);
        setTopFeatures(sorted);
      })
      .catch(() => {
        setPollResponseCount(0);
        setTopFeatures([]);
      });
  }, []);

  const stats = [
    {
      icon: Users,
      value: subscriberCount,
      label: t('socialProof.subscribersLabel'),
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: MessageSquare,
      value: pollResponseCount,
      label: t('socialProof.pollResponsesLabel'),
      color: 'bg-green-100 text-green-600',
    },
  ];

  return (
    <section id="social-proof" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[var(--amazon-gold)]/20 text-[var(--amazon-gold)] border-[var(--amazon-gold)]/30">
            <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
            {t('socialProof.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('socialProof.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('socialProof.subtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="p-6 bg-white border-2 border-gray-200 hover:border-[var(--amazon-green)] transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-full ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      {stat.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Top Features */}
        {topFeatures.length > 0 && (
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {t('socialProof.topFeaturesTitle')}
            </h3>
            <div className="space-y-4">
              {topFeatures.map((feature, index) => {
                // Calcular porcentagem
                const maxVotes = topFeatures[0]?.votes || 1;
                const percentage = (feature.votes / maxVotes) * 100;

                return (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--amazon-green)] text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-gray-900">
                          {t(`poll.options.${feature.option}`)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">
                          {feature.votes} {t('socialProof.votesLabel')}
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-[var(--amazon-green)]" />
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--amazon-green)] to-[var(--amazon-green-dark)] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-4">
            {t('socialProof.joinMessage')}
          </p>
        </div>
      </div>
    </section>
  );
}
