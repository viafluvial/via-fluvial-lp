import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { SITE } from '../../../data/site';
import {
  CONTACT_ENDPOINT,
  ConsentField,
  ErrorFallback,
  Field,
  Honeypot,
  PrivacyLink,
  SuccessMessage,
  postJson,
  validateConsent,
  validateEmail,
  validateName,
  validatePhone,
  type SubmitOutcome,
} from './shared';

export type RequestKind = 'DEMO' | 'CONTACT';

const PARTNER_TYPES = [
  { value: 'AGENCIA', label: 'Agência' },
  { value: 'TRANSPORTADORA', label: 'Transportadora' },
  { value: 'BARQUEIRO', label: 'Barqueiro ou operador de embarcação' },
  { value: 'EMPRESA', label: 'Empresa' },
  { value: 'OUTRO', label: 'Outro' },
] as const;

const SUBJECTS = [
  { value: 'PARCERIA', label: 'Parceria' },
  { value: 'IMPRENSA', label: 'Imprensa' },
  { value: 'INVESTIDORES', label: 'Investidores' },
  { value: 'PODER_PUBLICO', label: 'Poder público' },
  { value: 'OUTRO', label: 'Outro assunto' },
] as const;

const PERIODS = ['Manhã', 'Tarde', 'Noite', 'Qualquer horário'] as const;

interface Props {
  kind: RequestKind;
  /** Assunto inicial (contato), por exemplo vindo de ?assunto=INVESTIDORES. */
  initialSubject?: string;
  onSuccess?: () => void;
}

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'partnerType' | 'subject' | 'message' | 'consent', string>>;

