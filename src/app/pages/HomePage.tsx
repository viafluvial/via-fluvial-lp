import { ProgressBar } from '../components/ProgressBar';
import { HeroSection } from '../components/HeroSection';
import { WhatIsComingSection } from '../components/WhatIsComingSection';
import { BoatSlideshow } from '../components/BoatSlideshow';
import { ForWhoSection } from '../components/ForWhoSection';
import { BenefitsSection } from '../components/BenefitsSection';
import { TravelerQuiz } from '../components/TravelerQuiz';
import { InDevelopmentSection } from '../components/InDevelopmentSection';
import { PlatformCTASection } from '../components/PlatformCTASection';
import { FAQSection } from '../components/FAQSection';
import { AutoScroll } from '../components/AutoScroll';

export function HomePage() {
  return (
    <>
      <ProgressBar />
      {/* Seção 1: Hero */}
      <HeroSection />
      {/* Seção 2: O que está vindo */}
      <WhatIsComingSection />
      {/* Seção 3: Embarcações */}
      <BoatSlideshow />
      {/* Seção 4: Para quem é */}
      <ForWhoSection />
      {/* Seção 5: Benefícios */}
      <BenefitsSection />
      {/* Seção 6: Quiz */}
      <TravelerQuiz />
      {/* Seção 9: Em desenvolvimento */}
      <InDevelopmentSection />
      {/* Seção 10: FAQ */}
      <FAQSection />
      {/* A plataforma já está no ar: acesso e contatos (sem coleta de dados) */}
      <PlatformCTASection />
      <AutoScroll />
    </>
  );
}