import { FileText, AlertTriangle, CheckCircle, Ban, Scale, Info } from 'lucide-react';
import { AutoScroll } from '../components/AutoScroll';

export function TermsPage() {
  return (
    <>
      <AutoScroll />
      <div className="min-h-screen bg-gradient-to-b from-white to-[var(--amazon-green-light)]">
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-[#1A5F3B] text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <FileText className="w-16 h-16 mx-auto mb-6 text-[#F9C74F]" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Termos de Uso
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                Última atualização: Março de 2026
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Introduction */}
              <div className="mb-12">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Bem-vindo à Via Fluvial Amazônia. Ao acessar e usar nossa plataforma, você concorda com os seguintes Termos de Uso. Leia atentamente antes de utilizar nossos serviços.
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-12">
                {/* Section 1 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[var(--amazon-green-light)] p-2 rounded-lg">
                      <Scale className="w-6 h-6 text-[#1A5F3B]" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                      1. Aceitação dos Termos
                    </h2>
                  </div>
                  <div className="pl-0 md:pl-14">
                    <p className="text-gray-700 leading-relaxed">
                      Ao acessar ou usar a plataforma Via Fluvial Amazônia, você concorda em estar vinculado a estes Termos de Uso e todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.
                    </p>
                  </div>
                </div>

                {/* Section 2 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[var(--amazon-green-light)] p-2 rounded-lg">
                      <FileText className="w-6 h-6 text-[#1A5F3B]" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                      2. Descrição dos Serviços
                    </h2>
                  </div>
                  <div className="pl-0 md:pl-14 space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      A Via Fluvial Amazônia é uma plataforma digital que conecta passageiros a operadores de transporte fluvial na região amazônica. Nossos serviços incluem:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Busca e comparação de rotas fluviais</li>
                      <li>Informações sobre embarcações e horários</li>
                      <li>Reserva e compra de passagens</li>
                      <li>Avaliações e comentários de usuários</li>
                      <li>Suporte ao cliente</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>Importante:</strong> A Via Fluvial Amazônia atua como intermediária entre passageiros e operadores de embarcações. Não somos proprietários ou operadores das embarcações.
                    </p>
                  </div>
                </div>

                {/* Section 3 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[var(--amazon-green-light)] p-2 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-[#1A5F3B]" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                      3. Cadastro e Conta de Usuário
                    </h2>
                  </div>
                  <div className="pl-0 md:pl-14 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        3.1 Elegibilidade
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Você deve ter pelo menos 18 anos de idade para criar uma conta e usar nossos serviços. Ao criar uma conta, você declara que tem capacidade legal para celebrar contratos.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        3.2 Responsabilidade pela Conta
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorram em sua conta. Notifique-nos imediatamente sobre qualquer uso não autorizado.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        3.3 Informações Precisas
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Você concorda em fornecer informações verdadeiras, precisas e completas durante o registro e mantê-las atualizadas.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 4 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[var(--amazon-green-light)] p-2 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-[#1A5F3B]" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                      4. Reservas e Pagamentos
                    </h2>
                  </div>
                  <div className="pl-0 md:pl-14 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        4.1 Processo de Reserva
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Ao fazer uma reserva, você está fazendo uma oferta para comprar uma passagem. A reserva só é confirmada após o pagamento ser processado e você receber uma confirmação por e-mail.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        4.2 Preços e Disponibilidade
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Os preços exibidos estão sujeitos a alterações e são definidos pelos operadores das embarcações. Fazemos o possível para garantir a precisão, mas não podemos garantir a disponibilidade até que a reserva seja confirmada.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        4.3 Cancelamentos e Reembolsos
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        As políticas de cancelamento e reembolso são definidas por cada operador de embarcação e serão claramente informadas antes da confirmação da reserva. Taxas podem ser aplicadas.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 5 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[var(--amazon-green-light)] p-2 rounded-lg">
                      <Ban className="w-6 h-6 text-[#1A5F3B]" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                      5. Uso Proibido
                    </h2>
                  </div>
                  <div className="pl-0 md:pl-14">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Você concorda em NÃO:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Usar a plataforma para qualquer propósito ilegal ou não autorizado</li>
                      <li>Violar qualquer lei local, estadual ou federal</li>
                      <li>Infringir direitos de propriedade intelectual</li>
                      <li>Transmitir vírus, malware ou código malicioso</li>
                      <li>Fazer scraping ou coletar dados automaticamente</li>
                      <li>Personificar outra pessoa ou entidade</li>
                      <li>Interferir no funcionamento da plataforma</li>
                      <li>Publicar conteúdo ofensivo, difamatório ou inadequado</li>
                    </ul>
                  </div>
                </div>

                {/* Section 6 */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B] mb-4">
                    6. Propriedade Intelectual
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, ícones, imagens e software, é propriedade da Via Fluvial Amazônia ou de seus licenciadores e está protegido por leis de direitos autorais e propriedade intelectual.
                  </p>
                </div>

                {/* Section 7 */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B] mb-4">
                    7. Limitação de Responsabilidade
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      A Via Fluvial Amazônia atua apenas como intermediária entre passageiros e operadores de embarcações. Não somos responsáveis por:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Atrasos, cancelamentos ou mudanças de itinerário</li>
                      <li>Qualidade dos serviços prestados pelos operadores</li>
                      <li>Danos, perdas ou lesões durante a viagem</li>
                      <li>Disputas entre passageiros e operadores</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed">
                      Recomendamos sempre verificar as credenciais e reputação dos operadores antes de fazer uma reserva.
                    </p>
                  </div>
                </div>

                {/* Section 8 */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B] mb-4">
                    8. Avaliações e Comentários
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Os usuários podem publicar avaliações e comentários sobre suas experiências. Ao fazê-lo, você concorda que seu conteúdo pode ser publicado na plataforma e concede à Via Fluvial Amazônia uma licença não exclusiva para usar esse conteúdo. Reservamo-nos o direito de remover conteúdo inadequado.
                  </p>
                </div>

                {/* Section 9 */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B] mb-4">
                    9. Modificações dos Termos
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Reservamo-nos o direito de modificar estes termos a qualquer momento. Mudanças significativas serão notificadas por e-mail ou através de um aviso na plataforma. O uso continuado após as alterações constitui aceitação dos novos termos.
                  </p>
                </div>

                {/* Section 10 */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B] mb-4">
                    10. Rescisão
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Podemos suspender ou encerrar sua conta e acesso à plataforma a qualquer momento, sem aviso prévio, por violação destes termos ou por qualquer outro motivo que consideremos apropriado.
                  </p>
                </div>

                {/* Section 11 */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B] mb-4">
                    11. Lei Aplicável
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos tribunais competentes do Brasil.
                  </p>
                </div>

                {/* Section 12 */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B] mb-4">
                    12. Contato
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Para dúvidas sobre estes Termos de Uso, entre em contato:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700">
                      <strong>E-mail:</strong> contato@viafluvial.com.br
                    </p>
                    <p className="text-gray-700 mt-2">
                      <strong>Via Fluvial Amazônia</strong>
                    </p>
                    <p className="text-gray-700">
                      Região Norte, Brasil
                    </p>
                  </div>
                </div>
              </div>

              {/* Acceptance Notice */}
              <div className="mt-12 bg-[var(--amazon-green-light)] border-l-4 border-[#1A5F3B] p-6 rounded-r-lg">
                <p className="text-gray-700">
                  <strong>Ao usar a Via Fluvial Amazônia, você reconhece que leu, entendeu e concordou com estes Termos de Uso.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}