export default function ContactRequestForm({ kind, initialSubject, onSuccess }: Props) {
  const isDemo = kind === 'DEMO';
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    partnerType: '',
    city: '',
    preferredPeriod: '',
    subject: '',
    message: '',
    website: '',
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<Exclude<SubmitOutcome['kind'], 'success'> | null>(null);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  // Assunto vindo do endereço (?assunto=INVESTIDORES) ou do bloco que levou a pessoa até aqui.
  useEffect(() => {
    if (isDemo) return;
    const fromUrl = new URLSearchParams(window.location.search).get('assunto')?.toUpperCase();
    const wanted = initialSubject ?? fromUrl;
    if (wanted && SUBJECTS.some((item) => item.value === wanted)) {
      setValues((current) => ({ ...current, subject: wanted }));
    }
  }, [isDemo, initialSubject]);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const set = (key: keyof typeof values) => (event: { target: { value: string } }) => {
    const value = event.target.value;
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  function validate(): Errors {
    const next: Errors = {};
    const nameError = validateName(values.name);
    if (nameError) next.name = nameError;
    const emailError = validateEmail(values.email);
    if (emailError) next.email = emailError;
    const phoneError = validatePhone(values.phone);
    if (phoneError) next.phone = phoneError;
    if (isDemo && !values.partnerType) next.partnerType = 'Escolha o tipo de operação.';
    if (!isDemo && !values.subject) next.subject = 'Escolha o assunto.';
    if (!isDemo && values.message.trim().length < 10) next.message = 'Escreva uma mensagem com pelo menos 10 letras.';
    if (values.message.length > 2000) next.message = 'A mensagem pode ter até 2000 caracteres.';
    const consentError = validateConsent(consent);
    if (consentError) next.consent = consentError;
    return next;
  }

  async function onSubmit(event: SyntheticEvent) {
    event.preventDefault();
    if (sending) return;
    setFailure(null);
    const found = validate();
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      const target =
        firstInvalid === 'consent'
          ? formRef.current?.querySelector<HTMLElement>('input[name="consent"]')
          : formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`);
      target?.focus();
      return;
    }

    const trim = (value: string) => value.trim() || undefined;
    const body = {
      type: kind,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: trim(values.phone),
      company: isDemo ? trim(values.company) : undefined,
      partnerType: isDemo ? values.partnerType : undefined,
      city: isDemo ? trim(values.city) : undefined,
      preferredPeriod: isDemo ? trim(values.preferredPeriod) : undefined,
      subject: isDemo ? undefined : values.subject,
      message: trim(values.message),
      consentAccepted: true,
      consentVersion: SITE.consentVersion,
      source: SITE.formSource,
      website: values.website,
    };

    setSending(true);
    const outcome = await postJson(CONTACT_ENDPOINT, body);
    setSending(false);
    if (outcome.kind === 'success') {
      setDone(true);
      onSuccess?.();
    } else {
      setFailure(outcome.kind);
    }
  }

  if (done) {
    return (
      <div ref={doneRef} tabIndex={-1} className="outline-none">
        <SuccessMessage title={isDemo ? 'Pedido de demonstração enviado!' : 'Mensagem enviada!'}>
          <p>
            Recebemos seus dados e vamos responder pelo e-mail informado, em até 1 dia útil. Se for urgente, chame no WhatsApp{' '}
            <a href={`https://wa.me/5592994593224`} className="font-semibold underline" target="_blank" rel="noopener">
              {SITE.whatsappDisplay}
            </a>
            .
          </p>
        </SuccessMessage>
      </div>
    );
  }

  const errorProps = (invalid: boolean, describedBy: string | undefined) => ({
    'aria-invalid': invalid || undefined,
    'aria-describedby': describedBy,
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-4" data-testid={isDemo ? 'demo-form' : 'contact-form'}>
      <p className="text-sm text-muted">
        Campos com <span aria-hidden="true" className="text-[#b42318]">*</span>
        <span className="sr-only">asterisco</span> são obrigatórios.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome" name="name" required error={errors.name}>
          {({ id, describedBy, invalid }) => (
            <input id={id} name="name" className="input" autoComplete="name" value={values.name} onChange={set('name')} aria-required="true" {...errorProps(invalid, describedBy)} />
          )}
        </Field>
        <Field label="E-mail" name="email" required error={errors.email}>
          {({ id, describedBy, invalid }) => (
            <input id={id} name="email" type="email" inputMode="email" className="input" autoComplete="email" value={values.email} onChange={set('email')} aria-required="true" {...errorProps(invalid, describedBy)} />
          )}
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Telefone ou WhatsApp" name="phone" error={errors.phone} hint="Com DDD.">
          {({ id, describedBy, invalid }) => (
            <input id={id} name="phone" type="tel" inputMode="tel" className="input" autoComplete="tel" value={values.phone} onChange={set('phone')} {...errorProps(invalid, describedBy)} />
          )}
        </Field>
        {isDemo ? (
          <Field label="Empresa" name="company">
            {({ id }) => <input id={id} name="company" className="input" autoComplete="organization" value={values.company} onChange={set('company')} />}
          </Field>
        ) : (
          <Field label="Assunto" name="subject" required error={errors.subject}>
            {({ id, describedBy, invalid }) => (
              <select id={id} name="subject" className="input" value={values.subject} onChange={set('subject')} aria-required="true" {...errorProps(invalid, describedBy)}>
                <option value="">Escolha o assunto</option>
                {SUBJECTS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            )}
          </Field>
        )}
      </div>

      {isDemo ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo de operação" name="partnerType" required error={errors.partnerType}>
              {({ id, describedBy, invalid }) => (
                <select id={id} name="partnerType" className="input" value={values.partnerType} onChange={set('partnerType')} aria-required="true" {...errorProps(invalid, describedBy)}>
                  <option value="">Escolha uma opção</option>
                  {PARTNER_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Field label="Cidade e região" name="city">
              {({ id }) => <input id={id} name="city" className="input" autoComplete="address-level2" value={values.city} onChange={set('city')} placeholder="Ex.: Manaus, AM" />}
            </Field>
          </div>
          <Field label="Melhor período para falar com você" name="preferredPeriod">
            {({ id }) => (
              <select id={id} name="preferredPeriod" className="input" value={values.preferredPeriod} onChange={set('preferredPeriod')}>
                <option value="">Sem preferência</option>
                {PERIODS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </>
      ) : null}

      <Field label="Mensagem" name="message" required={!isDemo} error={errors.message}>
        {({ id, describedBy, invalid }) => (
          <textarea id={id} name="message" rows={4} maxLength={2100} className="input" value={values.message} onChange={set('message')} aria-required={!isDemo || undefined} {...errorProps(invalid, describedBy)} />
        )}
      </Field>

      <Honeypot value={values.website} onChange={(website) => setValues((current) => ({ ...current, website }))} />

      <ConsentField
        checked={consent}
        onChange={(value) => {
          setConsent(value);
          setErrors((current) => ({ ...current, consent: undefined }));
        }}
        error={errors.consent}
        text={
          <>
            Li e aceito a <PrivacyLink /> e autorizo a Via Fluvial a usar meus dados para responder a este pedido.
          </>
        }
      />

      {failure ? <ErrorFallback outcome={failure} /> : null}

      <button type="submit" className="btn btn-yellow btn-lg w-full sm:w-auto" disabled={sending} aria-disabled={sending}>
        {sending ? 'Enviando...' : isDemo ? 'Agendar demonstração' : 'Enviar mensagem'}
      </button>
      <p className="sr-only" role="status" aria-live="polite">
        {sending ? 'Enviando seus dados.' : ''}
      </p>
    </form>
  );
}
