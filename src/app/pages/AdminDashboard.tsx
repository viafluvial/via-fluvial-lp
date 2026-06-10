import { useState, useEffect, useMemo } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { LocationMapModal } from '../components/LocationMapModal';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Mail,
  Download,
  RefreshCw,
  Lightbulb,
  BarChart3,
  Ship,
  User,
  Building2,
  Info,
  PieChart,
  Send,
  Filter,
  Search,
  Eye,
  Phone,
  Globe,
  Bell,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Map,
  Trash2  // ✅ ADICIONAR
} from 'lucide-react';
import { 
  listNewsletterSubscribers, 
  listPollResponses, 
  getPollStats,
  getNewsletterCount,
  deleteLead  // ✅ ADICIONAR
} from '../utils/api';
import { toast } from 'sonner';  // ✅ ADICIONAR
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

export default function AdminDashboard() {
  const [newsletterData, setNewsletterData] = useState<any>(null);
  const [pollData, setPollData] = useState<any>(null);
  const [pollStats, setPollStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUserType, setFilterUserType] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Comunicação
  const [showCommunication, setShowCommunication] = useState(false);
  const [communicationType, setCommunicationType] = useState<'email' | 'whatsapp'>('email');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [selectedUserDetail, setSelectedUserDetail] = useState<any>(null);
  
  // Mapa de localização
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [selectedUserLocation, setSelectedUserLocation] = useState<any>(null);

  // ✅ ADICIONAR: Estado para modal de exclusão
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [newsletter, polls, stats] = await Promise.all([
        listNewsletterSubscribers(),
        listPollResponses(),
        getPollStats(),
      ]);
      
      setNewsletterData(newsletter);
      setPollData(polls);
      setPollStats(stats);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const pollOptionLabels: Record<string, string> = {
    'comprar': 'Comprar passagem online',
    'horarios': 'Ver horários e rotas com facilidade',
    'acompanhar': 'Acompanhar informações da viagem',
    'pagar': 'Pagar com mais praticidade',
    'confiaveis': 'Encontrar embarcações confiáveis',
  };

  // Calcular distribuição de tipos de usuário
  const getUserTypeStats = () => {
    if (!newsletterData?.subscribers) return null;

    const stats: Record<string, number> = {
      passageiro: 0,
      barqueiro: 0,
      agencia: 0,
      outros: 0,
    };

    newsletterData.subscribers.forEach((sub: any) => {
      const source = sub.source || '';
      if (source.includes('passageiro')) stats.passageiro++;
      else if (source.includes('barqueiro')) stats.barqueiro++;
      else if (source.includes('agencia')) stats.agencia++;
      else if (source.includes('outros')) stats.outros++;
    });

    return stats;
  };

  const userTypeStats = getUserTypeStats();

  const userTypeLabels: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
    passageiro: { label: 'Passageiros', icon: User, color: 'bg-blue-500', bgColor: 'bg-blue-50' },
    barqueiro: { label: 'Barqueiros', icon: Ship, color: 'bg-green-500', bgColor: 'bg-green-50' },
    agencia: { label: 'Agências', icon: Building2, color: 'bg-purple-500', bgColor: 'bg-purple-50' },
    outros: { label: 'Outros', icon: Info, color: 'bg-orange-500', bgColor: 'bg-orange-50' },
  };

  // Filtrar usuários
  const getFilteredUsers = () => {
    if (!newsletterData?.subscribers) return [];

    let filtered = newsletterData.subscribers;

    // Filtro por tipo de usuário
    if (filterUserType.length > 0) {
      filtered = filtered.filter((sub: any) => {
        const source = sub.source || '';
        return filterUserType.some(type => source.includes(type));
      });
    }

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter((sub: any) => 
        sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.whatsapp && sub.whatsapp.includes(searchQuery))
      );
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  // Analytics avançados com useMemo para evitar recálculos e keys duplicadas
  const timelineData = useMemo(() => {
    if (!newsletterData?.subscribers || newsletterData.subscribers.length === 0) return [];

    const grouped: Record<string, number> = {};
    
    newsletterData.subscribers.forEach((sub: any) => {
      const date = new Date(sub.subscribedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.entries(grouped).map(([date, count], index) => ({ 
      key: `timeline-${date.replace(/\s/g, '-')}-${index}`,
      date, 
      count 
    }));
  }, [newsletterData?.subscribers]);

  const languageStats = useMemo(() => {
    if (!newsletterData?.subscribers || newsletterData.subscribers.length === 0) return [];

    const stats: Record<string, number> = {};
    
    newsletterData.subscribers.forEach((sub: any) => {
      const lang = sub.language || 'pt';
      stats[lang] = (stats[lang] || 0) + 1;
    });

    const languageNames: Record<string, string> = {
      pt: 'Português',
      en: 'English',
      es: 'Español'
    };

    return Object.entries(stats).map(([lang, count], index) => ({ 
      key: `lang-stat-${lang}`,
      name: languageNames[lang] || lang, 
      value: count 
    }));
  }, [newsletterData?.subscribers]);

  const quizResultStats = useMemo(() => {
    if (!newsletterData?.subscribers || newsletterData.subscribers.length === 0) return [];

    const stats: Record<string, number> = {};
    
    newsletterData.subscribers.forEach((sub: any) => {
      if (sub.quizResult) {
        stats[sub.quizResult] = (stats[sub.quizResult] || 0) + 1;
      }
    });

    const quizLabels: Record<string, string> = {
      commuter: '🚤 Viajante Frequente',
      family: '❤️ Viajante Familiar',
      explorer: '🌴 Explorador Amazônico',
      occasional: '🎒 Viajante Ocasional'
    };

    return Object.entries(stats).map(([type, count], index) => ({ 
      key: `quiz-result-${type}`,
      name: quizLabels[type] || type, 
      value: count 
    }));
  }, [newsletterData?.subscribers]);

  const getNotify24hCount = () => {
    if (!newsletterData?.subscribers) return 0;
    return newsletterData.subscribers.filter((sub: any) => sub.notify24h).length;
  };

  const getWhatsAppCount = () => {
    if (!newsletterData?.subscribers) return 0;
    return newsletterData.subscribers.filter((sub: any) => sub.whatsapp).length;
  };

  const COLORS = ['#1A5F3B', '#F9C74F', '#3B82F6', '#8B5CF6', '#EF4444'];

  // Handler de comunicação
  const handleSendMessage = () => {
    const recipients = selectedUsers.length > 0 
      ? selectedUsers 
      : filteredUsers.map((u: any) => u.email);

    if (recipients.length === 0) {
      toast.error('Selecione destinatários', {
        description: 'Você precisa selecionar pelo menos um destinatário.',
      });
      return;
    }

    if (!messageBody) {
      toast.error('Digite uma mensagem', {
        description: 'O campo de mensagem não pode estar vazio.',
      });
      return;
    }

    // Aqui você implementaria o envio real via API
    console.log('📨 Enviando mensagem:', {
      type: communicationType,
      recipients: recipients.length,
      subject: messageSubject,
      body: messageBody
    });

    toast.success(`Mensagem enviada para ${recipients.length} pessoa(s)!`, {
      description: `Tipo: ${communicationType === 'email' ? 'Email' : 'WhatsApp'} • Esta funcionalidade está em modo demonstração.`,
      duration: 5000,
    });

    setShowCommunication(false);
    setMessageSubject('');
    setMessageBody('');
    setSelectedUsers([]);
  };

  const loadEmailTemplate = (template: string) => {
    const templates: Record<string, { subject: string; body: string }> = {
      welcome: {
        subject: 'Bem-vindo à Via Fluvial Amazônia! 🚤',
        body: 'Olá!\n\nObrigado por se cadastrar na nossa lista de espera.\n\nEm breve você receberá novidades sobre o lançamento da plataforma.\n\nEquipe Via Fluvial'
      },
      update: {
        subject: 'Novidades da Via Fluvial',
        body: 'Olá!\n\nTemos novidades importantes para compartilhar com você sobre o desenvolvimento da plataforma.\n\n[Sua mensagem aqui]\n\nEquipe Via Fluvial'
      },
      launch: {
        subject: '🎉 Via Fluvial está no ar!',
        body: 'Olá!\n\nÉ com grande alegria que anunciamos: a Via Fluvial está oficialmente lançada!\n\nAcesse agora: [link]\n\nEquipe Via Fluvial'
      }
    };

    const selected = templates[template];
    if (selected) {
      setMessageSubject(selected.subject);
      setMessageBody(selected.body);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-[var(--amazon-green)] mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--amazon-green-dark)]">
                Dashboard Administrativo
              </h1>
              <p className="text-gray-600 mt-1">Via Fluvial Amazônia - Pré-lançamento</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowCommunication(true)}
                className="bg-[var(--amazon-gold)] hover:bg-[var(--amazon-gold)]/90 text-[var(--amazon-green-dark)] flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Comunicar
              </Button>
              <Button
                onClick={fetchData}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* KPIs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inscritos Newsletter</p>
                <p className="text-3xl font-bold text-[var(--amazon-green-dark)] mt-2">
                  {newsletterData?.total || 0}
                </p>
              </div>
              <div className="bg-[var(--amazon-green-light)] p-3 rounded-full">
                <Users className="w-6 h-6 text-[var(--amazon-green-dark)]" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>Crescendo constantemente</span>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Respostas Enquete</p>
                <p className="text-3xl font-bold text-[var(--amazon-green-dark)] mt-2">
                  {pollStats?.totalResponses || 0}
                </p>
              </div>
              <div className="bg-[var(--amazon-gold)]/20 p-3 rounded-full">
                <MessageSquare className="w-6 h-6 text-[var(--amazon-gold)]" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-gray-600">
              <BarChart3 className="w-4 h-4" />
              <span>Feedback valioso</span>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">WhatsApp Ativos</p>
                <p className="text-3xl font-bold text-[var(--amazon-green-dark)] mt-2">
                  {getWhatsAppCount()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-gray-600">
              <span>{newsletterData?.total > 0 ? Math.round((getWhatsAppCount() / newsletterData.total) * 100) : 0}% dos inscritos</span>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Notificações 24h</p>
                <p className="text-3xl font-bold text-[var(--amazon-green-dark)] mt-2">
                  {getNotify24hCount()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Aguardando lançamento</span>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">📊 Visão Geral</TabsTrigger>
            <TabsTrigger value="users">👥 Usuários</TabsTrigger>
            <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
            <TabsTrigger value="poll">💬 Enquete</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Segmentação de Público */}
            {userTypeStats && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Segmentação de Público
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(userTypeStats).map(([key, count]) => {
                    const typeInfo = userTypeLabels[key];
                    const Icon = typeInfo.icon;
                    const percentage = newsletterData?.total > 0 
                      ? ((count / newsletterData.total) * 100).toFixed(1)
                      : 0;
                    
                    return (
                      <div key={key} className={`flex flex-col items-center p-4 ${typeInfo.bgColor} rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors`}>
                        <div className={`${typeInfo.color} p-3 rounded-full mb-3`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                        <p className="text-sm font-medium text-gray-700 mt-1">{typeInfo.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{percentage}%</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Funcionalidades Mais Desejadas */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Funcionalidades Mais Desejadas
              </h3>
              <div className="space-y-4">
                {pollStats?.optionCounts && Object.entries(pollStats.optionCounts)
                  .sort(([, a]: any, [, b]: any) => b - a)
                  .map(([key, count]: any) => {
                    const percentage = pollStats.totalResponses > 0 
                      ? (count / pollStats.totalResponses) * 100 
                      : 0;
                    return (
                      <div key={key}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-gray-700">
                            {pollOptionLabels[key] || key}
                          </span>
                          <span className="text-gray-600">
                            {count} votos ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-[var(--amazon-green)] h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Card>

            {/* Sugestões Recentes */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[var(--amazon-gold)]" />
                Sugestões Recentes
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {pollStats?.recentSuggestions && pollStats.recentSuggestions.length > 0 ? (
                  pollStats.recentSuggestions.map((item: any, index: number) => (
                    <div key={index} className="border-l-4 border-[var(--amazon-gold)] pl-4 py-2 bg-yellow-50 rounded-r">
                      <p className="text-gray-700 mb-2">{item.suggestion}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(item.submittedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">Nenhuma sugestão ainda</p>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Filtros e Busca */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Buscar por email ou WhatsApp..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => exportToCSV(filteredUsers, 'newsletter_filtered')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar ({filteredUsers.length})
                </Button>
              </div>

              {/* Filtro por Tipo */}
              <div className="mb-4">
                <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtrar por tipo de usuário:
                </Label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {Object.entries(userTypeLabels).map(([key, info]) => {
                    const Icon = info.icon;
                    const isSelected = filterUserType.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setFilterUserType(prev =>
                            prev.includes(key)
                              ? prev.filter(t => t !== key)
                              : [...prev, key]
                          );
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                          isSelected
                            ? `${info.color} text-white border-transparent`
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{info.label}</span>
                      </button>
                    );
                  })}
                  {filterUserType.length > 0 && (
                    <button
                      onClick={() => setFilterUserType([])}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Limpar Filtros</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Estatísticas dos Filtros */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Mostrando <strong>{filteredUsers.length}</strong> de <strong>{newsletterData?.total || 0}</strong> inscritos
                  {selectedUsers.length > 0 && (
                    <span className="ml-2 text-[var(--amazon-green-dark)]">
                      • <strong>{selectedUsers.length}</strong> selecionado(s)
                    </span>
                  )}
                </p>
              </div>
            </Card>

            {/* Lista de Usuários */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Lista de Inscritos
                </h3>
                {selectedUsers.length > 0 && (
                  <Button
                    onClick={() => setSelectedUsers([])}
                    variant="outline"
                    size="sm"
                  >
                    Desmarcar Todos
                  </Button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <Checkbox
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedUsers(filteredUsers.map((u: any) => u.email));
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Perfil</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">WhatsApp</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Idioma</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers && filteredUsers.length > 0 ? (
                      filteredUsers.map((subscriber: any, index: number) => {
                        const source = subscriber.source || '';
                        let userType = 'outros';
                        if (source.includes('passageiro')) userType = 'passageiro';
                        else if (source.includes('barqueiro')) userType = 'barqueiro';
                        else if (source.includes('agencia')) userType = 'agencia';
                        
                        const typeInfo = userTypeLabels[userType];
                        const Icon = typeInfo.icon;
                        const isSelected = selectedUsers.includes(subscriber.email);
                        
                        return (
                          <tr key={index} className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                            <td className="px-4 py-3">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedUsers(prev => [...prev, subscriber.email]);
                                  } else {
                                    setSelectedUsers(prev => prev.filter(e => e !== subscriber.email));
                                  }
                                }}
                              />
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {subscriber.email}
                              {subscriber.notify24h && (
                                <Bell className="inline w-3 h-3 ml-2 text-blue-500" title="Notificação 24h ativa" />
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 ${typeInfo.color} text-white rounded-full text-xs`}>
                                <Icon className="w-3 h-3" />
                                {typeInfo.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {subscriber.whatsapp ? (
                                <span className="flex items-center gap-1 text-green-600">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {subscriber.whatsapp}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {subscriber.language?.toUpperCase() || 'PT'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {new Date(subscriber.subscribedAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                <Button
                                  onClick={() => setSelectedUserDetail(subscriber)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-[var(--amazon-green-dark)]"
                                  title="Ver detalhes"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {subscriber.geolocation?.latitude && subscriber.geolocation?.longitude && (
                                  <Button
                                    onClick={() => {
                                      setSelectedUserLocation(subscriber);
                                      setShowLocationMap(true);
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-600"
                                    title="Ver localização no mapa"
                                  >
                                    <Map className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  onClick={() => {
                                    setUserToDelete(subscriber);
                                    setShowDeleteConfirm(true);
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600"
                                  title="Excluir lead"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                          Nenhum inscrito encontrado com os filtros aplicados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Timeline de Inscrições */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timeline de Inscrições
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#1A5F3B" strokeWidth={2} name="Inscrições" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Distribuição por Idioma */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Idiomas Preferidos
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie
                      data={languageStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {languageStats.map((entry, index) => (
                        <Cell key={entry.key} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </Card>

              {/* Perfis de Viajantes (Quiz) */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Perfis de Viajantes
                </h3>
                {quizResultStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={quizResultStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" hide />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#F9C74F" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-gray-500">
                    Nenhum quiz respondido ainda
                  </div>
                )}
              </Card>
            </div>

            {/* Distribuição Geográfica */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Distribuição Geográfica
              </h3>
              <div className="space-y-2">
                {newsletterData?.subscribers && (() => {
                  const locations: Record<string, number> = {};
                  
                  newsletterData.subscribers.forEach((sub: any) => {
                    if (sub.geolocation?.city && sub.geolocation?.state) {
                      const location = `${sub.geolocation.city}, ${sub.geolocation.state}`;
                      locations[location] = (locations[location] || 0) + 1;
                    }
                  });

                  const sortedLocations = Object.entries(locations)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10);

                  return sortedLocations.length > 0 ? (
                    sortedLocations.map(([location, count]) => (
                      <div key={location} className="flex items-center justify-between py-2 border-b">
                        <span className="flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-[var(--amazon-green)]" />
                          {location}
                        </span>
                        <span className="font-semibold text-gray-900">{count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">Dados de geolocalização não disponíveis</p>
                  );
                })()}
              </div>
            </Card>
          </TabsContent>

          {/* Poll Tab */}
          <TabsContent value="poll">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Respostas da Enquete ({pollData?.total || 0})
                </h3>
                <Button
                  onClick={() => {
                    const formatted = pollData?.responses?.map((r: any) => ({
                      ...r,
                      selectedOptions: r.selectedOptions.join('; ')
                    }));
                    exportToCSV(formatted || [], 'poll_responses');
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </Button>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {pollData?.responses && pollData.responses.length > 0 ? (
                  pollData.responses.map((response: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-semibold text-gray-700">
                          Resposta #{pollData.total - index}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(response.submittedAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-600 mb-2">Opções selecionadas:</p>
                        <div className="flex flex-wrap gap-2">
                          {response.selectedOptions.map((option: string) => (
                            <span
                              key={option}
                              className="px-3 py-1 bg-[var(--amazon-green-light)] text-[var(--amazon-green-dark)] rounded-full text-sm"
                            >
                              {pollOptionLabels[option] || option}
                            </span>
                          ))}
                        </div>
                      </div>

                      {response.suggestions && (
                        <div className="bg-yellow-50 border-l-4 border-[var(--amazon-gold)] pl-4 py-2 mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-[var(--amazon-gold)]" />
                            Sugestão:
                          </p>
                          <p className="text-sm text-gray-600">{response.suggestions}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">Nenhuma resposta ainda</p>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Comunicação */}
      {showCommunication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Send className="w-6 h-6" />
                Comunicar com Inscritos
              </h3>
              <Button
                onClick={() => setShowCommunication(false)}
                variant="ghost"
                size="sm"
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            {/* Tipo de Comunicação */}
            <div className="mb-4">
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Tipo de Mensagem:
              </Label>
              <div className="flex gap-3">
                <button
                  onClick={() => setCommunicationType('email')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    communicationType === 'email'
                      ? 'border-[var(--amazon-green)] bg-[var(--amazon-green-light)] text-[var(--amazon-green-dark)]'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Email</span>
                </button>
                <button
                  onClick={() => setCommunicationType('whatsapp')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                    communicationType === 'whatsapp'
                      ? 'border-green-600 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Destinatários */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Destinatários:</strong>{' '}
                {selectedUsers.length > 0 
                  ? `${selectedUsers.length} pessoa(s) selecionada(s)` 
                  : `Todos os ${filteredUsers.length} usuário(s) filtrado(s)`}
              </p>
              {filterUserType.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Filtro ativo: {filterUserType.map(t => userTypeLabels[t].label).join(', ')}
                </p>
              )}
            </div>

            {/* Templates (apenas para email) */}
            {communicationType === 'email' && (
              <div className="mb-4">
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Templates Rápidos:
                </Label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => loadEmailTemplate('welcome')}
                    variant="outline"
                    size="sm"
                  >
                    Boas-vindas
                  </Button>
                  <Button
                    onClick={() => loadEmailTemplate('update')}
                    variant="outline"
                    size="sm"
                  >
                    Atualização
                  </Button>
                  <Button
                    onClick={() => loadEmailTemplate('launch')}
                    variant="outline"
                    size="sm"
                  >
                    Lançamento
                  </Button>
                </div>
              </div>
            )}

            {/* Assunto (apenas para email) */}
            {communicationType === 'email' && (
              <div className="mb-4">
                <Label htmlFor="subject" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Assunto:
                </Label>
                <Input
                  id="subject"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  placeholder="Digite o assunto do email..."
                />
              </div>
            )}

            {/* Mensagem */}
            <div className="mb-6">
              <Label htmlFor="message" className="text-sm font-semibold text-gray-700 mb-2 block">
                Mensagem:
              </Label>
              <Textarea
                id="message"
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder={communicationType === 'email' 
                  ? 'Digite a mensagem do email...' 
                  : 'Digite a mensagem do WhatsApp...'}
                rows={8}
                className="resize-none"
              />
            </div>

            {/* Aviso */}
            <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Modo Demonstração:</strong> Esta funcionalidade está em modo demo. 
                Para envios reais, é necessário configurar uma API de email (SendGrid, Mailgun, etc.) 
                ou WhatsApp Business API.
              </p>
            </div>

            {/* Ações */}
            <div className="flex gap-3">
              <Button
                onClick={handleSendMessage}
                className="flex-1 bg-[var(--amazon-green)] hover:bg-[var(--amazon-green-dark)] text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensagem
              </Button>
              <Button
                onClick={() => setShowCommunication(false)}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de Detalhes do Usuário */}
      {selectedUserDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <User className="w-6 h-6" />
                Detalhes do Inscrito
              </h3>
              <Button
                onClick={() => setSelectedUserDetail(null)}
                variant="ghost"
                size="sm"
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Email</p>
                  <p className="text-gray-900">{selectedUserDetail.email}</p>
                </div>
              </div>

              {/* Tipo de Usuário */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Tipo de Usuário</p>
                  <p className="text-gray-900">
                    {(() => {
                      const source = selectedUserDetail.source || '';
                      let userType = 'outros';
                      if (source.includes('passageiro')) userType = 'passageiro';
                      else if (source.includes('barqueiro')) userType = 'barqueiro';
                      else if (source.includes('agencia')) userType = 'agencia';
                      return userTypeLabels[userType].label;
                    })()}
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              {selectedUserDetail.whatsapp && (
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">WhatsApp</p>
                    <p className="text-gray-900">{selectedUserDetail.whatsapp}</p>
                  </div>
                </div>
              )}

              {/* Idioma */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Globe className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Idioma Preferido</p>
                  <p className="text-gray-900">
                    {selectedUserDetail.language === 'pt' ? 'Português' : 
                     selectedUserDetail.language === 'en' ? 'English' : 
                     selectedUserDetail.language === 'es' ? 'Español' : 
                     selectedUserDetail.language || 'Português'}
                  </p>
                </div>
              </div>

              {/* Notificação 24h */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Notificação 24h antes do lançamento</p>
                  <p className="text-gray-900">
                    {selectedUserDetail.notify24h ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        Ativada
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400">
                        <XCircle className="w-4 h-4" />
                        Não ativada
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Quiz Result */}
              {selectedUserDetail.quizResult && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                  <Users className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Perfil de Viajante (Quiz)</p>
                    <p className="text-gray-900">
                      {selectedUserDetail.quizResult === 'commuter' ? '🚤 Viajante Frequente' :
                       selectedUserDetail.quizResult === 'family' ? '❤️ Viajante Familiar' :
                       selectedUserDetail.quizResult === 'explorer' ? '🌴 Explorador Amazônico' :
                       selectedUserDetail.quizResult === 'occasional' ? '🎒 Viajante Ocasional' :
                       selectedUserDetail.quizResult}
                    </p>
                  </div>
                </div>
              )}

              {/* Geolocalização */}
              {selectedUserDetail.geolocation && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Localização</p>
                    <p className="text-gray-900">
                      {selectedUserDetail.geolocation.city && selectedUserDetail.geolocation.state
                        ? `${selectedUserDetail.geolocation.city}, ${selectedUserDetail.geolocation.state}, ${selectedUserDetail.geolocation.country || 'Brasil'}`
                        : 'Não disponível'}
                    </p>
                  </div>
                </div>
              )}

              {/* Data de Inscrição */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Data de Inscrição</p>
                  <p className="text-gray-900">
                    {new Date(selectedUserDetail.subscribedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={() => setSelectedUserDetail(null)}
                className="w-full"
                variant="outline"
              >
                Fechar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de Mapa de Localização */}
      <LocationMapModal
        open={showLocationMap}
        onOpenChange={setShowLocationMap}
        geolocation={selectedUserLocation?.geolocation || {}}
        userEmail={selectedUserLocation?.email}
      />

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <Trash2 className="w-6 h-6" />
                Confirmar Exclusão
              </h3>
              <Button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
                variant="ghost"
                size="sm"
                disabled={isDeleting}
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            {/* Informações do usuário */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-gray-800 mb-2">Usuário a ser excluído:</p>
              <p className="text-base font-bold text-gray-900 mb-1">{userToDelete.email}</p>
              {userToDelete.whatsapp && (
                <p className="text-sm text-gray-600">WhatsApp: {userToDelete.whatsapp}</p>
              )}
            </div>

            {/* Aviso sobre dados relacionados */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                ⚠️ Atenção
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                Esta ação irá <strong>deletar permanentemente</strong>:
              </p>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Dados cadastrais do lead</li>
                <li>Consentimentos (email, WhatsApp, notificações)</li>
                <li>Respostas de enquetes (se houver)</li>
                <li>Tentativas de quiz (se houver)</li>
                <li>Eventos de funil (conversões, cliques)</li>
              </ul>
              <p className="text-sm font-semibold text-red-600 mt-3">
                ⛔ Esta ação NÃO pode ser desfeita!
              </p>
            </div>

            {/* Ações */}
            <div className="flex gap-3">
              <Button
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    console.log('🗑️ Iniciando exclusão do lead:', userToDelete.email);
                    const result = await deleteLead(userToDelete.email);
                    console.log('✅ Resultado da exclusão:', result);
                    
                    // Recarrega os dados
                    await fetchData();
                    
                    // Fecha o modal
                    setShowDeleteConfirm(false);
                    setUserToDelete(null);
                    
                    // Toast de sucesso
                    toast.success('Inscrito excluído com sucesso!', {
                      description: `O lead ${userToDelete.email} e todos os dados relacionados foram removidos.`,
                      duration: 5000,
                    });
                  } catch (error: any) {
                    console.error('❌ Erro ao excluir inscrito:', error);
                    
                    // Toast de erro
                    toast.error('Erro ao excluir inscrito', {
                      description: error.message || 'Tente novamente em alguns instantes.',
                      duration: 5000,
                    });
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Sim, Excluir Definitivamente
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setUserToDelete(null);
                }}
                variant="outline"
                disabled={isDeleting}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}