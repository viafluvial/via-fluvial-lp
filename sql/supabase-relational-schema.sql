-- ==========================================
-- VIA FLUVIAL AMAZÔNIA - SCHEMA RELACIONAL COMPLETO
-- ==========================================
-- Execute este script no Supabase Dashboard:
-- https://supabase.com/dashboard/project/ibwprzjqvegzepphznkm/sql/new
-- ==========================================
-- Este schema substitui o modelo chave-valor por estrutura relacional
-- normalizada, conforme especificado no requisito do projeto
-- ==========================================

-- ==========================================
-- 1. TABELA: visitors (Visitantes)
-- ==========================================
-- Cada pessoa que entra no site gera um visitor_id
-- Este ID é anônimo e não depende de email/WhatsApp
-- ==========================================

CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT UNIQUE NOT NULL, -- ID técnico gerado no frontend
  first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visitors_visitor_id ON visitors(visitor_id);
CREATE INDEX idx_visitors_first_visit ON visitors(first_visit_at DESC);

-- ==========================================
-- 2. TABELA: visitor_sessions (Sessões)
-- ==========================================
-- Cada visita ao site possui uma sessão
-- Vinculada ao visitor_id
-- ==========================================

CREATE TABLE IF NOT EXISTS visitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL, -- ID técnico da sessão
  visitor_id TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  pages_viewed INTEGER DEFAULT 1,
  language TEXT, -- pt, en, es
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_visitor_id ON visitor_sessions(visitor_id);
CREATE INDEX idx_sessions_started_at ON visitor_sessions(started_at DESC);
CREATE INDEX idx_sessions_language ON visitor_sessions(language);

-- ==========================================
-- 3. TABELA: leads (Leads/Contatos)
-- ==========================================
-- Quando o usuário preenche email/WhatsApp, vira um lead
-- Lead concentra histórico anterior do visitante
-- ==========================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT, -- Vincula ao visitor que virou lead
  email TEXT UNIQUE NOT NULL,
  whatsapp TEXT,
  profile_type TEXT NOT NULL, -- passageiro, barqueiro, agencia, outros
  source TEXT NOT NULL, -- hero, quiz, cta-final, poll, etc
  language TEXT, -- pt, en, es
  
  -- Geolocalização
  geo_city TEXT,
  geo_state TEXT,
  geo_country TEXT,
  geo_latitude NUMERIC(10, 8),
  geo_longitude NUMERIC(11, 8),
  geo_accuracy NUMERIC(10, 2),
  geo_source TEXT, -- gps, ip
  
  -- Controle
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_visitor_id ON leads(visitor_id);
CREATE INDEX idx_leads_profile_type ON leads(profile_type);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_geo_state ON leads(geo_state);

-- ==========================================
-- 4. TABELA: lead_consents (Consentimentos)
-- ==========================================
-- Armazena os consentimentos dados pelo lead
-- ==========================================

CREATE TABLE IF NOT EXISTS lead_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL,
  
  -- Tipos de consentimento
  consent_email BOOLEAN DEFAULT false,
  consent_whatsapp BOOLEAN DEFAULT false,
  consent_launch_notification BOOLEAN DEFAULT false, -- Notificar 24h antes
  consent_privacy_policy BOOLEAN DEFAULT false,
  consent_location_precise BOOLEAN DEFAULT false, -- Geolocalização precisa (GPS)
  
  -- Timestamps de cada consentimento
  consented_email_at TIMESTAMP WITH TIME ZONE,
  consented_whatsapp_at TIMESTAMP WITH TIME ZONE,
  consented_launch_at TIMESTAMP WITH TIME ZONE,
  consented_privacy_at TIMESTAMP WITH TIME ZONE,
  consented_location_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE INDEX idx_consents_lead_id ON lead_consents(lead_id);
CREATE INDEX idx_consents_launch_notification ON lead_consents(consent_launch_notification) WHERE consent_launch_notification = true;

