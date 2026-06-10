-- ==========================================
-- SCRIPT DE VERIFICAÇÃO E TESTE
-- Execute após criar a tabela principal
-- ==========================================

-- 1. Verificar se a tabela existe
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'kv_store_63010152';

-- 2. Verificar colunas da tabela
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'kv_store_63010152'
ORDER BY ordinal_position;

-- 3. Verificar índices criados
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'kv_store_63010152';

-- 4. Verificar políticas RLS
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'kv_store_63010152';

-- 5. Inserir dados de teste
INSERT INTO kv_store_63010152 (key, value) 
VALUES 
  ('newsletter:teste@email.com', 
   '{"email": "teste@email.com", "source": "passageiro-cta-final", "subscribedAt": "2024-03-26T10:00:00Z"}'::jsonb),
  ('poll:teste-123', 
   '{"selectedOptions": ["comprar", "horarios"], "suggestions": "Sugestão de teste", "submittedAt": "2024-03-26T10:05:00Z"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 6. Verificar se os dados foram inseridos
SELECT * FROM kv_store_63010152 ORDER BY created_at DESC;

-- 7. Testar busca por prefixo (usado pela API)
SELECT key, value 
FROM kv_store_63010152 
WHERE key LIKE 'newsletter:%';

-- 8. Contar registros por tipo
SELECT 
  CASE 
    WHEN key LIKE 'newsletter:%' THEN 'Newsletter'
    WHEN key LIKE 'poll:%' THEN 'Enquete'
    ELSE 'Outros'
  END as tipo,
  COUNT(*) as total
FROM kv_store_63010152
GROUP BY tipo;

-- 9. Ver últimos emails cadastrados
SELECT 
  value->>'email' as email,
  value->>'source' as perfil,
  TO_TIMESTAMP((value->>'subscribedAt')::text, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as data_inscricao
FROM kv_store_63010152 
WHERE key LIKE 'newsletter:%'
ORDER BY value->>'subscribedAt' DESC
LIMIT 10;

-- 10. Ver estatísticas da enquete
SELECT 
  jsonb_array_elements_text(value->'selectedOptions') as opcao,
  COUNT(*) as votos
FROM kv_store_63010152 
WHERE key LIKE 'poll:%'
GROUP BY opcao
ORDER BY votos DESC;

-- ==========================================
-- RESULTADOS ESPERADOS
-- ==========================================
-- 
-- 1. Deve mostrar a tabela kv_store_63010152
-- 2. Deve mostrar 4 colunas: key, value, created_at, updated_at
-- 3. Deve mostrar 2 índices
-- 4. Deve mostrar 3 políticas RLS
-- 5-6. Deve mostrar 2 registros de teste
-- 7. Deve mostrar 1 registro de newsletter
-- 8. Deve mostrar contagem: Newsletter=1, Enquete=1
-- 9. Deve mostrar o email teste@email.com
-- 10. Deve mostrar as opções votadas
--
-- Se todos os resultados aparecerem, o banco está configurado corretamente!
-- ==========================================

-- LIMPAR DADOS DE TESTE (opcional)
-- DELETE FROM kv_store_63010152 WHERE key IN ('newsletter:teste@email.com', 'poll:teste-123');
