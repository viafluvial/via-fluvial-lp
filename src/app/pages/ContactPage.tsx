import { Mail, MapPin, Phone, Send, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { AutoScroll } from '../components/AutoScroll';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você enviaria para uma API
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <AutoScroll />
      <div className="min-h-screen bg-gradient-to-b from-white to-[var(--amazon-green-light)]">
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-[#1A5F3B] text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Mail className="w-16 h-16 mx-auto mb-6 text-[#F9C74F]" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Entre em Contato
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                Estamos aqui para ajudar. Envie sua mensagem e responderemos em breve.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8 mb-12">
                {/* Contact Info Cards */}
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="bg-[var(--amazon-green-light)] w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-[#1A5F3B]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A5F3B] mb-2">E-mail</h3>
                  <a
                    href="mailto:contato@viafluvial.com.br"
                    className="text-gray-600 hover:text-[#1A5F3B] transition-colors"
                  >
                    contato@viafluvial.com.br
                  </a>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="bg-[var(--amazon-green-light)] w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-7 h-7 text-[#1A5F3B]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A5F3B] mb-2">Telefone</h3>
                  <p className="text-gray-600">Em breve disponível</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <div className="bg-[var(--amazon-green-light)] w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-7 h-7 text-[#1A5F3B]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A5F3B] mb-2">Localização</h3>
                  <p className="text-gray-600">Região Norte, Brasil</p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                  {!submitted ? (
                    <>
                      <h2 className="text-3xl font-bold text-[#1A5F3B] mb-6">
                        Envie sua Mensagem
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nome Completo
                          </label>
                          <Input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full"
                            placeholder="Seu nome"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            E-mail
                          </label>
                          <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="seu@email.com"
                            className="!h-10"
                          />
                        </div>

                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                            Assunto
                          </label>
                          <Input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full"
                            placeholder="Sobre o que você quer falar?"
                          />
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            Mensagem
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A5F3B] focus:border-transparent resize-none"
                            placeholder="Escreva sua mensagem aqui..."
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-[#1A5F3B] hover:bg-[#0f3d24] text-white font-semibold py-6 text-lg"
                        >
                          <Send className="w-5 h-5 mr-2" />
                          Enviar Mensagem
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Send className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#1A5F3B] mb-4">
                        Mensagem Enviada!
                      </h3>
                      <p className="text-gray-600 text-lg">
                        Obrigado por entrar em contato. Responderemos em breve.
                      </p>
                    </div>
                  )}
                </div>

                {/* Social Media & Additional Info */}
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                    <h3 className="text-2xl font-bold text-[#1A5F3B] mb-6">
                      Redes Sociais
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Siga-nos nas redes sociais para ficar por dentro das novidades e atualizações da plataforma.
                    </p>
                    <div className="flex gap-4">
                      <a
                        href="#"
                        className="bg-[var(--amazon-green-light)] hover:bg-[#1A5F3B] p-3 rounded-lg transition-colors group"
                        aria-label="Facebook"
                      >
                        <Facebook className="w-6 h-6 text-[#1A5F3B] group-hover:text-white" />
                      </a>
                      <a
                        href="#"
                        className="bg-[var(--amazon-green-light)] hover:bg-[#1A5F3B] p-3 rounded-lg transition-colors group"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-6 h-6 text-[#1A5F3B] group-hover:text-white" />
                      </a>
                      <a
                        href="#"
                        className="bg-[var(--amazon-green-light)] hover:bg-[#1A5F3B] p-3 rounded-lg transition-colors group"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-6 h-6 text-[#1A5F3B] group-hover:text-white" />
                      </a>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-[#1A5F3B] to-[#0f3d24] rounded-2xl shadow-xl p-8 md:p-10 text-white">
                    <h3 className="text-2xl font-bold mb-4">
                      Horário de Atendimento
                    </h3>
                    <div className="space-y-3 text-white/90">
                      <p>Segunda a Sexta: 8h às 18h</p>
                      <p>Sábado: 9h às 13h</p>
                      <p>Domingo: Fechado</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <p className="text-sm text-white/70">
                        Tempo médio de resposta: 24 horas
                      </p>
                    </div>
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