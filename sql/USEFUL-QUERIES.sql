-- ==========================================
-- QUERIES ÚTEIS - VIA FLUVIAL AMAZÔNIA
-- ==========================================
-- Queries SQL prontas para usar no dia a dia
-- Execute no Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ibwprzjqvegzepphznkm/sql/new
-- ==========================================

-- ==========================================
-- 1. VISÃO GERAL (DASHBOARD)
-- ==========================================

-- Estatísticas gerais usando a view pré-definida
SELECT * FROM stats_overview;

-- OU manualmente:
SELECT
  (SELECT COUNT(*) FROM visitors) as total_visitors,
  (SELECT COUNT(*) FROM leads) as total_leads,
  (SELECT COUNT(*) FROM quiz_attempts WHERE completed = true) as completed_quizzes,
  (SELECT COUNT(*) FROM poll_submissions) as poll_responses,
  (SELECT COUNT(*) FROM lead_consents WHERE consent_launch_notification = true) as launch_notifications;


-- ==========================================
-- 2. LEADS (LISTA COMPLETA)
-- ==========================================

-- Todos os leads com suas informações mais importantes
SELECT
  l.email,
  l.profile_type,
  l.whatsapp,
  l.geo_city,
  l.geo_state,
  l.geo_country,
  l.created_at,
  c.consent_launch_notification as notify_24h,
  c.consent_whatsapp as consent_whatsapp
FROM leads l
LEFT JOIN lead_consents c ON l.id = c.lead_id
ORDER BY l.created_at DESC;

-- Leads cadastrados nas últimas 24 horas
SELECT
  email,
  profile_type,
  geo_city,
  geo_state,
  created_at
FROM leads
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Leads por estado (top 10)
SELECT
  geo_state,
  COUNT(*) as total,
  COUNT(DISTINCT geo_city) as total_cities
FROM leads
WHERE geo_state IS NOT NULL
GROUP BY geo_state
ORDER BY total DESC
LIMIT 10;


-- ==========================================
-- 3. PERFIS (SEGMENTAÇÃO)
-- ==========================================

-- Distribuição por perfil usando view pré-definida
SELECT * FROM stats_profile_distribution;

-- OU manualmente:
SELECT
  profile_type,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM leads), 2) as percentage
FROM leads
GROUP BY profile_type
ORDER BY total DESC;

-- Leads de um perfil específico
SELECT
  email,
  whatsapp,
  geo_city,
  geo_state,
  created_at
FROM leads
WHERE profile_type = 'passageiro' -- ou 'barqueiro', 'agencia', 'outros'
ORDER BY created_at DESC;


-- ==========================================
-- 4. ENQUETE (POLL)
-- ==========================================

-- Funcionalidades mais votadas usando view pré-definida
SELECT * FROM stats_top_poll_options;

-- OU manualmente:
SELECT
  option_key,
  COUNT(*) as votes,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM poll_submission_items), 2) as percentage
FROM poll_submission_items
GROUP BY option_key
ORDER BY votes DESC;

-- Todas as respostas da enquete com sugestões
SELECT
  ps.submitted_at,
  ps.suggestions,
  STRING_AGG(psi.option_key, ', ') as selected_options
FROM poll_submissions ps
LEFT JOIN poll_submission_items psi ON ps.id = psi.poll_submission_id
GROUP BY ps.id, ps.submitted_at, ps.suggestions
ORDER BY ps.submitted_at DESC;

-- Sugestões mais recentes (últimas 20)
SELECT
  suggestions,
  submitted_at
FROM poll_submissions
WHERE suggestions IS NOT NULL
  AND suggestions != ''
ORDER BY submitted_at DESC
LIMIT 20;


-- ==========================================
-- 5. GEOLOCALIZAÇÃO
-- ==========================================

-- Distribuição geográfica usando view pré-definida
SELECT * FROM stats_geo_distribution;

-- Leads com geolocalização precisa (GPS)
SELECT
  email,
  geo_city,
  geo_state,
  geo_latitude,
  geo_longitude,
  geo_accuracy,
  geo_source
FROM leads
WHERE geo_latitude IS NOT NULL
  AND geo_longitude IS NOT NULL
