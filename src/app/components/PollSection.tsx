import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { CheckCircle2, MessageCircle, Lightbulb, AlertCircle, Users } from 'lucide-react';
import { submitPoll, getPollStats } from '../utils/api';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export function PollSection() {
  const { t } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pollCount, setPollCount] = useState(0);
  const [isCounterLoading, setIsCounterLoading] = useState(true);

  // Buscar contador de respostas da enquete
  useEffect(() => {
    const fetchPollStats = async () => {
      try {
        console.log('🔍 [POLL] Buscando estatísticas da enquete...');
        const stats = await getPollStats();
        console.log('✅ [POLL] Estatísticas recebidas:', stats);
        setPollCount(stats.totalResponses || 0);
        setIsCounterLoading(false);
      } catch (err) {
        console.error('❌ [POLL] Erro ao buscar estatísticas:', err);
        setIsCounterLoading(false);
        setPollCount(0);
      }
    };

    fetchPollStats();
    
    // Atualizar a cada 15 segundos
    const interval = setInterval(fetchPollStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const pollOptions = [
    { id: 'comprar', labelKey: 'poll.options.buyTicket' },
    { id: 'horarios', labelKey: 'poll.options.schedules' },
    { id: 'acompanhar', labelKey: 'poll.options.tracking' },
    { id: 'pagar', labelKey: 'poll.options.payment' },
    { id: 'confiaveis', labelKey: 'poll.options.reliable' },
  ];

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSubmit = async () => {
    if (selectedOptions.length === 0) {
      setError(t('poll.error.selectOne'));
      toast.error(t('poll.error.selectOne'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await submitPoll(selectedOptions, suggestions);
      setSubmitted(true);
      console.log('✅ Enquete salva no Supabase:', response);
      toast.success(t('poll.success.message'));
      
      // Log para tracking
      console.log('Dados enviados:', {
        opcoesSelecionadas: selectedOptions,
        temSugestao: !!suggestions,
        totalRespostas: response.totalResponses
      });

      // Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error('❌ Erro ao enviar enquete:', err);
      setError(err.message || t('poll.error.selectOne'));
      toast.error(err.message || t('poll.error.selectOne'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="enquete"
      className="py-24 bg-gradient-to-br from-[var(--amazon-green-dark)] to-[var(--amazon-green)] relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <MessageCircle className="w-5 h-5 text-white" />
              <span className="text-white font-medium">{t('poll.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {t('poll.title')}
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-4">
              {t('poll.subtitle')}
            </p>
            
            {/* Poll response count */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              {isCounterLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm text-white font-medium">{t('poll.loading')}</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 text-white" />
                  <span className="text-sm text-white font-medium">
                    {pollCount > 0 
                      ? `${pollCount} ${pollCount === 1 ? 'pessoa já respondeu' : 'pessoas já responderam'} esta enquete` 
                      : t('poll.beFirst')}
                  </span>
                </>
              )}
            </div>
          </div>

          <Card className="p-6 md:p-8 bg-white/95 backdrop-blur-sm shadow-2xl">
            {!submitted ? (
              <>
                <h3 className="text-xl md:text-2xl font-semibold text-[var(--amazon-green-dark)] mb-2">
                  {t('poll.question')}
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-6">
                  {t('poll.instruction')}
                </p>

                <div className="space-y-3">
                  {pollOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-[var(--amazon-green)] ${
                        selectedOptions.includes(option.id)
                          ? 'border-[var(--amazon-green)] bg-[var(--amazon-green-light)]'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleOptionToggle(option.id)}
                    >
                      <Checkbox
                        checked={selectedOptions.includes(option.id)}
                        onCheckedChange={() => handleOptionToggle(option.id)}
                        id={option.id}
                      />
                      <Label
                        htmlFor={option.id}
                        className="flex-1 cursor-pointer text-base"
                      >
                        {t(option.labelKey)}
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Campo de sugestões abertas */}
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-[var(--amazon-gold)]" />
                    <Label htmlFor="suggestions" className="text-base font-semibold text-gray-900">
                      {t('poll.suggestions.label')}
                    </Label>
                  </div>
                  <Textarea
                    id="suggestions"
                    placeholder={t('poll.suggestions.placeholder')}
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                    disabled={isLoading}
                    className="min-h-[120px] resize-none border-gray-300 focus:border-[var(--amazon-green)] focus:ring-[var(--amazon-green)]"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {t('poll.suggestions.help')}
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 mt-4 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={selectedOptions.length === 0 || isLoading}
                  className="w-full mt-8 bg-[#F9C74F] hover:bg-[#F7BE35] text-[#1A5F3B] font-medium text-lg py-6 disabled:opacity-50"
                >
                  {isLoading ? t('poll.submitting') : t('poll.submit')}
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="bg-[var(--amazon-green-light)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-[var(--amazon-green-dark)]" />
                </div>
                <h3 className="text-2xl font-semibold text-[var(--amazon-green-dark)] mb-3">
                  {t('poll.success.title')}
                </h3>
                <p className="text-lg text-gray-600">
                  {t('poll.success.message')}
                </p>
                {suggestions && (
                  <div className="mt-6 p-4 bg-[var(--amazon-green-light)] rounded-lg">
                    <p className="text-sm text-[var(--amazon-green-dark)] font-medium mb-2">
                      {t('poll.success.suggestions')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {!submitted && (
            <p className="text-center text-white/80 mt-6 text-sm">
              {t('poll.footer')}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}