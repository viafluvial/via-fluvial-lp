import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

const questions = [
  {
    id: 'frequency',
    options: ['daily', 'monthly', 'yearly', 'rarely']
  },
  {
    id: 'reason',
    options: ['work', 'family', 'tourism', 'studies']
  },
  {
    id: 'priority',
    options: ['punctuality', 'price', 'comfort', 'safety']
  }
];

type ProfileType = 'commuter' | 'family' | 'explorer' | 'occasional';

function calculateProfile(answers: string[]): ProfileType {
  const [frequency, reason, priority] = answers;

  // Commuter: daily/monthly + work + punctuality/price
  if ((frequency === 'daily' || frequency === 'monthly') && 
      reason === 'work' && 
      (priority === 'punctuality' || priority === 'price')) {
    return 'commuter';
  }

  // Family: any frequency + family + safety/comfort
  if (reason === 'family' && (priority === 'safety' || priority === 'comfort')) {
    return 'family';
  }

  // Explorer: yearly + tourism + comfort/safety
  if (frequency === 'yearly' && reason === 'tourism') {
    return 'explorer';
  }

  // Occasional: rarely + any reason
  if (frequency === 'rarely') {
    return 'occasional';
  }

  // Default to occasional
  return 'occasional';
}

export function TravelerQuiz() {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const goNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Show result
      const calculatedProfile = calculateProfile(answers);
      setProfile(calculatedProfile);
      setShowResult(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const restart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setProfile(null);
  };

  const currentAnswer = answers[currentQuestion];
  const canProceed = currentAnswer !== undefined;

  return (
    <section
      id="quiz"
      className="py-24 bg-gradient-to-br from-[var(--amazon-gold)]/20 to-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--amazon-green)]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--amazon-gold)]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[var(--amazon-gold)]/20 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-[var(--amazon-green-dark)]" />
              <span className="text-[var(--amazon-green-dark)] font-medium">
                {t('quiz.title')}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--amazon-green-dark)] mb-4">
              {t('quiz.title')}
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              {t('quiz.subtitle')}
            </p>
          </div>

          <Card className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Progress indicator */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        Pergunta {currentQuestion + 1} de {questions.length}
                      </span>
                      <span className="text-sm font-semibold text-[var(--amazon-green)]">
                        {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[var(--amazon-green)] to-[var(--amazon-gold)]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
                    {t(`quiz.question${currentQuestion + 1}`)}
                  </h3>

                  {/* Options */}
                  <RadioGroup value={currentAnswer} onValueChange={handleAnswer}>
                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option, index) => (
                        <div
                          key={option}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-[var(--amazon-green)] ${
                            currentAnswer === option
                              ? 'border-[var(--amazon-green)] bg-[var(--amazon-green-light)]'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => handleAnswer(option)}
                        >
                          <RadioGroupItem value={option} id={`option-${option}`} />
                          <Label
                            htmlFor={`option-${option}`}
                            className="flex-1 cursor-pointer text-base"
                          >
                            {t(`quiz.question${currentQuestion + 1}.option${index + 1}`)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>

                  {/* Navigation buttons */}
                  <div className="flex gap-3 mt-8">
                    {currentQuestion > 0 && (
                      <Button
                        onClick={goBack}
                        variant="outline"
                        className="flex-1"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        {t('quiz.previous')}
                      </Button>
                    )}
                    <Button
                      onClick={goNext}
                      disabled={!canProceed}
                      className="flex-1 bg-[var(--amazon-green)] hover:bg-[var(--amazon-green-dark)] text-white"
                    >
                      {currentQuestion === questions.length - 1 ? t('quiz.finish') : t('quiz.next')}
                      {currentQuestion < questions.length - 1 && (
                        <ChevronRight className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8"
                >
                  <div className="bg-gradient-to-br from-[var(--amazon-green-light)] to-[var(--amazon-gold)]/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-12 h-12 text-[var(--amazon-green-dark)]" />
                  </div>

                  <p className="text-lg text-gray-600 mb-2">
                    {t('quiz.result.title')}
                  </p>

                  <h3 className="text-3xl md:text-4xl font-bold text-[var(--amazon-green-dark)] mb-6">
                    {t(`quiz.result.${profile}.title`)}
                  </h3>

                  <p className="text-lg text-gray-700 leading-relaxed mb-8 max-w-xl mx-auto">
                    {t(`quiz.result.${profile}.description`)}
                  </p>

                  <Button
                    onClick={restart}
                    variant="outline"
                    className="border-[var(--amazon-green)] text-[var(--amazon-green)] hover:bg-[var(--amazon-green-light)]"
                  >
                    {t('quiz.restart')}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </section>
  );
}