ORDER BY geo_accuracy ASC; -- Menor accuracy = mais preciso

-- Leads por cidade (top 10)
SELECT
  geo_city,
  geo_state,
  COUNT(*) as total
FROM leads
WHERE geo_city IS NOT NULL
GROUP BY geo_city, geo_state
ORDER BY total DESC
LIMIT 10;

-- Mapa de calor (para visualização)
SELECT
  geo_latitude as lat,
  geo_longitude as lng,
  COUNT(*) as weight
FROM leads
WHERE geo_latitude IS NOT NULL
  AND geo_longitude IS NOT NULL
GROUP BY geo_latitude, geo_longitude;


-- ==========================================
-- 6. CONSENTIMENTOS (GDPR)
-- ==========================================

-- Leads que aceitaram notificação 24h antes
SELECT
  l.email,
  l.whatsapp,
  l.profile_type,
  c.consented_launch_at
FROM leads l
JOIN lead_consents c ON l.id = c.lead_id
WHERE c.consent_launch_notification = true
ORDER BY c.consented_launch_at DESC;

-- Resumo de consentimentos
SELECT
  COUNT(*) FILTER (WHERE consent_email = true) as consent_email,
  COUNT(*) FILTER (WHERE consent_whatsapp = true) as consent_whatsapp,
  COUNT(*) FILTER (WHERE consent_launch_notification = true) as consent_launch,
  COUNT(*) FILTER (WHERE consent_location_precise = true) as consent_gps
FROM lead_consents;


-- ==========================================
-- 7. QUIZ
-- ==========================================

-- Taxa de conclusão do quiz
SELECT
  COUNT(*) as total_attempts,
  COUNT(*) FILTER (WHERE completed = true) as completed,
  ROUND(COUNT(*) FILTER (WHERE completed = true) * 100.0 / COUNT(*), 2) as completion_rate
FROM quiz_attempts;

-- Distribuição de perfis do quiz
SELECT
  result_profile,
  COUNT(*) as total
FROM quiz_attempts
WHERE completed = true
GROUP BY result_profile
ORDER BY total DESC;

-- Respostas de um quiz específico
SELECT
  qa.question_number,
  qa.question_key,
  qa.answer_key,
  qa.answer_text,
  qa.answered_at
FROM quiz_answers qa
JOIN quiz_attempts qat ON qa.quiz_attempt_id = qat.id
WHERE qat.id = 'UUID_DO_QUIZ_ATTEMPT' -- Substituir pelo ID
ORDER BY qa.question_number;


-- ==========================================
-- 8. FUNIL DE CONVERSÃO
-- ==========================================

-- Taxa de conversão do funil usando view pré-definida
SELECT * FROM stats_funnel_conversion;

-- Eventos do funil por tipo
SELECT
  event_type,
  COUNT(*) as total_events
FROM funnel_events
GROUP BY event_type
ORDER BY total_events DESC;

-- Funil de um lead específico (jornada completa)
SELECT
  fe.event_type,
  fe.event_category,
  fe.event_label,
  fe.occurred_at
FROM funnel_events fe
WHERE fe.lead_id = 'UUID_DO_LEAD' -- Substituir pelo ID
ORDER BY fe.occurred_at ASC;


-- ==========================================
-- 9. ANÁLISE DE CRESCIMENTO
-- ==========================================

-- Leads por dia (últimos 30 dias)
SELECT
  DATE(created_at) as date,
  COUNT(*) as leads_count
FROM leads
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Leads por semana (últimas 12 semanas)
SELECT
  DATE_TRUNC('week', created_at) as week,
  COUNT(*) as leads_count
FROM leads
WHERE created_at >= NOW() - INTERVAL '12 weeks'
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY week DESC;

-- Leads por mês (últimos 6 meses)
SELECT
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as leads_count
FROM leads
WHERE created_at >= NOW() - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;


-- ==========================================
-- 10. EXPORT DE DADOS (CSV)
-- ==========================================

