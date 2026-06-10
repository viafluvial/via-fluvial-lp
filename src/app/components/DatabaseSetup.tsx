import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, CheckCircle2, Copy, ExternalLink, Database } from 'lucide-react';
import { checkDatabaseExists, setupDatabase, initializeDefaultData } from '../utils/setup-database';
import { projectId } from '/utils/supabase/info.tsx';

export function DatabaseSetup() {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'missing' | 'ready'>('idle');
  const [error, setError] = useState<string>('');
  const [sqlCode, setSqlCode] = useState<string>('');

  const handleCheck = async () => {
    setChecking(true);
    setError('');
    
    try {
      const result = await checkDatabaseExists();
      
      if (result.exists) {
        setStatus('ready');
        
        // Inicializar dados padrão (no schema relacional não faz nada)
        await initializeDefaultData();
      } else {
        setStatus('missing');
        setError(result.error || 'Schema relacional não encontrado');
        
        // Obter SQL para criar o schema
        const setupResult = await setupDatabase();
        setSqlCode(setupResult.sql);
      }
    } catch (err: any) {
      setStatus('missing');
      setError(err.message);
      
      const setupResult = await setupDatabase();
      setSqlCode(setupResult.sql);
    } finally {
      setChecking(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    alert('SQL copiado para área de transferência!');
  };

  const openSupabaseDashboard = () => {
    window.open(`https://supabase.com/dashboard/project/${projectId}/sql/new`, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Setup do Schema Relacional
        </CardTitle>
        <CardDescription>
          Verifique e configure o schema relacional completo (10 tabelas)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Botão de Verificação */}
        <Button 
          onClick={handleCheck} 
          disabled={checking}
          className="w-full"
        >
          {checking ? '🔍 Verificando...' : '🔍 Verificar Schema Relacional'}
        </Button>

        {/* Status: Schema Pronto */}
        {status === 'ready' && (
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ <strong>Schema relacional encontrado e pronto para uso!</strong>
              <br />
              <div className="mt-2 text-xs space-y-1">
                <div>✓ visitors (visitantes anônimos)</div>
                <div>✓ visitor_sessions (sessões)</div>
                <div>✓ leads (contatos identificados)</div>
                <div>✓ lead_consents (consentimentos)</div>
                <div>✓ quiz_attempts & quiz_answers</div>
                <div>✓ poll_submissions & poll_submission_items</div>
                <div>✓ funnel_events (analytics)</div>
                <div>✓ geolocation_permissions</div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Status: Schema Não Encontrado */}
        {status === 'missing' && (
          <>
            <Alert className="border-red-500 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>❌ Schema relacional não encontrado!</strong>
                <br />
                {error}
                <div className="mt-2 text-xs">
                  <strong>O que está faltando:</strong> 10 tabelas relacionais que substituem o modelo chave-valor antigo (kv_store_63010152).
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">📋 Siga estes passos:</h3>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="font-bold text-blue-600">1.</span>
                  <div className="flex-1">
                    <p className="text-sm text-blue-900">
                      <strong>Abra o Supabase Dashboard</strong>
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={openSupabaseDashboard}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir SQL Editor
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="font-bold text-blue-600">2.</span>
                  <div className="flex-1">
                    <p className="text-sm text-blue-900 mb-2">
                      <strong>Copie e cole este SQL no editor:</strong>
                    </p>
                    <p className="text-xs text-blue-700 mb-2">
                      Este script cria 10 tabelas relacionais normalizadas com índices, triggers e RLS configurados.
                    </p>
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto max-h-96">
                        {sqlCode}
                      </pre>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={copyToClipboard}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar SQL
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="font-bold text-blue-600">3.</span>
                  <div className="flex-1">
                    <p className="text-sm text-blue-900">
                      <strong>Clique em "Run" no Supabase</strong>
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Aguarde a confirmação de que o SQL foi executado com sucesso. Isso pode levar alguns segundos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                  <span className="font-bold text-green-600">4.</span>
                  <div className="flex-1">
                    <p className="text-sm text-green-900">
                      <strong>Volte aqui e clique em "Verificar" novamente</strong>
                    </p>
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={handleCheck}
                    >
                      🔄 Verificar Novamente
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Informações Adicionais */}
        {status === 'idle' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>ℹ️ Migração para Schema Relacional</strong>
              <br />
              Clique no botão acima para verificar se o schema relacional está configurado.
              <br />
              <div className="mt-2 text-xs text-gray-600">
                <strong>Novo schema inclui:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Sistema de visitantes e sessões rastreáveis</li>
                  <li>Leads com geolocalização estruturada</li>
                  <li>Consentimentos detalhados (LGPD compliant)</li>
                  <li>Quiz e enquete normalizados (não mais JSON)</li>
                  <li>Eventos de funil para analytics</li>
                  <li>Views pré-definidas para estatísticas</li>
                </ul>
              </div>
              <span className="text-xs text-gray-500 mt-2 block">
                Project ID: <code className="bg-gray-100 px-1 rounded">{projectId}</code>
              </span>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}