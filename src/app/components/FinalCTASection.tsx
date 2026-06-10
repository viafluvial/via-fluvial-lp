import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { SuccessModal } from './SuccessModal';
import confetti from 'canvas-confetti';
import { 
  Bell, 
  CheckCircle2,
  Users, 
  AlertCircle, 
  Ship, 
  User, 
  Building2, 
  Info,
  Phone
} from 'lucide-react';
import { subscribeNewsletter, getNewsletterCount, type NewsletterData } from '../utils/api';
import { getGeolocation } from '../utils/geolocation';
import { toast } from 'sonner';
import { projectId } from '/utils/supabase/info.tsx';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-63010152`;

export function FinalCTASection() {
  const { t, i18n } = useTranslation();
  
  const transportImages = [
    {
      url: 'https://images.unsplash.com/photo-1705578002916-63d28044a4a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXZlciUyMGZlcnJ5JTIwcGVvcGxlJTIwdHJhbnNwb3J0fGVufDF8fHx8MTc3NDQ4MzkyOHww&ixlib=rb-4.1.0&q=80&w=1080',
      overlayText: t('transport.image1.overlay'),
      title: t('transport.image1.title'),
      description: t('transport.image1.description'),
    },
    {
      url: 'https://images.unsplash.com/photo-1650994128962-38015e00546d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXZlcmJvYXQlMjBicmF6aWwlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzQ0ODM5Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      overlayText: t('transport.image2.overlay'),
      title: t('transport.image2.title'),
      description: t('transport.image2.description'),
    },
    {
      url: 'https://images.unsplash.com/photo-1764620757878-742dc20d4e43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGJvYXQlMjBhbWF6b24lMjBjb21tdW5pdHl8ZW58MXx8fHwxNzc0NDgzOTI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      overlayText: t('transport.image3.overlay'),
      title: t('transport.image3.title'),
      description: t('transport.image3.description'),
    },
    {
      url: 'https://images.unsplash.com/photo-1763847816545-1cca629cb045?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXJyeSUyMGJvYXQlMjByaXZlciUyMHRyb3BpY2FsfGVufDF8fHx8MTc3NDQ4MzkyOXww&ixlib=rb-4.1.0&q=80&w=1080',
      overlayText: t('transport.image4.overlay'),
      title: t('transport.image4.title'),
      description: t('transport.image4.description'),
    },
    {
      url: 'https://images.unsplash.com/photo-1767387110448-38b2649486a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcndheSUyMHRyYW5zcG9ydCUyMGJvYXQlMjBzY2VuaWN8ZW58MXx8fHwxNzc0NDgzOTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      overlayText: t('transport.image5.overlay'),
      title: t('transport.image5.title'),
      description: t('transport.image5.description'),
    },
    {
      url: 'https://images.unsplash.com/photo-1718487829635-de4ccb68474b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjBuYXZpZ2F0aW9uJTIwdmVzc2VsJTIwam91cm5leXxlbnwxfHx8fDE3NzQ0ODM5MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      overlayText: t('transport.image6.overlay'),
      title: t('transport.image6.title'),
      description: t('transport.image6.description'),
    },
    {
      url: 'https://images.unsplash.com/photo-1599011887608-d125aeefab9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXZlciUyMHRyYXZlbCUyMHZlc3NlbCUyMGFtYXpvbmlhfGVufDF8fHx8MTc3NDQ3MjIxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      overlayText: t('transport.image7.overlay'),
      title: t('transport.image7.title'),
      description: t('transport.image7.description'),
    },
  ];

  const userTypes = [
    { 
      id: 'passageiro', 
      icon: User,
    },
    { 
      id: 'barqueiro', 
      icon: Ship,
    },
    { 
      id: 'agencia', 
      icon: Building2,
    },
    { 
      id: 'outros', 
      icon: Info,
    },
  ];

  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsapp, setWhatsapp] = useState('');
  const [notify24h, setNotify24h] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isCounterLoading, setIsCounterLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Autoplay com fade - muda a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % transportImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Buscar contador real do backend
  useEffect(() => {
    const fetchCount = async () => {
      try {
        console.log('🔍 [CONTADOR SEÇÃO 9] Iniciando busca...');
        console.log('🌐 [CONTADOR SEÇÃO 9] URL:', `${API_BASE_URL}/newsletter/count`);
        
        const count = await getNewsletterCount();
        
        console.log('✅ [CONTADOR SEÇÃO 9] Resposta recebida:', count);
        console.log('📊 [CONTADOR SEÇÃO 9] Tipo:', typeof count);
        console.log('🎯 [CONTADOR SEÇÃO 9] Valor numérico:', Number(count));
        
        // Garantir que é um número válido
        const validCount = typeof count === 'number' ? count : parseInt(String(count)) || 0;
        console.log('✔️  [CONTADOR SEÇÃO 9] Valor final setado:', validCount);
        
        setSubscriberCount(validCount);
        setIsCounterLoading(false);
      } catch (err) {
        console.error('❌ [CONTADOR SEÇÃO 9] ERRO:', err);
        console.error('❌ [CONTADOR SEÇÃO 9] Detalhes:', err instanceof Error ? err.message : String(err));
        setIsCounterLoading(false);
        setSubscriberCount(0); // Setar 0 em caso de erro
      }
    };

    // Buscar imediatamente ao carregar
    console.log('🚀 [CONTADOR SEÇÃO 9] Componente montado, iniciando primeira busca...');
    fetchCount();
    
    // Atualizar a cada 15 segundos para manter sempre atualizado
    console.log('⏰ [CONTADOR SEÇÃO 9] Configurando polling a cada 15s');
    const interval = setInterval(() => {
      console.log('🔄 [CONTADOR SEÇÃO 9] Polling automático...');
      fetchCount();
    }, 15000);
    
    return () => {
      console.log('🛑 [CONTADOR SEÇÃO 9] Limpando intervalo');
      clearInterval(interval);
    };
  }, []);

  const formatWhatsApp = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Formata: (00) 00000-0000
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleSubmit = async () => {
    // Validações
    if (!userType) {
      setError(t('newsletter.error.selectProfile'));
      toast.error(t('newsletter.error.selectProfile'));
      return;
    }

    if (!email || !email.includes('@')) {
      setError(t('newsletter.error.invalidEmail'));
      toast.error(t('newsletter.error.invalidEmail'));
      return;
    }

    if (whatsappEnabled && whatsapp.replace(/\D/g, '').length < 10) {
      setError(t('newsletter.error.invalidPhone'));
      toast.error(t('newsletter.error.invalidPhone'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Buscar geolocalização
      const geolocation = await getGeolocation();
      
      // Preparar dados
      const data: NewsletterData = {
        email,
        source: `${userType}-cta-final`,
        whatsapp: whatsappEnabled ? whatsapp.replace(/\D/g, '') : undefined,
        notify24h,
        language: i18n.language,
        geolocation,
      };

      const response = await subscribeNewsletter(data);
      
      setSubmitted(true);
      setSubscriberCount(response.position);

      // Debug: verificar se os valores estão corretos
      console.log('📊 Posição do inscrito:', response.position);
      console.log('📊 Contador atualizado:', response.position);

      // Confetes!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1A5F3B', '#F9C74F', '#FFFFFF'],
      });

      toast.success(t('newsletter.success'));
      console.log('✅ Newsletter cadastrada com sucesso:', response);
    } catch (err: any) {
      console.error('❌ Erro ao cadastrar newsletter:', err);
      
      if (err.message.includes('já está cadastrado')) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError(err.message || 'Erro ao cadastrar. Tente novamente.');
        toast.error('Erro ao cadastrar. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const currentImage = transportImages[currentImageIndex];

  return (
    // Seção 9: Faça parte da jornada
    <section
      id="cta-final"
      className="py-24 relative overflow-hidden"
    >
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {transportImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={img.url}
              alt={img.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--amazon-green-dark)]/95 via-[var(--amazon-green)]/90 to-[var(--amazon-green-dark)]/95" />
          </div>
        ))}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--amazon-gold)]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {!submitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <Bell className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">
                    {t('newsletter.title')}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {t('newsletter.title')}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-2">
                  {t('newsletter.subtitle')}
                </p>
                
                {/* Subscriber count - SEMPRE VISÍVEL */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mt-4">
                  {isCounterLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-sm text-white font-medium">
                        {t('newsletter.loading')}
                      </span>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 text-white" />
                      <span className="text-sm text-white font-medium">
                        {subscriberCount > 0 
                          ? `${subscriberCount} ${subscriberCount === 1 ? 'pessoa já está' : 'pessoas já estão'} na lista de espera`
                          : t('newsletter.beFirst')}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Form Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl">
                {/* User Type Selection */}
                <div className="mb-6">
                  <Label className="text-base font-semibold text-gray-900 mb-3 block">
                    {t('newsletter.profileQuestion')}
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {userTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setUserType(type.id)}
                          className={`p-4 rounded-lg border-2 transition-all hover:border-[var(--amazon-green)] ${
                            userType === type.id
                              ? 'border-[var(--amazon-green)] bg-[var(--amazon-green-light)]'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <IconComponent className={`w-6 h-6 mx-auto mb-2 ${
                            userType === type.id ? 'text-[var(--amazon-green-dark)]' : 'text-gray-600'
                          }`} />
                          <p className="text-xs font-medium text-center">
                            {t(`newsletter.profiles.${type.id === 'passageiro' ? 'passenger' : type.id === 'barqueiro' ? 'boater' : type.id === 'agencia' ? 'agency' : 'other'}`).replace(/^[^ ]+ /, '')}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Email Input */}
                <div className="mb-4">
                  <Input
                    type="email"
                    placeholder={t('newsletter.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-12 text-base border-gray-300 focus:border-[var(--amazon-green)] focus:ring-[var(--amazon-green)]"
                  />
                </div>

                {/* WhatsApp Option */}
                <div className="mb-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="whatsapp-enabled"
                      checked={whatsappEnabled}
                      onCheckedChange={(checked) => setWhatsappEnabled(checked as boolean)}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor="whatsapp-enabled"
                      className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      {t('newsletter.whatsapp.question')}
                    </Label>
                  </div>

                  {whatsappEnabled && (
                    <Input
                      type="tel"
                      placeholder={t('newsletter.whatsapp.placeholder')}
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
                      disabled={isLoading}
                      className="h-12 text-base border-gray-300 focus:border-[var(--amazon-green)] focus:ring-[var(--amazon-green)]"
                    />
                  )}
                </div>

                {/* Notify 24h before launch */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notify-24h"
                      checked={notify24h}
                      onCheckedChange={(checked) => setNotify24h(checked as boolean)}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor="notify-24h"
                      className="text-sm font-medium text-gray-700 cursor-pointer flex items-center gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      {t('newsletter.notify24h')}
                    </Label>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 mb-4 text-red-600">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full h-12 bg-[var(--amazon-gold)] hover:bg-[var(--amazon-gold)]/90 text-[var(--amazon-green-dark)] font-semibold text-lg"
                >
                  {isLoading ? t('newsletter.subscribing') : t('newsletter.subscribe')}
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  {currentImage.overlayText}
                </p>
              </div>
            </>
          ) : (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl text-center">
              <div className="bg-[var(--amazon-green-light)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-[var(--amazon-green-dark)]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[var(--amazon-green-dark)] mb-3">
                {t('newsletter.success')}
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                {t('newsletter.position', { position: subscriberCount })}
              </p>
              <div className="inline-flex items-center gap-2 bg-[var(--amazon-green-light)] px-4 py-2 rounded-full">
                <Users className="w-4 h-4 text-[var(--amazon-green-dark)]" />
                <span className="text-sm text-[var(--amazon-green-dark)] font-medium">
                  {subscriberCount} {subscriberCount === 1 ? t('newsletter.subscribersSingular') : t('newsletter.subscribersPlural')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}