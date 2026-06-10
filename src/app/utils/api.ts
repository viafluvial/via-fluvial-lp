import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info.tsx';

// Criar cliente Supabase
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

// ==========================================
// VISITOR & SESSION MANAGEMENT
// ==========================================

/**
 * Gera um ID único para visitante (armazenado no localStorage)
 */
export function getOrCreateVisitorId(): string {
  const key = 'via_fluvial_visitor_id';
  let visitorId = localStorage.getItem(key);
  
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(key, visitorId);
  }
  
  return visitorId;
}

/**
 * Gera um ID único para sessão
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Registra ou atualiza um visitante no banco
 */
export async function trackVisitor(visitorId: string) {
  try {
    const userAgent = navigator.userAgent;
    const referrer = document.referrer || null;

    const { error } = await supabase
      .from('visitors')
      .upsert(
        {
          visitor_id: visitorId,
          last_visit_at: new Date().toISOString(),
          user_agent: userAgent,
          referrer: referrer,
        },
        { onConflict: 'visitor_id' }
      );

    if (error) throw error;
    console.log('✅ Visitor tracked:', visitorId);
  } catch (error: any) {
    console.error('❌ Erro ao registrar visitante:', error.message);
  }
}

/**
 * Registra uma nova sessão
 */
export async function trackSession(
  sessionId: string,
  visitorId: string,
  language: string
) {
  try {
    const { error } = await supabase.from('visitor_sessions').insert({
      session_id: sessionId,
      visitor_id: visitorId,
      language: language,
      pages_viewed: 1,
    });

    if (error) throw error;
    console.log('✅ Session tracked:', sessionId);
  } catch (error: any) {
    console.error('❌ Erro ao registrar sessão:', error.message);
  }
}

// ==========================================
// NEWSLETTER/LEADS API
// ==========================================

export interface NewsletterData {
  email: string;
  source: string;
  whatsapp?: string;
  notify24h?: boolean;
  language?: string;
  quizResult?: string;
  geolocation?: {
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    source?: string;
  };
}

export async function subscribeNewsletter(data: NewsletterData) {
  try {
    const normalizedEmail = data.email.toLowerCase().trim();
    const visitorId = getOrCreateVisitorId();

    // ✅ GARANTIR que o visitor existe no banco ANTES de inserir o lead
    await trackVisitor(visitorId);

    // Verifica se o email já existe
    const { data: existingLead, error: checkError } = await supabase
      .from('leads')
      .select('id, email')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingLead) {
      throw new Error('Este email já está cadastrado');
    }

    // Extrai o profile_type do source
    // Formato esperado: "passageiro-hero", "barqueiro-quiz", etc
    let profileType = 'passageiro'; // default
    if (data.source) {
      const parts = data.source.split('-');
      if (parts.length > 0) {
        const possibleProfile = parts[0];
        if (['passageiro', 'barqueiro', 'agencia', 'outros'].includes(possibleProfile)) {
          profileType = possibleProfile;
        }
      }
    }

    // Insere o lead
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert({
        visitor_id: visitorId,
        email: normalizedEmail,
        whatsapp: data.whatsapp || null,
        profile_type: profileType,
        source: data.source || 'unknown',
        language: data.language || 'pt',
        geo_city: data.geolocation?.city || null,
        geo_state: data.geolocation?.state || null,
        geo_country: data.geolocation?.country || null,
        geo_latitude: data.geolocation?.latitude || null,
        geo_longitude: data.geolocation?.longitude || null,
        geo_accuracy: data.geolocation?.accuracy || null,
        geo_source: data.geolocation?.source || null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Insere os consentimentos
    const now = new Date().toISOString();
    const { error: consentError } = await supabase
      .from('lead_consents')
      .insert({
        lead_id: newLead.id,
        consent_email: true,
        consent_whatsapp: !!data.whatsapp,
        consent_launch_notification: data.notify24h || false,
        consent_privacy_policy: true,
        consent_location_precise: !!data.geolocation?.latitude,
        consented_email_at: now,
        consented_whatsapp_at: data.whatsapp ? now : null,
        consented_launch_at: data.notify24h ? now : null,
        consented_privacy_at: now,
        consented_location_at: data.geolocation?.latitude ? now : null,
      });

    if (consentError) throw consentError;

    // Se tiver resultado de quiz, vincula ao lead
    if (data.quizResult) {
      await linkQuizToLead(visitorId, newLead.id, data.quizResult);
    }

    // Registra evento de conversão
    await trackFunnelEvent({
      visitor_id: visitorId,
      lead_id: newLead.id,
      event_type: 'form_submit',
      event_category: 'lead_conversion',
      event_label: data.source,
    });

    // Busca o total de leads para retornar a posição
    const { count } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    console.log(`✅ Lead criado: ${normalizedEmail} | Total: ${count}`);

    return {
      success: true,
      message: 'Inscrição realizada com sucesso!',
      position: count || 0,
    };
  } catch (error: any) {
    console.error('❌ Erro ao cadastrar newsletter:', error.message);
    throw error;
  }
}

/**
 * Vincula quiz anterior ao lead criado
 */
async function linkQuizToLead(
  visitorId: string,
  leadId: string,
  quizResult: string
) {
  try {
    // Busca a última tentativa de quiz deste visitante
    const { data: quizAttempt, error } = await supabase
      .from('quiz_attempts')
      .select('id')
      .eq('visitor_id', visitorId)
      .is('lead_id', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (quizAttempt) {
      // Atualiza o quiz vinculando ao lead
      await supabase
        .from('quiz_attempts')
        .update({ lead_id: leadId, result_profile: quizResult })
        .eq('id', quizAttempt.id);

      console.log('✅ Quiz vinculado ao lead');
    }
  } catch (error: any) {
    console.error('❌ Erro ao vincular quiz:', error.message);
  }
}

export async function getNewsletterCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    console.log('📦 Total de leads:', count);
    return count || 0;
  } catch (error: any) {
    console.error('❌ Erro ao buscar contador:', error.message);
    return 0;
  }
}

