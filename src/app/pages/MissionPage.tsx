import { Target, Heart, Users, Compass } from 'lucide-react';
import { AutoScroll } from '../components/AutoScroll';

export function MissionPage() {
  return (
    <>
      <AutoScroll />
      <div className="min-h-screen bg-gradient-to-b from-white to-[var(--amazon-green-light)]">
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-[#1A5F3B] text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Target className="w-16 h-16 mx-auto mb-6 text-[#F9C74F]" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Nossa Missão
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                Transformar a experiência do transporte fluvial na Amazônia através da tecnologia e inovação
              </p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1A5F3B] mb-6">
                  Por que existimos
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  A Via Fluvial Amazônia nasceu da necessidade de modernizar e facilitar o acesso ao transporte fluvial na maior região hidrográfica do mundo. Acreditamos que tecnologia e tradição podem caminhar juntas para melhorar a vida de milhões de pessoas que dependem dos rios amazônicos.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Nossa missão é democratizar o acesso às informações sobre transporte fluvial, tornando cada viagem mais segura, previsível e acessível para todos os amazônidas e visitantes da região.
                </p>
              </div>

              {/* Values Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="bg-[var(--amazon-green-light)] w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="w-7 h-7 text-[#1A5F3B]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A5F3B] mb-4">
                    Valorização da Cultura Local
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Respeitamos e valorizamos as tradições ribeirinhas, trabalhando para preservar a identidade cultural amazônica enquanto trazemos inovação tecnológica.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="bg-[var(--amazon-green-light)] w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-7 h-7 text-[#1A5F3B]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A5F3B] mb-4">
                    Inclusão e Acessibilidade
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Desenvolvemos soluções pensadas para todos, desde o ribeirinho que faz sua primeira viagem digital até o turista que explora a Amazônia.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="bg-[var(--amazon-green-light)] w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Compass className="w-7 h-7 text-[#1A5F3B]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A5F3B] mb-4">
                    Inovação com Propósito
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Cada funcionalidade é pensada para resolver problemas reais das pessoas que navegam pelos rios amazônicos, trazendo soluções práticas e eficientes.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="bg-[var(--amazon-green-light)] w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-7 h-7 text-[#1A5F3B]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A5F3B] mb-4">
                    Compromisso com a Região
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Nosso foco está em fortalecer a economia local, apoiar os operadores de transporte fluvial e contribuir para o desenvolvimento sustentável da Amazônia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="py-20 bg-[#1A5F3B] text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Nossa Visão</h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Ser a principal plataforma de transporte fluvial da Amazônia, reconhecida pela excelência no atendimento, inovação tecnológica e compromisso com as comunidades ribeirinhas.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}