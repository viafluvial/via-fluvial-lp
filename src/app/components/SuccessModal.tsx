import { useTranslation } from 'react-i18next';
import { CheckCircle2, Mail, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface SuccessModalProps {
  show: boolean;
  onClose: () => void;
  email?: string;
  hasWhatsApp?: boolean;
  notify24h?: boolean;
  quizResult?: string;
}

export function SuccessModal({
  show,
  onClose,
  email,
  hasWhatsApp,
  notify24h,
  quizResult,
}: SuccessModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (show) {
      // Confetti celebration
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="max-w-2xl w-full bg-white p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-4">
              <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
          {t('success.title')}
        </h2>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 text-center mb-8">
          {t('success.subtitle')}
        </p>

        {/* Info Cards */}
        <div className="space-y-4 mb-8">
          {/* Email Confirmation */}
          {email && (
            <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">
                  {t('success.emailConfirmation')}
                </p>
                <p className="text-sm text-gray-600">{email}</p>
              </div>
            </div>
          )}

          {/* WhatsApp Confirmation */}
          {hasWhatsApp && (
            <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">
                  {t('success.whatsappConfirmation')}
                </p>
                <p className="text-sm text-gray-600">
                  {t('success.whatsappMessage')}
                </p>
              </div>
            </div>
          )}

          {/* 24h Notification */}
          {notify24h && (
            <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">
                  {t('success.notification24h')}
                </p>
                <p className="text-sm text-gray-600">
                  {t('success.notification24hMessage')}
                </p>
              </div>
            </div>
          )}

          {/* Quiz Result */}
          {quizResult && (
            <div className="flex items-start gap-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg text-2xl">
                {t(`quiz.results.${quizResult}.emoji`)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">
                  {t('success.quizResultTitle')}
                </p>
                <p className="text-sm text-gray-600">
                  {t(`quiz.results.${quizResult}.name`)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* What's Next */}
        <div className="bg-[var(--amazon-green-light)] border border-[var(--amazon-green)]/30 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-[var(--amazon-green-dark)] mb-3">
            {t('success.whatsNextTitle')}
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--amazon-green)] mt-0.5 flex-shrink-0" />
              <span>{t('success.nextStep1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--amazon-green)] mt-0.5 flex-shrink-0" />
              <span>{t('success.nextStep2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--amazon-green)] mt-0.5 flex-shrink-0" />
              <span>{t('success.nextStep3')}</span>
            </li>
          </ul>
        </div>

        {/* Close Button */}
        <Button
          onClick={onClose}
          className="w-full bg-[var(--amazon-green-dark)] hover:bg-[var(--amazon-green-hover)] text-white text-lg py-6"
        >
          {t('success.closeButton')}
        </Button>

        {/* Footer Message */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {t('success.footerMessage')}
        </p>
      </Card>
    </div>
  );
}