export async function listNewsletterSubscribers() {
  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select(
        `
        id,
        email,
        whatsapp,
        profile_type,
        source,
        language,
        geo_city,
        geo_state,
        geo_country,
        created_at,
        lead_consents (
          consent_launch_notification
        )
      `
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Formata os dados para manter compatibilidade com o formato anterior
    const formatted = leads.map((lead: any) => ({
      email: lead.email,
      whatsapp: lead.whatsapp,
      source: lead.source,
      language: lead.language,
      notify24h: lead.lead_consents?.[0]?.consent_launch_notification || false,
      geolocation: {
        city: lead.geo_city,
        state: lead.geo_state,
        country: lead.geo_country,
      },
      subscribedAt: lead.created_at,
    }));

    return {
      total: leads.length,
      subscribers: formatted,
    };
  } catch (error: any) {
    console.error('❌ Erro ao listar leads:', error.message);
    return { total: 0, subscribers: [] };
  }
}

// ==========================================
// POLL API
// ==========================================

export async function submitPoll(
  selectedOptions: string[],
  suggestions: string = ''
) {
  try {
    if (!selectedOptions || selectedOptions.length === 0) {
      throw new Error('Selecione pelo menos uma opção');
    }

    const visitorId = getOrCreateVisitorId();
    const sessionId = localStorage.getItem('via_fluvial_session_id') || null;

    // ✅ GARANTIR que o visitor existe no banco ANTES de inserir na enquete
    await trackVisitor(visitorId);

    // Verifica se este visitante já é um lead
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('visitor_id', visitorId)
      .maybeSingle();

    const leadId = existingLead?.id || null;

    // Insere a submissão da enquete
    const { data: submission, error: submissionError } = await supabase
      .from('poll_submissions')
      .insert({
        visitor_id: visitorId,
        session_id: sessionId,
        lead_id: leadId,
        suggestions: suggestions || null,
        suggestions_category: null, // Pode ser categorizado depois
      })
      .select()
      .single();

    if (submissionError) throw submissionError;

    // Insere cada opção selecionada como um item separado
    const items = selectedOptions.map((option) => ({
      poll_submission_id: submission.id,
      option_key: option,
      option_text: null, // Pode ser preenchido com texto legível depois
    }));

    const { error: itemsError } = await supabase
      .from('poll_submission_items')
      .insert(items);

    if (itemsError) throw itemsError;

    // Registra evento
    await trackFunnelEvent({
      visitor_id: visitorId,
      session_id: sessionId,
      lead_id: leadId,
      event_type: 'poll_submit',
      event_category: 'poll',
      event_label: `${selectedOptions.length} options selected`,
    });

    // Busca total de submissões
    const { count } = await supabase
      .from('poll_submissions')
      .select('*', { count: 'exact', head: true });

    console.log(`✅ Enquete respondida! Total: ${count}`);
    console.log(`   📊 Opções: ${selectedOptions.join(', ')}`);

    return {
      success: true,
      message: 'Resposta enviada com sucesso!',
      totalResponses: count || 0,
    };
  } catch (error: any) {
    console.error('❌ Erro ao salvar enquete:', error.message);
    throw error;
  }
}

