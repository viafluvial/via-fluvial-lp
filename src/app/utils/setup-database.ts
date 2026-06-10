import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info.tsx';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

/**
 * Cria o schema relacional completo no Supabase
 * IMPORTANTE: Isso só funciona se você tiver permissões adequadas
 * ou pode precisar executar o SQL manualmente no dashboard
 */
export async function setupDatabase() {
  const sql = `
-- ==========================================
-- VIA FLUVIAL AMAZÔNIA - SCHEMA RELACIONAL COMPLETO
-- ==========================================
-- Execute este script no Supabase Dashboard:
-- https://supabase.com/dashboard/project/${projectId}/sql/new
-- ==========================================

-- ==========================================
-- 1. TABELA: visitors (Visitantes)
-- ==========================================

CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT UNIQUE NOT NULL,
  first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitors_first_visit ON visitors(first_visit_at DESC);

-- ==========================================
-- 2. TABELA: visitor_sessions (Sessões)
-- ==========================================

CREATE TABLE IF NOT EXISTS visitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  visitor_id TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  pages_viewed INTEGER DEFAULT 1,
  language TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON visitor_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON visitor_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_language ON visitor_sessions(language);

-- ==========================================
-- 3. TABELA: leads (Leads/Contatos)
-- ==========================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT,
  email TEXT UNIQUE NOT NULL,
  whatsapp TEXT,
  profile_type TEXT NOT NULL,
  source TEXT NOT NULL,
  language TEXT,
  
  -- Geolocalização
  geo_city TEXT,
  geo_state TEXT,
  geo_country TEXT,
  geo_latitude NUMERIC(10, 8),
  geo_longitude NUMERIC(11, 8),
  geo_accuracy NUMERIC(10, 2),
  geo_source TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_visitor_id ON leads(visitor_id);
CREATE INDEX IF NOT EXISTS idx_leads_profile_type ON leads(profile_type);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_geo_state ON leads(geo_state);

-- ==========================================
-- 4. TABELA: lead_consents (Consentimentos)
-- ==========================================

CREATE TABLE IF NOT EXISTS lead_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL,
  
  consent_email BOOLEAN DEFAULT false,
  consent_whatsapp BOOLEAN DEFAULT false,
  consent_launch_notification BOOLEAN DEFAULT false,
  consent_privacy_policy BOOLEAN DEFAULT false,
  consent_location_precise BOOLEAN DEFAULT false,
  
  consented_email_at TIMESTAMP WITH TIME ZONE,
  consented_whatsapp_at TIMESTAMP WITH TIME ZONE,
  consented_launch_at TIMESTAMP WITH TIME ZONE,
  consented_privacy_at TIMESTAMP WITH TIME ZONE,
  consented_location_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_consents_lead_id ON lead_consents(lead_id);
CREATE INDEX IF NOT EXISTS idx_consents_launch_notification ON lead_consents(consent_launch_notification) WHERE consent_launch_notification = true;

-- ==========================================
-- 5. TABELA: quiz_attempts (Tentativas de Quiz)
-- ==========================================

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT,
  session_id TEXT,
  lead_id UUID,
  
  result_profile TEXT,
  completed BOOLEAN DEFAULT false,
  completion_percentage INTEGER DEFAULT 0,
  
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id) ON DELETE SET NULL,
  FOREIGN KEY (session_id) REFERENCES visitor_sessions(session_id) ON DELETE SET NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_visitor_id ON quiz_attempts(visitor_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_lead_id ON quiz_attempts(lead_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_result_profile ON quiz_attempts(result_profile);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_completed ON quiz_attempts(completed) WHERE completed = true;

-- ==========================================
-- 6. TABELA: quiz_answers (Respostas do Quiz)
-- ==========================================

CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_attempt_id UUID NOT NULL,
  
  question_number INTEGER NOT NULL,
  question_key TEXT NOT NULL,
  answer_key TEXT NOT NULL,
  answer_text TEXT,
  
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (quiz_attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_attempt_id ON quiz_answers(quiz_attempt_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_question ON quiz_answers(question_key);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_answer ON quiz_answers(answer_key);

-- ==========================================
-- 7. TABELA: poll_submissions (Submissões da Enquete)
-- ==========================================

CREATE TABLE IF NOT EXISTS poll_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT,
  session_id TEXT,
  lead_id UUID,
  
  suggestions TEXT,
  suggestions_category TEXT,
  
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id) ON DELETE SET NULL,
  FOREIGN KEY (session_id) REFERENCES visitor_sessions(session_id) ON DELETE SET NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_poll_submissions_visitor_id ON poll_submissions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_poll_submissions_lead_id ON poll_submissions(lead_id);
CREATE INDEX IF NOT EXISTS idx_poll_submissions_submitted_at ON poll_submissions(submitted_at DESC);

-- ==========================================
-- 8. TABELA: poll_submission_items (Itens da Enquete)
-- ==========================================

CREATE TABLE IF NOT EXISTS poll_submission_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_submission_id UUID NOT NULL,
  
  option_key TEXT NOT NULL,
  option_text TEXT,
  
  selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (poll_submission_id) REFERENCES poll_submissions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_poll_items_submission_id ON poll_submission_items(poll_submission_id);
CREATE INDEX IF NOT EXISTS idx_poll_items_option_key ON poll_submission_items(option_key);

-- ==========================================
-- 9. TABELA: funnel_events (Eventos do Funil)
-- ==========================================

CREATE TABLE IF NOT EXISTS funnel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT,
  session_id TEXT,
  lead_id UUID,
  
  event_type TEXT NOT NULL,
  event_category TEXT,
  event_label TEXT,
  event_value NUMERIC(10, 2),
  event_metadata JSONB,
  
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id) ON DELETE SET NULL,
  FOREIGN KEY (session_id) REFERENCES visitor_sessions(session_id) ON DELETE SET NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_funnel_events_visitor_id ON funnel_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_funnel_events_session_id ON funnel_events(session_id);
CREATE INDEX IF NOT EXISTS idx_funnel_events_lead_id ON funnel_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_funnel_events_type ON funnel_events(event_type);
CREATE INDEX IF NOT EXISTS idx_funnel_events_occurred_at ON funnel_events(occurred_at DESC);

-- ==========================================
-- 10. TABELA: geolocation_permissions
-- ==========================================

CREATE TABLE IF NOT EXISTS geolocation_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT,
  lead_id UUID,
  
  permission_granted BOOLEAN DEFAULT false,
  permission_type TEXT,
  
  granted_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id) ON DELETE SET NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_geo_permissions_visitor_id ON geolocation_permissions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_geo_permissions_lead_id ON geolocation_permissions(lead_id);
CREATE INDEX IF NOT EXISTS idx_geo_permissions_granted ON geolocation_permissions(permission_granted) WHERE permission_granted = true;

-- ==========================================
-- TRIGGERS: Atualizar updated_at
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_visitors_updated_at ON visitors;
CREATE TRIGGER trigger_visitors_updated_at
  BEFORE UPDATE ON visitors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_leads_updated_at ON leads;
CREATE TRIGGER trigger_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_consents_updated_at ON lead_consents;
CREATE TRIGGER trigger_consents_updated_at
  BEFORE UPDATE ON lead_consents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

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

-- Políticas: Leitura pública
DROP POLICY IF EXISTS "Permitir leitura pública" ON visitors;
CREATE POLICY "Permitir leitura pública" ON visitors FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir leitura pública" ON visitor_sessions;
CREATE POLICY "Permitir leitura pública" ON visitor_sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir leitura pública" ON leads;
CREATE POLICY "Permitir leitura pública" ON leads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir leitura pública" ON lead_consents;
CREATE POLICY "Permitir leitura pública" ON lead_consents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir leitura pública" ON quiz_attempts;
CREATE POLICY "Permitir leitura pública" ON quiz_attempts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir leitura pública" ON quiz_answers;
CREATE POLICY "Permitir leitura pública" ON quiz_answers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir leitura pública" ON poll_submissions;
CREATE POLICY "Permitir leitura pública" ON poll_submissions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir leitura pública" ON poll_submission_items;
CREATE POLICY "Permitir leitura pública" ON poll_submission_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir leitura pública" ON funnel_events;
CREATE POLICY "Permitir leitura pública" ON funnel_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir leitura pública" ON geolocation_permissions;
CREATE POLICY "Permitir leitura pública" ON geolocation_permissions FOR SELECT USING (true);

-- Políticas: Inserção
DROP POLICY IF EXISTS "Permitir inserção" ON visitors;
CREATE POLICY "Permitir inserção" ON visitors FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir inserção" ON visitor_sessions;
CREATE POLICY "Permitir inserção" ON visitor_sessions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir inserção" ON leads;
CREATE POLICY "Permitir inserção" ON leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir inserção" ON lead_consents;
CREATE POLICY "Permitir inserção" ON lead_consents FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir inserção" ON quiz_attempts;
CREATE POLICY "Permitir inserção" ON quiz_attempts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir inserção" ON quiz_answers;
CREATE POLICY "Permitir inserção" ON quiz_answers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir inserção" ON poll_submissions;
CREATE POLICY "Permitir inserção" ON poll_submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir inserção" ON poll_submission_items;
CREATE POLICY "Permitir inserção" ON poll_submission_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir inserção" ON funnel_events;
CREATE POLICY "Permitir inserção" ON funnel_events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir inserção" ON geolocation_permissions;
CREATE POLICY "Permitir inserção" ON geolocation_permissions FOR INSERT WITH CHECK (true);

-- Políticas: Atualização
DROP POLICY IF EXISTS "Permitir atualização" ON visitors;
CREATE POLICY "Permitir atualização" ON visitors FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir atualização" ON visitor_sessions;
CREATE POLICY "Permitir atualização" ON visitor_sessions FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir atualização" ON leads;
CREATE POLICY "Permitir atualização" ON leads FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir atualização" ON lead_consents;
CREATE POLICY "Permitir atualização" ON lead_consents FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir atualização" ON quiz_attempts;
CREATE POLICY "Permitir atualização" ON quiz_attempts FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir atualização" ON geolocation_permissions;
CREATE POLICY "Permitir atualização" ON geolocation_permissions FOR UPDATE USING (true);
`;

  return {
    success: false,
    message: 'Execute o SQL manualmente no Supabase Dashboard',
    sql,
    dashboardUrl: `https://supabase.com/dashboard/project/${projectId}/sql/new`,
  };
}

/**
 * Verifica se as tabelas relacionais existem
 */
export async function checkDatabaseExists() {
  try {
    // Tenta buscar das tabelas principais do schema relacional
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('id')
      .limit(1);

    const { data: visitorsData, error: visitorsError } = await supabase
      .from('visitors')
      .select('id')
      .limit(1);

    // Se ambas as tabelas não existem, o schema não foi criado
    if (leadsError && visitorsError) {
      if (
        leadsError.message.includes('does not exist') ||
        leadsError.message.includes('not find the table')
      ) {
        return {
          exists: false,
          error: 'Schema relacional não encontrado no banco de dados',
        };
      }
      return {
        exists: false,
        error: leadsError.message,
      };
    }

    return {
      exists: true,
      message: 'Schema relacional encontrado e funcionando!',
    };
  } catch (error: any) {
    return {
      exists: false,
      error: error.message,
    };
  }
}

/**
 * Inicializa dados padrão (não necessário no schema relacional)
 */
export async function initializeDefaultData() {
  try {
    // No schema relacional não precisamos inicializar dados
    // As tabelas já estão prontas para receber inserts
    return {
      success: true,
      message: 'Schema relacional pronto para uso!',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}