-- ==========================================
-- VIA FLUVIAL AMAZÔNIA - SETUP DO BANCO DE DADOS
-- ==========================================
-- Execute este script no Supabase Dashboard:
-- https://supabase.com/dashboard/project/ibwprzjqvegzepphznkm/sql/new
-- ==========================================

-- 1. Criar a tabela kv_store_63010152
CREATE TABLE IF NOT EXISTS kv_store_63010152 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índice para buscas por prefixo (otimiza getByPrefix)
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix 
ON kv_store_63010152 (key text_pattern_ops);

-- 3. Criar índice para buscas por data
CREATE INDEX IF NOT EXISTS idx_kv_store_created_at 
ON kv_store_63010152 (created_at DESC);

-- 4. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_kv_store_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_kv_store_updated_at ON kv_store_63010152;
CREATE TRIGGER trigger_update_kv_store_updated_at
  BEFORE UPDATE ON kv_store_63010152
  FOR EACH ROW
  EXECUTE FUNCTION update_kv_store_updated_at();

-- 6. Habilitar Row Level Security (RLS)
ALTER TABLE kv_store_63010152 ENABLE ROW LEVEL SECURITY;

-- 7. Política: Permitir leitura pública (para contadores)
CREATE POLICY "Permitir leitura pública"
ON kv_store_63010152
FOR SELECT
USING (true);

-- 8. Política: Permitir inserção autenticada
CREATE POLICY "Permitir inserção autenticada"
ON kv_store_63010152
FOR INSERT
WITH CHECK (true);

-- 9. Política: Permitir atualização autenticada
CREATE POLICY "Permitir atualização autenticada"
ON kv_store_63010152
FOR UPDATE
USING (true);

-- 10. Verificar se a tabela foi criada com sucesso
SELECT 
  'Tabela criada com sucesso!' as status,
  COUNT(*) as total_registros
FROM kv_store_63010152;

-- ==========================================
-- INFORMAÇÕES ÚTEIS
-- ==========================================
-- Visualizar todos os dados:
-- SELECT * FROM kv_store_63010152 ORDER BY created_at DESC;
--
-- Ver contagem de emails cadastrados:
-- SELECT COUNT(*) FROM kv_store_63010152 WHERE key LIKE 'newsletter:%';
--
-- Ver contagem de respostas da enquete:
-- SELECT COUNT(*) FROM kv_store_63010152 WHERE key LIKE 'poll:%';
--
-- Limpar todos os dados (cuidado!):
-- DELETE FROM kv_store_63010152;
-- ==========================================
