import { Shield, Lock, Eye, UserCheck, Database, AlertCircle } from 'lucide-react';
import { AutoScroll } from '../components/AutoScroll';

export function PrivacyPage() {
  return (
    <>
      <AutoScroll />
      <div className="min-h-screen bg-gradient-to-b from-white to-[var(--amazon-green-light)]">
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-[#1A5F3B] text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Shield className="w-16 h-16 mx-auto mb-6 text-[#F9C74F]" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Política de Privacidade
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
                  A Via Fluvial Amazônia está comprometida em proteger a privacidade e segurança dos dados pessoais de nossos usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais.
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-12">
                {/* Section 1 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[var(--amazon-green-light)] p-2 rounded-lg">
                      <Database className="w-6 h-6 text-[#1A5F3B]" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                      1. Informações que Coletamos
                    </h2>
                  </div>
                  <div className="pl-0 md:pl-14 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        1.1 Informações Pessoais
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Coletamos informações que você fornece diretamente, como nome, e-mail, telefone, CPF e informações de pagamento ao criar uma conta ou fazer uma reserva.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        1.2 Informações de Uso
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Coletamos automaticamente informações sobre como você usa nossa plataforma, incluindo páginas visitadas, buscas realizadas e interações com o site.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        1.3 Informações de Dispositivo
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        Coletamos informações sobre o dispositivo usado para acessar nossa plataforma, incluindo modelo, sistema operacional, navegador e endereço IP.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[var(--amazon-green-light)] p-2 rounded-lg">
                      <Eye className="w-6 h-6 text-[#1A5F3B]" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                      2. Como Usamos suas Informações
                    </h2>
                  </div>
                  <div className="pl-0 md:pl-14 space-y-3">
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Processar e gerenciar suas reservas e pagamentos</li>
                      <li>Enviar confirmações e atualizações sobre suas viagens</li>
                      <li>Melhorar e personalizar sua experiência na plataforma</li>
                      <li>Enviar comunicações de marketing (com seu consentimento)</li>
                      <li>Prevenir fraudes e garantir a segurança da plataforma</li>
                      <li>Cumprir obrigações legais e regulatórias</li>
                      <li>Realizar análises e pesquisas para melhorar nossos serviços</li>
                    </ul>
                  </div>
                </div>

                {/* Section 3 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[var(--amazon-green-light)] p-2 rounded-lg">
                      <UserCheck className="w-6 h-6 text-[#1A5F3B]" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                      3. Compartilhamento de Informações
                    </h2>
                  </div>
                  <div className="pl-0 md:pl-14">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Podemos compartilhar suas informações apenas nas seguintes situações:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Com operadores de embarcações para processar suas reservas</li>
                      <li>Com processadores de pagamento para transações financeiras</li>
                      <li>Com prestadores de serviços que nos auxiliam nas operações</li>
                      <li>Quando exigido por lei ou ordem judicial</li>
                      <li>Com seu consentimento explícito</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed mt-4">
                      <strong>Importante:</strong> Nunca vendemos suas informações pessoais para terceiros.
                    </p>
                  </div>
                </div>

                {/* Section 4 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[var(--amazon-green-light)] p-2 rounded-lg">
                      <Lock className="w-6 h-6 text-[#1A5F3B]" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                      4. Segurança dos Dados
                    </h2>
                  </div>
                  <div className="pl-0 md:pl-14">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Implementamos medidas técnicas e organizacionais apropriadas para proteger suas informações pessoais:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Criptografia SSL/TLS para todas as transmissões de dados</li>
                      <li>Armazenamento seguro em servidores protegidos</li>
                      <li>Controles de acesso rigorosos para funcionários</li>
                      <li>Monitoramento contínuo de segurança</li>
                      <li>Auditorias regulares de segurança</li>
                    </ul>
                  </div>
                </div>

                {/* Section 5 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[var(--amazon-green-light)] p-2 rounded-lg">
                      <Shield className="w-6 h-6 text-[#1A5F3B]" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                      5. Seus Direitos
                    </h2>
                  </div>
                  <div className="pl-0 md:pl-14">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem os seguintes direitos:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>Acessar seus dados pessoais</li>
                      <li>Corrigir dados incompletos ou desatualizados</li>
                      <li>Solicitar a exclusão de seus dados</li>
                      <li>Revogar consentimento a qualquer momento</li>
                      <li>Solicitar portabilidade de dados</li>
                      <li>Opor-se ao tratamento de dados</li>
                      <li>Obter informações sobre compartilhamento de dados</li>
                    </ul>
                  </div>
                </div>

                {/* Section 6 */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[var(--amazon-green-light)] p-2 rounded-lg">
                      <AlertCircle className="w-6 h-6 text-[#1A5F3B]" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B]">
                      6. Cookies e Tecnologias Similares
                    </h2>
                  </div>
                  <div className="pl-0 md:pl-14">
                    <p className="text-gray-700 leading-relaxed">
                      Usamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso da plataforma e personalizar conteúdo. Você pode gerenciar suas preferências de cookies nas configurações do navegador.
                    </p>
                  </div>
                </div>

                {/* Section 7 */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B] mb-4">
                    7. Retenção de Dados
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Manteremos suas informações pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política, a menos que um período de retenção mais longo seja exigido por lei.
                  </p>
                </div>

                {/* Section 8 */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B] mb-4">
                    8. Alterações nesta Política
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas por e-mail ou através de um aviso em nossa plataforma.
                  </p>
                </div>

                {/* Section 9 */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#1A5F3B] mb-4">
                    9. Contato
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700">
                      <strong>E-mail:</strong> privacidade@viafluvial.com.br
                    </p>
                    <p className="text-gray-700 mt-2">
                      <strong>Responsável pela Proteção de Dados (DPO):</strong> Em breve
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}