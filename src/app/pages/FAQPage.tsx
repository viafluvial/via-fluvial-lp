import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { AutoScroll } from '../components/AutoScroll';

export function FAQPage() {
  return (
    <>
      <AutoScroll />
      <div className="min-h-screen bg-gradient-to-b from-white to-[var(--amazon-green-light)]">
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-[#1A5F3B] text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <HelpCircle className="w-16 h-16 mx-auto mb-6 text-[#F9C74F]" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Perguntas Frequentes
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                Tire suas dúvidas sobre a Via Fluvial Amazônia
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B] mb-6">
                  Sobre a Plataforma
                </h2>
                <div className="space-y-4">
                  <div
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-semibold text-[#1A5F3B] pr-4">
                        O que é a Via Fluvial Amazônia?
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 text-[#1A5F3B] flex-shrink-0 transition-transform ${
                          false ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed">
                        A Via Fluvial Amazônia é uma plataforma digital que conecta passageiros às embarcações que navegam pelos rios da região amazônica. Oferecemos informações sobre rotas, horários, preços e permitimos reservas e compras de passagens de forma prática e segura.
                      </p>
                    </div>
                  </div>
                  <div
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-semibold text-[#1A5F3B] pr-4">
                        Quando a plataforma estará disponível?
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 text-[#1A5F3B] flex-shrink-0 transition-transform ${
                          false ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed">
                        Estamos em fase de pré-lançamento. Cadastre seu e-mail na página inicial para ser notificado assim que a plataforma estiver disponível para uso público.
                      </p>
                    </div>
                  </div>
                  <div
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-semibold text-[#1A5F3B] pr-4">
                        Quais regiões serão atendidas?
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 text-[#1A5F3B] flex-shrink-0 transition-transform ${
                          false ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed">
                        Inicialmente, focaremos nas principais rotas fluviais da Amazônia, incluindo os estados do Pará, Amazonas, Amapá e Roraima. Planejamos expandir gradualmente para outras regiões amazônicas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B] mb-6">
                  Reservas e Pagamentos
                </h2>
                <div className="space-y-4">
                  <div
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-semibold text-[#1A5F3B] pr-4">
                        Como faço para reservar uma passagem?
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 text-[#1A5F3B] flex-shrink-0 transition-transform ${
                          false ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed">
                        Quando a plataforma estiver ativa, você poderá buscar sua rota desejada, selecionar data e horário, escolher a embarcação e finalizar sua reserva ou compra diretamente pelo site ou aplicativo.
                      </p>
                    </div>
                  </div>
                  <div
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-semibold text-[#1A5F3B] pr-4">
                        Quais formas de pagamento serão aceitas?
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 text-[#1A5F3B] flex-shrink-0 transition-transform ${
                          false ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed">
                        Aceitaremos as principais formas de pagamento, incluindo cartões de crédito e débito, PIX, boleto bancário e carteiras digitais. Todos os pagamentos serão processados de forma segura.
                      </p>
                    </div>
                  </div>
                  <div
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-semibold text-[#1A5F3B] pr-4">
                        Posso cancelar ou alterar minha reserva?
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 text-[#1A5F3B] flex-shrink-0 transition-transform ${
                          false ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed">
                        Sim. As políticas de cancelamento e alteração seguirão as regras estabelecidas por cada operador de embarcação. Todas as informações estarão disponíveis antes da confirmação da reserva.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B] mb-6">
                  Embarcações e Rotas
                </h2>
                <div className="space-y-4">
                  <div
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-semibold text-[#1A5F3B] pr-4">
                        Como sei se uma embarcação é confiável?
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 text-[#1A5F3B] flex-shrink-0 transition-transform ${
                          false ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed">
                        Todas as embarcações cadastradas passarão por um processo de verificação. Além disso, você terá acesso a avaliações de outros passageiros e informações sobre segurança e comodidades oferecidas.
                      </p>
                    </div>
                  </div>
                  <div
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-semibold text-[#1A5F3B] pr-4">
                        Posso ver fotos das embarcações?
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 text-[#1A5F3B] flex-shrink-0 transition-transform ${
                          false ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed">
                        Sim! Cada embarcação terá um perfil completo com fotos, descrição das acomodações, lista de comodidades e avaliações de passageiros anteriores.
                      </p>
                    </div>
                  </div>
                  <div
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-semibold text-[#1A5F3B] pr-4">
                        As informações de horários são atualizadas?
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 text-[#1A5F3B] flex-shrink-0 transition-transform ${
                          false ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed">
                        Sim. Trabalhamos para manter as informações sempre atualizadas em tempo real. Você também receberá notificações sobre qualquer alteração em sua viagem.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B] mb-6">
                  Suporte
                </h2>
                <div className="space-y-4">
                  <div
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-semibold text-[#1A5F3B] pr-4">
                        Como posso entrar em contato com o suporte?
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 text-[#1A5F3B] flex-shrink-0 transition-transform ${
                          false ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed">
                        Você pode entrar em contato através do nosso formulário de contato, e-mail (contato@viafluvial.com.br) ou pelas nossas redes sociais. Teremos uma equipe dedicada para ajudar você.
                      </p>
                    </div>
                  </div>
                  <div
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-semibold text-[#1A5F3B] pr-4">
                        E se tiver algum problema durante a viagem?
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 text-[#1A5F3B] flex-shrink-0 transition-transform ${
                          false ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed">
                        Nossa equipe de suporte estará disponível para auxiliar em caso de problemas. Além disso, você terá acesso direto aos contatos da embarcação e do operador.
                      </p>
                    </div>
                  </div>
                  <div
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-semibold text-[#1A5F3B] pr-4">
                        Posso sugerir melhorias para a plataforma?
                      </span>
                      <ChevronDown
                        className={`w-6 h-6 text-[#1A5F3B] flex-shrink-0 transition-transform ${
                          false ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed">
                        Absolutamente! Valorizamos muito o feedback dos usuários. Você poderá enviar sugestões através da plataforma, e-mail ou redes sociais.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-[#1A5F3B] text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Não encontrou sua resposta?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Entre em contato conosco e teremos prazer em ajudar
              </p>
              <a
                href="/contato"
                className="inline-block bg-[#F9C74F] hover:bg-[#F7BE35] text-[#1A5F3B] font-semibold px-8 py-4 rounded-lg transition-colors"
              >
                Fale Conosco
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}