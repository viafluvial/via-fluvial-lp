import { projectId, publicAnonKey } from '/utils/supabase/info.tsx';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Database,
  Mail,
  MessageSquare,
  AlertCircle,
  Wrench
} from 'lucide-react';
import { 
  checkHealth, 
  subscribeNewsletter, 
  getNewsletterCount,
  submitPoll,
  getPollStats 
} from '../utils/api';

export function DatabaseTestPanel() {
  const [tests, setTests] = useState<any>({
    health: { status: 'pending', message: '' },
    newsletter: { status: 'pending', message: '' },
    newsletterCount: { status: 'pending', message: '' },
    poll: { status: 'pending', message: '' },
    pollStats: { status: 'pending', message: '' },
  });
  const [isRunning, setIsRunning] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupResult, setSetupResult] = useState<any>(null);

  const updateTest = (key: string, status: string, message: string) => {
    setTests((prev: any) => ({
      ...prev,
      [key]: { status, message }
    }));
  };

  const runSetup = async () => {
    setIsSettingUp(true);
    setSetupResult(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-63010152/setup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      setSetupResult(data);

      if (data.success) {
        // Se o setup foi bem sucedido, executar os testes automaticamente
        setTimeout(() => runTests(), 1000);
      }
    } catch (error: any) {
      setSetupResult({
        success: false,
        error: error.message,
        message: 'Erro ao tentar configurar o banco de dados'
      });
    } finally {
      setIsSettingUp(false);
    }
  };

  const runTests = async () => {
    setIsRunning(true);

    // Reset all tests
    Object.keys(tests).forEach(key => {
      updateTest(key, 'running', 'Testando...');
    });

    // Test 1: Health Check
    try {
      await checkHealth();
      updateTest('health', 'success', 'Servidor respondendo ✓');
    } catch (error: any) {
      updateTest('health', 'error', `Erro: ${error.message}`);
    }

    // Test 2: Newsletter Count
    try {
      const count = await getNewsletterCount();
      updateTest('newsletterCount', 'success', `${count} inscritos encontrados ✓`);
    } catch (error: any) {
      updateTest('newsletterCount', 'error', `Erro: ${error.message}`);
    }

    // Test 3: Newsletter Subscribe (com email de teste)
    try {
      const testEmail = `teste-${Date.now()}@viafluvial.com.br`;
      await subscribeNewsletter({
        email: testEmail,
        source: 'teste-db',
        language: 'pt',
      });
      updateTest('newsletter', 'success', `Email ${testEmail} cadastrado ✓`);
    } catch (error: any) {
      updateTest('newsletter', 'error', `Erro: ${error.message}`);
    }

    // Test 4: Poll Stats
    try {
      const stats = await getPollStats();
      updateTest('pollStats', 'success', `${stats.totalResponses} respostas encontradas ✓`);
    } catch (error: any) {
      updateTest('pollStats', 'error', `Erro: ${error.message}`);
    }

    // Test 5: Submit Poll (com dados de teste)
    try {
      await submitPoll(['comprar', 'horarios'], 'Teste de integração do banco de dados');
      updateTest('poll', 'success', 'Enquete enviada com sucesso ✓');
    } catch (error: any) {
      updateTest('poll', 'error', `Erro: ${error.message}`);
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'running':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const allSuccess = Object.values(tests).every((test: any) => test.status === 'success');
  const hasErrors = Object.values(tests).some((test: any) => test.status === 'error');

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[var(--amazon-green-light)] p-3 rounded-full">
          <Database className="w-6 h-6 text-[var(--amazon-green-dark)]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Teste de Conexão com Supabase
          </h2>
          <p className="text-sm text-gray-600">
            Verifique se o banco de dados está configurado corretamente
          </p>
        </div>
      </div>

      {/* Setup Button */}
      <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <div className="flex items-start gap-3 mb-3">
          <Wrench className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">
              Configuração Automática
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Clique no botão abaixo para tentar criar a tabela automaticamente no Supabase.
              Se não funcionar, será necessário executar o script SQL manualmente.
            </p>
            <Button
              onClick={runSetup}
              disabled={isSettingUp}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              {isSettingUp ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Configurando...
                </>
              ) : (
                <>
                  <Wrench className="w-4 h-4 mr-2" />
                  Configurar Banco Automaticamente
                </>
              )}
            </Button>
          </div>
        </div>

        {setupResult && (
          <div className={`mt-3 p-3 rounded border-2 ${
            setupResult.success 
              ? 'bg-green-50 border-green-300' 
              : 'bg-red-50 border-red-300'
          }`}>
            <p className={`font-semibold mb-2 ${
              setupResult.success ? 'text-green-900' : 'text-red-900'
            }`}>
              {setupResult.message}
            </p>
            {setupResult.instructions && (
              <div className="text-sm text-red-800 space-y-1">
                {setupResult.instructions.map((instruction: string, i: number) => (
                  <p key={i}>{instruction}</p>
                ))}
              </div>
            )}
            {setupResult.nextSteps && (
              <div className="text-sm text-green-800 space-y-1 mt-2">
                <p className="font-semibold">Próximos passos:</p>
                {setupResult.nextSteps.map((step: string, i: number) => (
                  <p key={i}>• {step}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {/* Test 1: Health */}
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(tests.health.status)}`}>
          <div className="flex items-center gap-3">
            {getStatusIcon(tests.health.status)}
            <div className="flex-1">
              <p className="font-semibold text-gray-900">1. Health Check</p>
              <p className="text-sm text-gray-600">{tests.health.message || 'Verificar se o servidor está online'}</p>
            </div>
          </div>
        </div>

        {/* Test 2: Newsletter Count */}
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(tests.newsletterCount.status)}`}>
          <div className="flex items-center gap-3">
            {getStatusIcon(tests.newsletterCount.status)}
            <div className="flex-1">
              <p className="font-semibold text-gray-900">2. Buscar Contador Newsletter</p>
              <p className="text-sm text-gray-600">{tests.newsletterCount.message || 'Testar leitura da tabela'}</p>
            </div>
          </div>
        </div>

        {/* Test 3: Newsletter Subscribe */}
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(tests.newsletter.status)}`}>
          <div className="flex items-center gap-3">
            {getStatusIcon(tests.newsletter.status)}
            <div className="flex-1">
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                3. Cadastrar Email Newsletter
              </p>
              <p className="text-sm text-gray-600">{tests.newsletter.message || 'Testar inserção na tabela'}</p>
            </div>
          </div>
        </div>

        {/* Test 4: Poll Stats */}
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(tests.pollStats.status)}`}>
          <div className="flex items-center gap-3">
            {getStatusIcon(tests.pollStats.status)}
            <div className="flex-1">
              <p className="font-semibold text-gray-900">4. Buscar Estatísticas da Enquete</p>
              <p className="text-sm text-gray-600">{tests.pollStats.message || 'Testar leitura de dados agregados'}</p>
            </div>
          </div>
        </div>

        {/* Test 5: Submit Poll */}
        <div className={`p-4 rounded-lg border-2 ${getStatusColor(tests.poll.status)}`}>
          <div className="flex items-center gap-3">
            {getStatusIcon(tests.poll.status)}
            <div className="flex-1">
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                5. Enviar Resposta da Enquete
              </p>
              <p className="text-sm text-gray-600">{tests.poll.message || 'Testar inserção de dados complexos'}</p>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={runTests}
        disabled={isRunning}
        className="w-full bg-[var(--amazon-green)] hover:bg-[var(--amazon-green-dark)] text-white"
        size="lg"
      >
        {isRunning ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Executando testes...
          </>
        ) : (
          <>
            <Database className="w-5 h-5 mr-2" />
            Executar Todos os Testes
          </>
        )}
      </Button>

      {/* Result Summary */}
      {!isRunning && (allSuccess || hasErrors) && (
        <div className={`mt-6 p-4 rounded-lg border-2 ${
          allSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {allSuccess ? (
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className={`font-bold ${allSuccess ? 'text-green-900' : 'text-red-900'}`}>
                {allSuccess ? '✅ Todos os testes passaram!' : '❌ Alguns testes falharam'}
              </h3>
              <p className={`text-sm mt-1 ${allSuccess ? 'text-green-700' : 'text-red-700'}`}>
                {allSuccess ? (
                  <>
                    Sua aplicação está 100% conectada ao Supabase e pronta para uso em produção! 🎉
                    <br />
                    <strong className="mt-2 block">Próximos passos:</strong>
                    • Acesse o dashboard administrativo em <code className="bg-white px-1 rounded">/admin</code>
                    <br />
                    • Teste a landing page cadastrando emails reais
                    <br />
                    • Compartilhe o link com seus usuários
                  </>
                ) : (
                  <>
                    O banco de dados ainda não está configurado corretamente.
                    <br />
                    <strong className="mt-2 block">Tente estas opções:</strong>
                    1. Clique no botão "Configurar Banco Automaticamente" acima
                    <br />
                    2. OU acesse o Supabase Dashboard e execute o script <code className="bg-white px-1 rounded">supabase-setup.sql</code>
                    <br />
                    3. Depois execute os testes novamente
                    <br />
                    <br />
                    📚 Consulte o arquivo <code className="bg-white px-1 rounded">SUPABASE-SETUP-GUIDE.md</code> para instruções detalhadas.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}