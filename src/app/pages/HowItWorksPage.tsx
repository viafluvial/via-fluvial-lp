import { Search, Calendar, Ship, CheckCircle, MapPin, Clock } from 'lucide-react';
import { AutoScroll } from '../components/AutoScroll';

export function HowItWorksPage() {
  return (
    <>
      <AutoScroll />
      <div className="min-h-screen bg-gradient-to-b from-white to-[var(--amazon-green-light)]">
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-[#1A5F3B] to-[#0f3d24] text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
                <Ship className="w-5 h-5" />
                <span className="font-medium">Simples e Intuitivo</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Como Funciona
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                Reservar sua viagem fluvial nunca foi tão fácil. Veja o passo a passo completo.
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="space-y-12">
                <div className="flex gap-6 md:gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <Search className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl p-6 md:p-8 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl font-bold text-gray-300">
                          01
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                          Busque sua rota
                        </h3>
                      </div>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        Informe seu ponto de partida e destino. Nossa plataforma mostrará todas as opções de viagem disponíveis.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 md:gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <Calendar className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl p-6 md:p-8 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl font-bold text-gray-300">
                          02
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                          Escolha data e horário
                        </h3>
                      </div>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        Selecione a data da sua viagem e veja os horários disponíveis com informações em tempo real.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 md:gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-[#1A5F3B] w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <Ship className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl p-6 md:p-8 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl font-bold text-gray-300">
                          03
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                          Compare embarcações
                        </h3>
                      </div>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        Veja detalhes sobre cada embarcação, incluindo comodidades, avaliações e preços.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 md:gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-[#F9C74F] w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl p-6 md:p-8 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl font-bold text-gray-300">
                          04
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                          Reserve ou compre
                        </h3>
                      </div>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        Faça sua reserva ou compre sua passagem de forma segura e prática.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 md:gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-green-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl p-6 md:p-8 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl font-bold text-gray-300">
                          05
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                          Receba confirmação
                        </h3>
                      </div>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        Receba sua confirmação por e-mail e SMS com todas as informações da viagem.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 md:gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <Ship className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-xl p-6 md:p-8 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl font-bold text-gray-300">
                          06
                        </span>
                        <h3 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                          Embarque tranquilo
                        </h3>
                      </div>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        Apresente seu comprovante digital no porto e tenha uma ótima viagem!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-white to-[var(--amazon-green-light)]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A5F3B] text-center mb-12">
                Funcionalidades Principais
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-[#1A5F3B] mb-4">
                    Informações em Tempo Real
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Acompanhe horários, disponibilidade e atualizações sobre sua viagem em tempo real através da plataforma.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-[#1A5F3B] mb-4">
                    Avaliações e Comentários
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Veja avaliações de outros passageiros e compartilhe sua experiência para ajudar a comunidade.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-[#1A5F3B] mb-4">
                    Suporte ao Cliente
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Conte com nossa equipe de suporte para tirar dúvidas e resolver qualquer problema durante sua jornada.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-[#1A5F3B] mb-4">
                    Pagamento Seguro
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Realize pagamentos de forma segura com proteção de dados e múltiplas opções de pagamento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#1A5F3B] text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pronto para começar?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Em breve você poderá fazer sua primeira reserva pela Via Fluvial Amazônia
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}