-- Leads completos para export
SELECT
  l.email,
  l.whatsapp,
  l.profile_type,
  l.source,
  l.language,
  l.geo_city,
  l.geo_state,
  l.geo_country,
  l.geo_latitude,
  l.geo_longitude,
  c.consent_launch_notification as notify_24h,
  c.consent_whatsapp as consent_whatsapp,
  l.created_at
FROM leads l
LEFT JOIN lead_consents c ON l.id = c.lead_id
ORDER BY l.created_at DESC;

-- Enquete completa para export
SELECT
  ps.id,
  ps.submitted_at,
  STRING_AGG(psi.option_key, ', ') as selected_options,
  ps.suggestions
FROM poll_submissions ps
LEFT JOIN poll_submission_items psi ON ps.id = psi.poll_submission_id
GROUP BY ps.id, ps.submitted_at, ps.suggestions
ORDER BY ps.submitted_at DESC;


-- ==========================================
-- 11. LIMPEZA E MANUTENÇÃO
-- ==========================================

-- Leads duplicados (verificação)
SELECT
  email,
  COUNT(*) as count
FROM leads
GROUP BY email
HAVING COUNT(*) > 1;

-- Leads sem consentimentos (verificação de integridade)
SELECT l.*
FROM leads l
LEFT JOIN lead_consents c ON l.id = c.lead_id
WHERE c.id IS NULL;

-- Visitantes sem sessões (verificação de integridade)
SELECT v.*
FROM visitors v
LEFT JOIN visitor_sessions vs ON v.visitor_id = vs.visitor_id
WHERE vs.id IS NULL;


-- ==========================================
-- 12. ALERTAS E MONITORAMENTO
-- ==========================================

-- Leads cadastrados na última hora
SELECT COUNT(*) as leads_last_hour
FROM leads
WHERE created_at >= NOW() - INTERVAL '1 hour';

-- Enquetes respondidas na última hora
SELECT COUNT(*) as polls_last_hour
FROM poll_submissions
WHERE submitted_at >= NOW() - INTERVAL '1 hour';

-- Verificar se há erros (leads sem geolocalização)
SELECT
  COUNT(*) as leads_without_geo,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM leads), 2) as percentage
FROM leads
WHERE geo_city IS NULL OR geo_state IS NULL;


-- ==========================================
-- 13. QUERIES AVANÇADAS
-- ==========================================

-- Leads com quiz completo
SELECT
  l.email,
  l.profile_type,
  qa.result_profile as quiz_profile,
  l.created_at
FROM leads l
JOIN quiz_attempts qa ON l.id = qa.lead_id
WHERE qa.completed = true
ORDER BY l.created_at DESC;

-- Leads que fizeram tudo (quiz + enquete + cadastro)
SELECT
  l.email,
  l.profile_type,
  qa.result_profile as quiz_profile,
  COUNT(DISTINCT ps.id) as poll_count
FROM leads l
LEFT JOIN quiz_attempts qa ON l.id = qa.lead_id AND qa.completed = true
LEFT JOIN poll_submissions ps ON l.id = ps.lead_id
GROUP BY l.id, l.email, l.profile_type, qa.result_profile
HAVING COUNT(DISTINCT ps.id) > 0
ORDER BY l.created_at DESC;

-- Jornada completa de um lead (timeline)
SELECT
  'lead_created' as event,
  l.created_at as timestamp
FROM leads l
WHERE l.id = 'UUID_DO_LEAD'
UNION ALL
SELECT
  'quiz_completed' as event,
  qa.completed_at as timestamp
FROM quiz_attempts qa
WHERE qa.lead_id = 'UUID_DO_LEAD' AND qa.completed = true
UNION ALL
SELECT
  'poll_submitted' as event,
  ps.submitted_at as timestamp
FROM poll_submissions ps
WHERE ps.lead_id = 'UUID_DO_LEAD'
UNION ALL
SELECT
  fe.event_type as event,
  fe.occurred_at as timestamp
FROM funnel_events fe
WHERE fe.lead_id = 'UUID_DO_LEAD'
ORDER BY timestamp ASC;


-- ==========================================
-- FIM DAS QUERIES ÚTEIS
-- ==========================================
-- Copie e adapte conforme necessário!
-- ==========================================
