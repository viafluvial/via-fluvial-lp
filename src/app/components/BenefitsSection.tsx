import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

const benefitImages = [
  'https://images.unsplash.com/photo-1653149875526-e2533c6af095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjByaXZlciUyMGFlcmlhbCUyMHZpZXclMjBmb3Jlc3R8ZW58MXx8fHwxNzc0NDg0MTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1768365424358-e9125228b57a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluZm9yZXN0JTIwcml2ZXIlMjB3aW5kaW5nJTIwYWVyaWFsfGVufDF8fHx8MTc3NDQ4NDEzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1574100607234-db310a8b4212?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMHJpdmVyJTIwZ3JlZW4lMjBmb3Jlc3R8ZW58MXx8fHwxNzc0NDg0MTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1769794142275-ed099e69b59b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjBqdW5nbGUlMjByaXZlciUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzQ0ODQxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1565574509383-0d36da087afd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXZlciUyMGFlcmlhbCUyMGJyYXppbCUyMG5hdHVyZXxlbnwxfHx8fDE3NzQ0ODQxMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1769794305664-cfb57957246f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluZm9yZXN0JTIwd2F0ZXJ3YXklMjBiaXJkcyUyMGV5ZXxlbnwxfHx8fDE3NzQ0ODQxMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1691098343433-05584b38e1bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjByaXZlciUyMGNhbm9weSUyMGFlcmlhbHxlbnwxfHx8fDE3NzQ0ODQxMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1682082128593-8bc55bd8521f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGZvcmVzdCUyMHJpdmVyJTIwZHJvbmV8ZW58MXx8fHwxNzc0NDg0MTM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1604092257464-d0d7f0d167bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWF6b24lMjB2aXN0YSUyMGFlcmlhbCUyMGJlYXV0aWZ1bHxlbnwxfHx8fDE3NzQ0ODQxNDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1530618655905-2063770256bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaXZlciUyMGZvcmVzdCUyMGJyYXppbCUyMG92ZXJoZWFkfGVufDF8fHx8MTc3NDQ4NDE0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
];

export function BenefitsSection() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Autoplay com fade - muda a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % benefitImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const benefits = [
    'benefits.item1',
    'benefits.item2',
    'benefits.item3',
    'benefits.item4',
    'benefits.item5',
  ];

  const imageData = [
    { overlayKey: 'benefits.image1.overlay', titleKey: 'benefits.image1.title', descriptionKey: 'benefits.image1.description' },
    { overlayKey: 'benefits.image2.overlay', titleKey: 'benefits.image2.title', descriptionKey: 'benefits.image2.description' },
    { overlayKey: 'benefits.image3.overlay', titleKey: 'benefits.image3.title', descriptionKey: 'benefits.image3.description' },
    { overlayKey: 'benefits.image4.overlay', titleKey: 'benefits.image4.title', descriptionKey: 'benefits.image4.description' },
    { overlayKey: 'benefits.image5.overlay', titleKey: 'benefits.image5.title', descriptionKey: 'benefits.image5.description' },
    { overlayKey: 'benefits.image6.overlay', titleKey: 'benefits.image6.title', descriptionKey: 'benefits.image6.description' },
    { overlayKey: 'benefits.image7.overlay', titleKey: 'benefits.image7.title', descriptionKey: 'benefits.image7.description' },
    { overlayKey: 'benefits.image8.overlay', titleKey: 'benefits.image8.title', descriptionKey: 'benefits.image8.description' },
    { overlayKey: 'benefits.image9.overlay', titleKey: 'benefits.image9.title', descriptionKey: 'benefits.image9.description' },
    { overlayKey: 'benefits.image10.overlay', titleKey: 'benefits.image10.title', descriptionKey: 'benefits.image10.description' },
  ];

  return (
    <section id="beneficios" className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A5F3B] mb-4">
            {t('benefits.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            {t('benefits.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Slideshow */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px]">
              {benefitImages.map((image, index) => (
                <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}>
                  <img
                    src={image}
                    alt={t(imageData[index].titleKey)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-8 left-0 right-0 px-12 text-center">
                    <p className="text-white/95 text-2xl font-semibold tracking-wide">{t(imageData[index].overlayKey)}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-12">
                    <h3 className="text-white text-4xl font-bold mb-3">{t(imageData[index].titleKey)}</h3>
                    <p className="text-white/90 text-xl">{t(imageData[index].descriptionKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--amazon-green-dark)] mb-6">
              {t('benefits.mainTitle')}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t('benefits.mainDescription')}
            </p>

            <div className="space-y-4">
              {benefits.map((benefitKey, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-[var(--amazon-green-light)] rounded-full p-1 mt-1">
                    <Check className="w-5 h-5 text-[var(--amazon-green-dark)]" />
                  </div>
                  <p className="text-lg text-gray-700">{t(benefitKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