-- ==========================================
-- 5. TABELA: quiz_attempts (Tentativas de Quiz)
-- ==========================================
-- Cada vez que alguém faz o quiz
-- ==========================================

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT,
  session_id TEXT,
  lead_id UUID, -- Se já for lead
  
  -- Resultado
  result_profile TEXT, -- frequentTraveler, familyTraveler, explorer, etc
  completed BOOLEAN DEFAULT false,
  completion_percentage INTEGER DEFAULT 0,
  
  -- Controle
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id) ON DELETE SET NULL,
  FOREIGN KEY (session_id) REFERENCES visitor_sessions(session_id) ON DELETE SET NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
);

CREATE INDEX idx_quiz_attempts_visitor_id ON quiz_attempts(visitor_id);
CREATE INDEX idx_quiz_attempts_lead_id ON quiz_attempts(lead_id);
CREATE INDEX idx_quiz_attempts_result_profile ON quiz_attempts(result_profile);
CREATE INDEX idx_quiz_attempts_completed ON quiz_attempts(completed) WHERE completed = true;

-- ==========================================
-- 6. TABELA: quiz_answers (Respostas do Quiz)
-- ==========================================
-- Cada pergunta respondida é uma linha
-- NÃO é um JSON único com todas as respostas
-- ==========================================

CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_attempt_id UUID NOT NULL,
  
  -- Pergunta e resposta
  question_number INTEGER NOT NULL, -- 1, 2, 3...
  question_key TEXT NOT NULL, -- question1, question2...
  answer_key TEXT NOT NULL, -- option1, option2...
  answer_text TEXT,
  
  -- Controle
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (quiz_attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE
);

CREATE INDEX idx_quiz_answers_attempt_id ON quiz_answers(quiz_attempt_id);
CREATE INDEX idx_quiz_answers_question ON quiz_answers(question_key);
CREATE INDEX idx_quiz_answers_answer ON quiz_answers(answer_key);

-- ==========================================
-- 7. TABELA: poll_submissions (Submissões da Enquete)
-- ==========================================
-- Cada vez que alguém responde a enquete
-- ==========================================

CREATE TABLE IF NOT EXISTS poll_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT,
  session_id TEXT,
  lead_id UUID, -- Se já for lead
  
  -- Sugestão livre (opcional)
  suggestions TEXT,
  suggestions_category TEXT, -- funcionalidades, pagamento, rotas, etc
  
  -- Controle
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id) ON DELETE SET NULL,
  FOREIGN KEY (session_id) REFERENCES visitor_sessions(session_id) ON DELETE SET NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
);

CREATE INDEX idx_poll_submissions_visitor_id ON poll_submissions(visitor_id);
CREATE INDEX idx_poll_submissions_lead_id ON poll_submissions(lead_id);
CREATE INDEX idx_poll_submissions_submitted_at ON poll_submissions(submitted_at DESC);

-- ==========================================
-- 8. TABELA: poll_submission_items (Itens Selecionados na Enquete)
-- ==========================================
-- Cada opção marcada na enquete é uma linha
-- NÃO é um array JSON
-- ==========================================

CREATE TABLE IF NOT EXISTS poll_submission_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_submission_id UUID NOT NULL,
  
  -- Opção selecionada
  option_key TEXT NOT NULL, -- buyTicket, schedules, tracking, payment, reliable
  option_text TEXT,
  
  -- Controle
  selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (poll_submission_id) REFERENCES poll_submissions(id) ON DELETE CASCADE
);

CREATE INDEX idx_poll_items_submission_id ON poll_submission_items(poll_submission_id);
CREATE INDEX idx_poll_items_option_key ON poll_submission_items(option_key);

-- ==========================================
-- 9. TABELA: funnel_events (Eventos do Funil)
-- ==========================================
-- Rastreamento estruturado de eventos
-- ==========================================

CREATE TABLE IF NOT EXISTS funnel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT,
  session_id TEXT,
  lead_id UUID,
  
  -- Tipo de evento
  event_type TEXT NOT NULL, -- page_view, cta_click, quiz_start, quiz_complete, form_submit, poll_submit
  event_category TEXT, -- hero, benefits, quiz, poll, cta
  event_label TEXT, -- Detalhes específicos do evento
  
  -- Dados adicionais (opcional, mas estruturado)
  event_value NUMERIC(10, 2),
  event_metadata JSONB, -- Apenas para dados muito específicos, não para tudo
  
  -- Controle
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id) ON DELETE SET NULL,
  FOREIGN KEY (session_id) REFERENCES visitor_sessions(session_id) ON DELETE SET NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
);

