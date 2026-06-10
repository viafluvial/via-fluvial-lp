-- ==========================================
-- FIX: Políticas RLS para Permitir Exclusão de Leads
-- ==========================================
-- Execute este SQL no Supabase SQL Editor
-- ==========================================

-- 1. LEAD_CONSENTS: Permitir DELETE
DROP POLICY IF EXISTS "allow_delete_lead_consents" ON lead_consents;
CREATE POLICY "allow_delete_lead_consents"
ON lead_consents
FOR DELETE
USING (true);

-- 2. QUIZ_ATTEMPTS: Permitir UPDATE (para desvincular)
DROP POLICY IF EXISTS "allow_update_quiz_attempts" ON quiz_attempts;
CREATE POLICY "allow_update_quiz_attempts"
ON quiz_attempts
FOR UPDATE
USING (true)
WITH CHECK (true);

-- 3. POLL_SUBMISSIONS: Permitir UPDATE (para desvincular)
DROP POLICY IF EXISTS "allow_update_poll_submissions" ON poll_submissions;
CREATE POLICY "allow_update_poll_submissions"
ON poll_submissions
FOR UPDATE
USING (true)
WITH CHECK (true);

-- 4. FUNNEL_EVENTS: Permitir DELETE
DROP POLICY IF EXISTS "allow_delete_funnel_events" ON funnel_events;
CREATE POLICY "allow_delete_funnel_events"
ON funnel_events
FOR DELETE
USING (true);

-- 5. LEADS: Permitir DELETE
DROP POLICY IF EXISTS "allow_delete_leads" ON leads;
CREATE POLICY "allow_delete_leads"
ON leads
FOR DELETE
USING (true);

-- ==========================================
-- VERIFICAR POLÍTICAS CRIADAS
-- ==========================================

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('leads', 'lead_consents', 'quiz_attempts', 'poll_submissions', 'funnel_events')
ORDER BY tablename, policyname;

-- ==========================================
-- ALTERNATIVA: Criar Função RPC no Supabase
-- ==========================================
-- Esta função roda com privilégios do Supabase, 
-- ignorando RLS

CREATE OR REPLACE FUNCTION delete_lead_by_email(lead_email TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER  -- Importante: roda com privilégios do owner
AS $$
DECLARE
  v_lead_id UUID;
  v_email TEXT;
  v_result JSON;
BEGIN
  -- Normalizar email
  v_email := LOWER(TRIM(lead_email));
  
  -- Buscar o lead
  SELECT id INTO v_lead_id
  FROM leads
  WHERE email = v_email;
  
  IF v_lead_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Lead não encontrado'
    );
  END IF;
  
  -- 1. Deletar lead_consents
  DELETE FROM lead_consents WHERE lead_id = v_lead_id;
  
  -- 2. Desvincular quiz_attempts
  UPDATE quiz_attempts SET lead_id = NULL WHERE lead_id = v_lead_id;
  
  -- 3. Desvincular poll_submissions
  UPDATE poll_submissions SET lead_id = NULL WHERE lead_id = v_lead_id;
  
  -- 4. Deletar funnel_events
  DELETE FROM funnel_events WHERE lead_id = v_lead_id;
  
  -- 5. Deletar o lead
  DELETE FROM leads WHERE id = v_lead_id;
  
  -- Retornar sucesso
  RETURN json_build_object(
    'success', true,
    'message', 'Lead deletado com sucesso',
    'deleted_email', v_email,
    'deleted_lead_id', v_lead_id
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Testar a função
-- SELECT delete_lead_by_email('teste@example.com');