export async function getPollStats() {
  try {
    // Total de submissões
    const { count: totalResponses } = await supabase
      .from('poll_submissions')
      .select('*', { count: 'exact', head: true });

    // Contagem por opção
    const { data: items, error } = await supabase
      .from('poll_submission_items')
      .select('option_key');

    if (error) throw error;

    const optionCounts: Record<string, number> = {};
    items.forEach((item: any) => {
      optionCounts[item.option_key] = (optionCounts[item.option_key] || 0) + 1;
    });

    // Sugestões recentes
    const { data: submissions } = await supabase
      .from('poll_submissions')
      .select('suggestions, submitted_at')
      .not('suggestions', 'is', null)
      .order('submitted_at', { ascending: false })
      .limit(10);

    const recentSuggestions =
      submissions?.map((s: any) => ({
        suggestion: s.suggestions,
        submittedAt: s.submitted_at
      })).filter(s => s.suggestion) || [];

    return {
      totalResponses: totalResponses || 0,
      optionCounts,
      suggestionsCount: recentSuggestions.length,
      recentSuggestions,
    };
  } catch (error: any) {
    console.error('❌ Erro ao buscar estatísticas:', error.message);
    return {
      totalResponses: 0,
      optionCounts: {},
      suggestionsCount: 0,
      recentSuggestions: [],
    };
  }
}

export async function listPollResponses() {
  try {
    const { data: submissions, error } = await supabase
      .from('poll_submissions')
      .select(
        `
        id,
        suggestions,
        submitted_at,
        poll_submission_items (
          option_key
        )
      `
      )
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    // Formata para manter compatibilidade
    const formatted = submissions.map((sub: any) => ({
      id: sub.id,
      selectedOptions: sub.poll_submission_items.map((item: any) => item.option_key),
      suggestions: sub.suggestions || '',
      submittedAt: sub.submitted_at,
    }));

    return {
      total: submissions.length,
      responses: formatted,
    };
  } catch (error: any) {
    console.error('❌ Erro ao listar respostas:', error.message);
    return { total: 0, responses: [] };
  }
}

// ==========================================
// QUIZ API
// ==========================================

export interface QuizAnswer {
  questionNumber: number;
  questionKey: string;
  answerKey: string;
  answerText: string;
}

export async function startQuiz(sessionId?: string) {
  try {
    const visitorId = getOrCreateVisitorId();
    const currentSessionId =
      sessionId || localStorage.getItem('via_fluvial_session_id') || null;

    // ✅ GARANTIR que o visitor existe no banco ANTES de inserir o quiz
    await trackVisitor(visitorId);

    const { data: attempt, error } = await supabase
      .from('quiz_attempts')
      .insert({
        visitor_id: visitorId,
        session_id: currentSessionId,
        completed: false,
        completion_percentage: 0,
      })
      .select()
      .single();

    if (error) throw error;

    // Registra evento
    await trackFunnelEvent({
      visitor_id: visitorId,
      session_id: currentSessionId,
      event_type: 'quiz_start',
      event_category: 'quiz',
      event_label: 'Quiz iniciado',
    });

    console.log('✅ Quiz iniciado:', attempt.id);
    return attempt.id;
  } catch (error: any) {
    console.error('❌ Erro ao iniciar quiz:', error.message);
    throw error;
  }
}

export async function saveQuizAnswer(
  attemptId: string,
  answer: QuizAnswer
) {
  try {
    const { error } = await supabase.from('quiz_answers').insert({
      quiz_attempt_id: attemptId,
      question_number: answer.questionNumber,
      question_key: answer.questionKey,
      answer_key: answer.answerKey,
      answer_text: answer.answerText,
    });

    if (error) throw error;
    console.log(`✅ Resposta salva: ${answer.questionKey} = ${answer.answerKey}`);
  } catch (error: any) {
    console.error('❌ Erro ao salvar resposta:', error.message);
    throw error;
  }
}

