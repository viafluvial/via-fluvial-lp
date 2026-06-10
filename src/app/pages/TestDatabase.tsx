import { DatabaseTestPanel } from '../components/DatabaseTestPanel';
import { DatabaseSetup } from '../components/DatabaseSetup';

export default function TestDatabase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--amazon-green-light)] via-white to-[var(--amazon-gold)]/10 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--amazon-green-dark)] mb-4">
            🧪 Setup e Teste do Banco de Dados
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Configure e teste a conexão com o Supabase
          </p>
        </div>

        {/* Setup Component - NOVO! */}
        <div className="mb-8">
          <DatabaseSetup />
        </div>

        {/* Test Panel */}
        <DatabaseTestPanel />
      </div>
    </div>
  );
}