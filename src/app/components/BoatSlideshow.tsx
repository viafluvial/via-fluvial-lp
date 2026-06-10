import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from './ui/badge';

export function BoatSlideshow() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const boatImages = [
    {
      url: 'https://images.unsplash.com/photo-1598837218686-a456fdaa5cf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjByaXZlciUyMGJvYXQlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzQ0ODM1MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: t('boatSlideshow.boat1.title'),
      description: t('boatSlideshow.boat1.description'),
      overlayText: t('boatSlideshow.boat1.overlay'),
    },
    {
      url: 'https://images.unsplash.com/photo-1637441000589-202475639aa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmF6aWwlMjB3b29kZW4lMjBib2F0JTIwd2F0ZXJ8ZW58MXx8fHwxNzc0NDgzNTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: t('boatSlideshow.boat2.title'),
      description: t('boatSlideshow.boat2.description'),
      overlayText: t('boatSlideshow.boat2.overlay'),
    },
    {
      url: 'https://images.unsplash.com/photo-1773415475425-f65da557e9df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMHJpdmVyJTIwYm9hdCUyMHNjZW5pY3xlbnwxfHx8fDE3NzQ0ODM1MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: t('boatSlideshow.boat3.title'),
      description: t('boatSlideshow.boat3.description'),
      overlayText: t('boatSlideshow.boat3.overlay'),
    },
    {
      url: 'https://images.unsplash.com/photo-1547158292-c58e727209a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXZlciUyMGJvYXQlMjBqdW5nbGUlMjB0cm9waWNhbHxlbnwxfHx8fDE3NzQ0ODM1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: t('boatSlideshow.boat4.title'),
      description: t('boatSlideshow.boat4.description'),
      overlayText: t('boatSlideshow.boat4.overlay'),
    },
    {
      url: 'https://images.unsplash.com/photo-1767782556537-9e466cad418a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2F0JTIwd2F0ZXIlMjB0cmFuc3BvcnQlMjBiZWF1dGlmdWx8ZW58MXx8fHwxNzc0NDgzNTA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: t('boatSlideshow.boat5.title'),
      description: t('boatSlideshow.boat5.description'),
      overlayText: t('boatSlideshow.boat5.overlay'),
    },
    {
      url: 'https://images.unsplash.com/photo-1764752412725-6c790645aeaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGJvYXQlMjBzdW5zZXQlMjB3YXRlcnxlbnwxfHx8fDE3NzQ0ODM1MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: t('boatSlideshow.boat6.title'),
      description: t('boatSlideshow.boat6.description'),
      overlayText: t('boatSlideshow.boat6.overlay'),
    },
    {
      url: 'https://images.unsplash.com/photo-1764390692674-f8430b1f3bd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXZlciUyMGNydWlzZSUyMGJvYXQlMjBuYXR1cmV8ZW58MXx8fHwxNzc0NDgzNTA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: t('boatSlideshow.boat7.title'),
      description: t('boatSlideshow.boat7.description'),
      overlayText: t('boatSlideshow.boat7.overlay'),
    },
    {
      url: 'https://images.unsplash.com/photo-1719658928410-5d210a7acfd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2F0JTIwc2FpbGluZyUyMHJpdmVyJTIwc2NlbmljfGVufDF8fHx8MTc3NDQ4MzUxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: t('boatSlideshow.boat8.title'),
      description: t('boatSlideshow.boat8.description'),
      overlayText: t('boatSlideshow.boat8.overlay'),
    },
    {
      url: 'https://images.unsplash.com/photo-1773415169724-a317587657bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjB2ZXNzZWwlMjByaXZlciUyMGpvdXJuZXl8ZW58MXx8fHwxNzc0NDgzNTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: t('boatSlideshow.boat9.title'),
      description: t('boatSlideshow.boat9.description'),
      overlayText: t('boatSlideshow.boat9.overlay'),
    },
    {
      url: 'https://images.unsplash.com/photo-1649186020284-da96dc65c3eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjByaXZlciUyMGJvYXQlMjBzdW5zZXR8ZW58MXx8fHwxNzc0NDcyMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: t('boatSlideshow.boat10.title'),
      description: t('boatSlideshow.boat10.description'),
      overlayText: t('boatSlideshow.boat10.overlay'),
    },
  ];

  // Autoplay com fade - muda a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % boatImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % boatImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + boatImages.length) % boatImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="embarcacoes" className="py-20 md:py-32 bg-gradient-to-b from-white to-[#e8f5f0]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[var(--amazon-green-light)] text-[var(--amazon-green-dark)] border-none text-sm uppercase tracking-wider">
            {t('boatSlideshow.badge')}
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--amazon-green-dark)] mb-4">
            {t('boatSlideshow.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('boatSlideshow.subtitle')}
          </p>
        </div>

        {/* Slideshow */}
        <div className="relative max-w-7xl mx-auto">
          {/* Desktop: Slideshow com fade */}
          <div className="hidden md:block relative rounded-3xl overflow-hidden shadow-2xl h-[600px]">
            {boatImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="relative h-full">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-8 left-0 right-0 px-12 text-center">
                    <p className="text-white/95 text-2xl font-semibold tracking-wide">
                      {image.overlayText}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-12">
                    <h3 className="text-white text-4xl font-bold mb-3">
                      {image.title}
                    </h3>
                    <p className="text-white/90 text-xl">{image.description}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Indicadores de slide no desktop */}
            <div className="absolute bottom-8 left-0 right-0 flex gap-2 justify-center px-4">
              {boatImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Mobile: Slideshow com fade */}
          <div className="md:hidden relative rounded-3xl overflow-hidden shadow-2xl h-[500px]">
            {boatImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="aspect-[4/5] relative h-full">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-8 left-0 right-0 px-12 text-center">
                    <p className="text-white/95 text-2xl font-semibold tracking-wide">
                      {image.overlayText}
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-2xl font-bold mb-2">
                      {image.title}
                    </h3>
                    <p className="text-white/90 text-base">
                      {image.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Indicadores de slide no mobile */}
            <div className="absolute bottom-4 left-0 right-0 flex gap-2 justify-center px-4">
              {boatImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}