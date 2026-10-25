import { useEffect, useId, useRef, useState, type SyntheticEvent } from 'react';
import { SITE } from '../../data/site';
import {
  ConsentField,
  ErrorFallback,
  Honeypot,
  NEWSLETTER_ENDPOINT,
  PrivacyLink,
  SuccessMessage,
  postJson,
  validateConsent,
  validateEmail,
  type SubmitOutcome,
} from './forms/shared';

/** Inscrição na newsletter: e-mail + consentimento. A confirmação (double opt-in) é por e-mail. */
export default function NewsletterForm() {
  const uid = useId();
  const emailId = `news-email-${uid}`;
  const emailErrorId = `${emailId}-erro`;
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<Exclude<SubmitOutcome['kind'], 'success'> | null>(null);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  async function onSubmit(event: SyntheticEvent) {
    event.preventDefault();
    if (sending) return;
    setFailure(null);
    const found = { email: validateEmail(email) ?? undefined, consent: validateConsent(consent) ?? undefined };
    setErrors(found);
    if (found.email) {
      formRef.current?.querySelector<HTMLElement>('input[name="email"]')?.focus();
      return;
    }
    if (found.consent) {
      formRef.current?.querySelector<HTMLElement>('input[name="consent"]')?.focus();
      return;
    }
    setSending(true);
    const outcome = await postJson(NEWSLETTER_ENDPOINT, {
      email: email.trim(),
      consentAccepted: true,
      consentVersion: SITE.consentVersion,
      source: SITE.formSource,
      website,
    });
    setSending(false);
    if (outcome.kind === 'success') setDone(true);
    else setFailure(outcome.kind);
  }

  if (done) {
    return (
      <div ref={doneRef} tabIndex={-1} className="text-left outline-none">
        <SuccessMessage title="Enviamos um e-mail para confirmar sua inscrição.">
          <p>Abra a mensagem e toque no botão de confirmação. Se não encontrar, olhe a caixa de spam.</p>
        </SuccessMessage>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate data-testid="newsletter-form" className="text-left">
      <div className="field">
        <label htmlFor={emailId} className="sr-only">
          Seu e-mail
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Seu melhor e-mail"
            className="input flex-1"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((current) => ({ ...current, email: undefined }));
            }}
            aria-required="true"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? emailErrorId : undefined}
          />
          <button type="submit" className="btn btn-yellow whitespace-nowrap" disabled={sending}>
            {sending ? 'Enviando...' : 'Quero receber'}
          </button>
        </div>
        {errors.email ? (
          <p id={emailErrorId} className="field-error">
            {errors.email}
          </p>
        ) : null}
      </div>

      <Honeypot value={website} onChange={setWebsite} />

      <div className="mt-3">
        <ConsentField
          checked={consent}
          onChange={(value) => {
            setConsent(value);
            setErrors((current) => ({ ...current, consent: undefined }));
          }}
          error={errors.consent}
          text={
            <span className="newsletter-consent">
              Aceito receber as novidades da Via Fluvial por e-mail e concordo com a <PrivacyLink />. Posso cancelar quando quiser.
            </span>
          }
        />
      </div>

      {failure ? (
        <div className="mt-4 text-left">
          <ErrorFallback outcome={failure} />
        </div>
      ) : null}
    </form>
  );
}