export async function completeQuiz(attemptId: string, resultProfile: string) {
  try {
    const visitorId = getOrCreateVisitorId();
    const sessionId = localStorage.getItem('via_fluvial_session_id') || null;

    const { error } = await supabase
      .from('quiz_attempts')
      .update({
        completed: true,
        completion_percentage: 100,
        result_profile: resultProfile,
        completed_at: new Date().toISOString(),
      })
      .eq('id', attemptId);

    if (error) throw error;

    // Registra evento
    await trackFunnelEvent({
      visitor_id: visitorId,
      session_id: sessionId,
      event_type: 'quiz_complete',
      event_category: 'quiz',
      event_label: resultProfile,
    });

    console.log(`✅ Quiz completo: ${resultProfile}`);
  } catch (error: any) {
    console.error('❌ Erro ao completar quiz:', error.message);
    throw error;
  }
}

// ==========================================
// FUNNEL EVENTS
// ==========================================

export interface FunnelEventData {
  visitor_id: string;
  session_id?: string | null;
  lead_id?: string | null;
  event_type: string;
  event_category: string;
  event_label?: string;
  event_value?: number;
  event_metadata?: Record<string, any>;
}

export async function trackFunnelEvent(event: FunnelEventData) {
  try {
    const { error } = await supabase.from('funnel_events').insert({
      visitor_id: event.visitor_id,
      session_id: event.session_id || null,
      lead_id: event.lead_id || null,
      event_type: event.event_type,
      event_category: event.event_category,
      event_label: event.event_label || null,
      event_value: event.event_value || null,
      event_metadata: event.event_metadata || null,
    });

    if (error) throw error;
  } catch (error: any) {
    console.error('❌ Erro ao registrar evento:', error.message);
  }
}

// ==========================================
// ANALYTICS & STATS
// ==========================================

export async function getAnalyticsOverview() {
  try {
    // Total de visitantes
    const { count: totalVisitors } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    // Total de leads
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    // Quiz completos
    const { count: completedQuizzes } = await supabase
      .from('quiz_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('completed', true);

    // Respostas de enquete
    const { count: pollResponses } = await supabase
      .from('poll_submissions')
      .select('*', { count: 'exact', head: true });

    // Notificações 24h
    const { count: launchNotifications } = await supabase
      .from('lead_consents')
      .select('*', { count: 'exact', head: true })
      .eq('consent_launch_notification', true);

    return {
      totalVisitors: totalVisitors || 0,
      totalLeads: totalLeads || 0,
      completedQuizzes: completedQuizzes || 0,
      pollResponses: pollResponses || 0,
      launchNotifications: launchNotifications || 0,
      conversionRate:
        totalVisitors && totalLeads
          ? ((totalLeads / totalVisitors) * 100).toFixed(2)
          : '0.00',
    };
  } catch (error: any) {
    console.error('❌ Erro ao buscar analytics:', error.message);
    return {
      totalVisitors: 0,
      totalLeads: 0,
      completedQuizzes: 0,
      pollResponses: 0,
      launchNotifications: 0,
      conversionRate: '0.00',
    };
  }
}

export async function getProfileDistribution() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('profile_type');

    if (error) throw error;

    const distribution: Record<string, number> = {};
    data.forEach((lead: any) => {
      const profile = lead.profile_type;
      distribution[profile] = (distribution[profile] || 0) + 1;
    });

    return distribution;
  } catch (error: any) {
    console.error('❌ Erro ao buscar distribuição:', error.message);
    return {};
  }
}

// ==========================================
// HEALTH CHECK
// ==========================================

