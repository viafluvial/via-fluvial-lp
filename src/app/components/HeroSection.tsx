import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sparkles } from 'lucide-react';

const heroBackgrounds = [
  'https://images.unsplash.com/photo-1703778604688-0d7037716fd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjByaXZlciUyMHN1bnNldCUyMGJvYXQlMjBtYWplc3RpY3xlbnwxfHx8fDE3NzQ0ODQxMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1559575304-b177bb908707?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjByYWluZm9yZXN0JTIwcml2ZXIlMjBhZXJpYWwlMjB2aWV3fGVufDF8fHx8MTc3NDQ4NDEzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1768854461466-a12ed654154a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXZlciUyMGJvYXQlMjB0cm9waWNhbCUyMGdvbGRlbiUyMGhvdXJ8ZW58MXx8fHwxNzc0NDg0MTMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1628263509642-7183a92a94a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjB3YXRlcndheSUyMGxhbmRzY2FwZSUyMHBhbm9yYW1pY3xlbnwxfHx8fDE3NzQ0ODQxMzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1559238983-e92abdf4d6e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXZlciUyMG5hdmlnYXRpb24lMjBzdW5zZXQlMjBiZWF1dGlmdWx8ZW58MXx8fHwxNzc0NDg0MTM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1769795082395-39b0ee92ddb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjByaXZlciUyMHdpZGUlMjBwYW5vcmFtYXxlbnwxfHx8fDE3NzQ0ODQxMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1581019299884-07fbc84acbe3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXZlciUyMGxhbmRzY2FwZSUyMGJvYXQlMjBicmF6aWx8ZW58MXx8fHwxNzc0NDg0MTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1764597477492-4cd68c21ff91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcndheSUyMHN1bnNldCUyMGJvYXQlMjBzY2VuaWN8ZW58MXx8fHwxNzc0NDg0MTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1769795070373-aa9021325c86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjBuYXR1cmUlMjByaXZlciUyMGJvYXQlMjBqb3VybmV5fGVufDF8fHx8MTc3NDQ4NDEzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1649186020284-da96dc65c3eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjByaXZlciUyMGJvYXQlMjBzdW5zZXR8ZW58MXx8fHwxNzc0NDcyMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
];

export function HeroSection() {
  const { t } = useTranslation();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Autoplay background - muda a cada 6 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A5F3B] to-[#145231] pt-20 pb-32"
    >
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 z-0">
        {heroBackgrounds.map((image, index) => (
          <img
            key={index}
            src={image}
            alt="Rio Amazônico"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1500 ${
              index === currentBgIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="mb-6 bg-[var(--amazon-gold)]/20 text-[var(--amazon-gold)] border-[var(--amazon-gold)]/30 backdrop-blur-sm px-4 py-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            {t('hero.badge')}
          </Badge>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Encontre rotas, horários e embarcações com mais confiança nos rios da Amazônia
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl">
            A Via Fluvial Amazônia está chegando para conectar passageiros, embarcações e parceiros em uma experiência digital mais simples, moderna e acessível. Cadastre-se para receber acesso antecipado, novidades do lançamento e atualizações da plataforma.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={() => scrollToSection('cta-final')}
              className="bg-[#F9C74F] hover:bg-[#F7BE35] text-[#1A5F3B] font-medium text-lg px-8 py-6"
            >
              {t('hero.cta.newsletter')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('enquete')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-8 py-6"
            >
              {t('hero.cta.poll')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}