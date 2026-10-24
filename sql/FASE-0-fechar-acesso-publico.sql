-- ==========================================================================================
-- FASE 0 - Fechar o acesso público ao banco do site sobre.viafluvial.com.br
-- ==========================================================================================
--
-- Por quê: as regras atuais permitem que QUALQUER pessoa com a chave pública (que ia dentro do site) leia, altere e
-- apague os inscritos (nome, e-mail, WhatsApp), respostas de quiz e enquete e dados de visitantes.
--
-- O que faz:
--   1. Remove TODAS as políticas (policies) das tabelas do site.
--   2. Mantém o RLS ligado, sem nenhuma política: o acesso pela chave pública (anon) e por usuários (authenticated)
--      fica bloqueado para leitura, inserção, alteração e exclusão.
--   3. Revoga os privilégios das funções anon e authenticated nessas tabelas.
--
-- O que NÃO faz: não apaga dados. Os inscritos continuam guardados para o e-mail único de lançamento; depois de 30
-- dias os dados antigos serão apagados (ver .project/proposta-landing-sobre.md, seção 11).
--
-- Quem usa depois disso: só o painel do Supabase e a chave de serviço (service_role), que ignoram o RLS.
--
-- Como executar: Supabase > SQL Editor > colar este arquivo > Run. Pode ser executado mais de uma vez.
-- ==========================================================================================

DO $$
DECLARE
  t text;
  p record;
  site_tables text[] := ARRAY[
    'visitors', 'visitor_sessions', 'leads', 'lead_consents', 'quiz_attempts', 'quiz_answers',
    'poll_submissions', 'poll_submission_items', 'funnel_events', 'geolocation_permissions'
  ];
BEGIN
  FOREACH t IN ARRAY site_tables LOOP
    IF to_regclass('public.' || t) IS NULL THEN
      RAISE NOTICE 'Tabela % não existe, ignorada', t;
      CONTINUE;
    END IF;

    FOR p IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = t LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', p.policyname, t);
    END LOOP;

    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', t);
    RAISE NOTICE 'Tabela % fechada', t;
  END LOOP;
END $$;

-- A antiga tabela chave-valor do Figma Make, se existir, também fica fechada.
DO $$
DECLARE
  t record;
  p record;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'kv_store%' LOOP
    FOR p IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = t.tablename LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', p.policyname, t.tablename);
    END LOOP;
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', t.tablename);
  END LOOP;
END $$;

-- ==========================================================================================
-- Conferência: as duas consultas devem voltar VAZIAS.
-- ==========================================================================================

-- 1) Nenhuma política restante nas tabelas do site.
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND (tablename IN ('visitors', 'visitor_sessions', 'leads', 'lead_consents', 'quiz_attempts', 'quiz_answers',
                     'poll_submissions', 'poll_submission_items', 'funnel_events', 'geolocation_permissions')
       OR tablename LIKE 'kv_store%');

-- 2) Nenhum privilégio para anon ou authenticated nessas tabelas.
SELECT table_name, grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated')
  AND (table_name IN ('visitors', 'visitor_sessions', 'leads', 'lead_consents', 'quiz_attempts', 'quiz_answers',
                      'poll_submissions', 'poll_submission_items', 'funnel_events', 'geolocation_permissions')
       OR table_name LIKE 'kv_store%');