CREATE INDEX idx_funnel_events_visitor_id ON funnel_events(visitor_id);
CREATE INDEX idx_funnel_events_session_id ON funnel_events(session_id);
CREATE INDEX idx_funnel_events_lead_id ON funnel_events(lead_id);
CREATE INDEX idx_funnel_events_type ON funnel_events(event_type);
CREATE INDEX idx_funnel_events_occurred_at ON funnel_events(occurred_at DESC);

-- ==========================================
-- 10. TABELA: geolocation_permissions (Permissões de Geolocalização)
-- ==========================================
-- Controle de permissões de localização detalhada
-- ==========================================

CREATE TABLE IF NOT EXISTS geolocation_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT,
  lead_id UUID,
  
  -- Permissão
  permission_granted BOOLEAN DEFAULT false,
  permission_type TEXT, -- browser, manual, ip
  
  -- Controle
  granted_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id) ON DELETE SET NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE INDEX idx_geo_permissions_visitor_id ON geolocation_permissions(visitor_id);
CREATE INDEX idx_geo_permissions_lead_id ON geolocation_permissions(lead_id);
CREATE INDEX idx_geo_permissions_granted ON geolocation_permissions(permission_granted) WHERE permission_granted = true;

-- ==========================================
-- TRIGGERS: Atualizar updated_at automaticamente
-- ==========================================

-- Função genérica para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para visitors
DROP TRIGGER IF EXISTS trigger_visitors_updated_at ON visitors;
CREATE TRIGGER trigger_visitors_updated_at
  BEFORE UPDATE ON visitors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para leads
DROP TRIGGER IF EXISTS trigger_leads_updated_at ON leads;
CREATE TRIGGER trigger_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para lead_consents
DROP TRIGGER IF EXISTS trigger_consents_updated_at ON lead_consents;
CREATE TRIGGER trigger_consents_updated_at
  BEFORE UPDATE ON lead_consents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_submission_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE geolocation_permissions ENABLE ROW LEVEL SECURITY;

-- Políticas: Permitir leitura pública (para estatísticas)
CREATE POLICY "Permitir leitura pública" ON visitors FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON visitor_sessions FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON leads FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON lead_consents FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON quiz_attempts FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON quiz_answers FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON poll_submissions FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON poll_submission_items FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON funnel_events FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON geolocation_permissions FOR SELECT USING (true);

-- Políticas: Permitir inserção autenticada
CREATE POLICY "Permitir inserção" ON visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserção" ON visitor_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserção" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserção" ON lead_consents FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserção" ON quiz_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserção" ON quiz_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserção" ON poll_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserção" ON poll_submission_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserção" ON funnel_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir inserção" ON geolocation_permissions FOR INSERT WITH CHECK (true);

-- Políticas: Permitir atualização autenticada
CREATE POLICY "Permitir atualização" ON visitors FOR UPDATE USING (true);
CREATE POLICY "Permitir atualização" ON visitor_sessions FOR UPDATE USING (true);
CREATE POLICY "Permitir atualização" ON leads FOR UPDATE USING (true);
CREATE POLICY "Permitir atualização" ON lead_consents FOR UPDATE USING (true);
CREATE POLICY "Permitir atualização" ON quiz_attempts FOR UPDATE USING (true);
CREATE POLICY "Permitir atualização" ON geolocation_permissions FOR UPDATE USING (true);

-- ==========================================
-- VIEWS: Consultas úteis pré-definidas
-- ==========================================

-- View: Estatísticas gerais
CREATE OR REPLACE VIEW stats_overview AS
SELECT
  (SELECT COUNT(*) FROM visitors) as total_visitors,
  (SELECT COUNT(*) FROM leads) as total_leads,
  (SELECT COUNT(*) FROM quiz_attempts WHERE completed = true) as completed_quizzes,
  (SELECT COUNT(*) FROM poll_submissions) as poll_responses,
  (SELECT COUNT(*) FROM lead_consents WHERE consent_launch_notification = true) as launch_notifications;