export async function checkHealth() {
  try {
    // Testa conexão com a tabela leads
    const { data, error } = await supabase
      .from('leads')
      .select('id')
      .limit(1);

    if (error) throw error;

    return {
      status: 'ok',
      model: 'supabase-relational',
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

// ==========================================
// LEAD MANAGEMENT
// ==========================================

/**
 * Deleta um lead e todos os dados relacionados (cascata)
 * VERSÃO 2: Usa RPC function do Supabase para bypassar RLS
 */
export async function deleteLead(email: string) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    console.log(`🗑️ [DELETE] Iniciando exclusão do lead: ${normalizedEmail}`);

    // Tenta usar a função RPC (bypassa RLS)
    console.log('🔄 Tentando via RPC function...');
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      'delete_lead_by_email',
      { lead_email: normalizedEmail }
    );

    if (!rpcError && rpcResult) {
      console.log('✅ RPC Result:', rpcResult);
      
      if (rpcResult.success) {
        console.log('🎉 Lead deletado via RPC com sucesso!');
        return {
          success: true,
          message: 'Lead e dados relacionados deletados com sucesso',
          deletedEmail: normalizedEmail,
          method: 'rpc',
        };
      } else {
        throw new Error(rpcResult.error || 'Erro desconhecido na RPC');
      }
    }

    // Se RPC falhar, tenta via queries diretas
    console.warn('⚠️ RPC não disponível, tentando via queries diretas...');
    console.log('⚠️ RPC Error:', rpcError?.message);

    // Busca o lead pelo email
    const { data: lead, error: findError } = await supabase
      .from('leads')
      .select('id, visitor_id')
      .eq('email', normalizedEmail)
      .single();

    if (findError) {
      console.error('❌ Erro ao buscar lead:', findError);
      throw new Error(`Erro ao buscar lead: ${findError.message}`);
    }
    if (!lead) {
      console.error('❌ Lead não encontrado');
      throw new Error('Lead não encontrado');
    }

    const leadId = lead.id;
    console.log(`✅ Lead encontrado: ${leadId}`);

    // 1. Deletar lead_consents (FK: lead_id)
    console.log('🔄 [1/5] Deletando consentimentos...');
    const { error: consentsError } = await supabase
      .from('lead_consents')
      .delete()
      .eq('lead_id', leadId);

    if (consentsError) {
      console.error('❌ [1/5] Erro ao deletar consentimentos:', consentsError);
      throw new Error(`Erro ao deletar consentimentos: ${consentsError.message}`);
    }
    console.log('✅ [1/5] Consentimentos deletados');

    // 2. Atualizar quiz_attempts (remover FK lead_id, manter visitor)
    console.log('🔄 [2/5] Desvinculando quiz attempts...');
    const { error: quizError } = await supabase
      .from('quiz_attempts')
      .update({ lead_id: null })
      .eq('lead_id', leadId);

    if (quizError) {
      console.error('❌ [2/5] Erro ao atualizar quiz_attempts:', quizError);
      throw new Error(`Erro ao atualizar quiz_attempts: ${quizError.message}`);
    }
    console.log('✅ [2/5] Quiz attempts desvinculados');

    // 3. Atualizar poll_submissions (remover FK lead_id, manter visitor)
    console.log('🔄 [3/5] Desvinculando poll submissions...');
    const { error: pollError } = await supabase
      .from('poll_submissions')
      .update({ lead_id: null })
      .eq('lead_id', leadId);

    if (pollError) {
      console.error('❌ [3/5] Erro ao atualizar poll_submissions:', pollError);
      throw new Error(`Erro ao atualizar poll_submissions: ${pollError.message}`);
    }
    console.log('✅ [3/5] Poll submissions desvinculadas');

    // 4. Deletar funnel_events relacionados ao lead
    console.log('🔄 [4/5] Deletando funnel events...');
    const { error: eventsError } = await supabase
      .from('funnel_events')
      .delete()
      .eq('lead_id', leadId);

    if (eventsError) {
      console.error('❌ [4/5] Erro ao deletar funnel_events:', eventsError);
      throw new Error(`Erro ao deletar funnel_events: ${eventsError.message}`);
    }
    console.log('✅ [4/5] Funnel events deletados');

    // 5. Finalmente, deletar o lead
    console.log('🔄 [5/5] Deletando o lead...');
    const { error: deleteError } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId);

    if (deleteError) {
      console.error('❌ [5/5] Erro ao deletar lead:', deleteError);
      throw new Error(`Erro ao deletar lead: ${deleteError.message}`);
    }

    console.log('✅ [5/5] Lead deletado com sucesso!');
    console.log('🎉 Exclusão completa via queries diretas!');

    return {
      success: true,
      message: 'Lead e dados relacionados deletados com sucesso',
      deletedEmail: normalizedEmail,
      method: 'direct',
    };
  } catch (error: any) {
    console.error('❌ ERRO FATAL ao deletar lead:', error.message);
    console.error('❌ Stack trace:', error);
    throw error;
  }
}

/**
 * Retorna o total de inscritos (alias para getNewsletterCount)
 */
export async function getSubscriberCount(): Promise<number> {
  return getNewsletterCount();
}