-- View: Distribuição de perfis de leads
CREATE OR REPLACE VIEW stats_profile_distribution AS
SELECT
  profile_type,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM leads), 2) as percentage
FROM leads
GROUP BY profile_type
ORDER BY count DESC;

-- View: Funcionalidades mais desejadas (top 10)
CREATE OR REPLACE VIEW stats_top_poll_options AS
SELECT
  psi.option_key,
  COUNT(*) as votes,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM poll_submission_items), 2) as percentage
FROM poll_submission_items psi
GROUP BY psi.option_key
ORDER BY votes DESC
LIMIT 10;

-- View: Distribuição geográfica por estado
CREATE OR REPLACE VIEW stats_geo_distribution AS
SELECT
  geo_state,
  COUNT(*) as leads_count,
  COUNT(DISTINCT geo_city) as cities_count
FROM leads
WHERE geo_state IS NOT NULL
GROUP BY geo_state
ORDER BY leads_count DESC;

-- View: Taxa de conversão do funil
CREATE OR REPLACE VIEW stats_funnel_conversion AS
SELECT
  'Page Views' as step,
  (SELECT COUNT(*) FROM funnel_events WHERE event_type = 'page_view') as count,
  100.0 as conversion_rate
UNION ALL
SELECT
  'Quiz Started' as step,
  (SELECT COUNT(*) FROM quiz_attempts) as count,
  ROUND((SELECT COUNT(*) FROM quiz_attempts) * 100.0 / NULLIF((SELECT COUNT(*) FROM funnel_events WHERE event_type = 'page_view'), 0), 2) as conversion_rate
UNION ALL
SELECT
  'Quiz Completed' as step,
  (SELECT COUNT(*) FROM quiz_attempts WHERE completed = true) as count,
  ROUND((SELECT COUNT(*) FROM quiz_attempts WHERE completed = true) * 100.0 / NULLIF((SELECT COUNT(*) FROM quiz_attempts), 0), 2) as conversion_rate
UNION ALL
SELECT
  'Poll Submitted' as step,
  (SELECT COUNT(*) FROM poll_submissions) as count,
  ROUND((SELECT COUNT(*) FROM poll_submissions) * 100.0 / NULLIF((SELECT COUNT(*) FROM funnel_events WHERE event_type = 'page_view'), 0), 2) as conversion_rate
UNION ALL
SELECT
  'Leads Captured' as step,
  (SELECT COUNT(*) FROM leads) as count,
  ROUND((SELECT COUNT(*) FROM leads) * 100.0 / NULLIF((SELECT COUNT(*) FROM funnel_events WHERE event_type = 'page_view'), 0), 2) as conversion_rate;

-- ==========================================
-- DADOS DE TESTE (OPCIONAL)
-- ==========================================
-- Descomente abaixo para inserir dados de teste

/*
-- Inserir visitante de teste
INSERT INTO visitors (visitor_id, user_agent, referrer)
VALUES ('test-visitor-001', 'Mozilla/5.0', 'https://google.com');

-- Inserir sessão de teste
INSERT INTO visitor_sessions (session_id, visitor_id, language, pages_viewed)
VALUES ('test-session-001', 'test-visitor-001', 'pt', 5);

-- Inserir lead de teste
INSERT INTO leads (visitor_id, email, profile_type, source, geo_city, geo_state, geo_country)
VALUES ('test-visitor-001', 'teste@example.com', 'passageiro', 'cta-final', 'Manaus', 'Amazonas', 'Brasil');
*/

-- ==========================================
-- VERIFICAÇÃO FINAL
-- ==========================================

-- Listar todas as tabelas criadas
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN (
    'visitors',
    'visitor_sessions',
    'leads',
    'lead_consents',
    'quiz_attempts',
    'quiz_answers',
    'poll_submissions',
    'poll_submission_items',
    'funnel_events',
    'geolocation_permissions'
  )
ORDER BY table_name;

-- ==========================================
-- FIM DO SCHEMA RELACIONAL
-- ==========================================
-- Próximo passo: Atualizar as Edge Functions do Supabase
-- para usar este schema relacional ao invés do kv_store
-- ==========================================
