import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const DemoForm = lazy(() => import('./DemoForm'));

/**
 * "Agendar demonstração" também abre como janela: todo link com data-demo-open (que continua levando a
 * /demonstracao sem JavaScript) abre este diálogo. O formulário só é baixado no primeiro clique.
 * Usa o <dialog> nativo: foco preso, Esc fecha e o fundo fica inerte.
 */
export default function DemoModal() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const trigger = (event.target as Element | null)?.closest<HTMLElement>('[data-demo-open]');
      if (!trigger) return;
      // Já está na página da demonstração: o formulário está ali mesmo.
      if (window.location.pathname.replace(/\/$/, '') === '/demonstracao') return;
      event.preventDefault();
      returnFocusRef.current = trigger;
      setOpen(true);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    }
    if (!open && dialog.open) dialog.close();
    if (!open) document.documentElement.style.overflow = '';
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    document.documentElement.style.overflow = '';
    returnFocusRef.current?.focus?.();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      aria-labelledby="vf-demo-modal-title"
      className="m-auto max-h-[92dvh] w-[min(94vw,40rem)] overflow-y-auto rounded-2xl bg-white p-0 text-ink shadow-2xl backdrop:bg-black/60"
    >
      {open ? (
        <div className="p-5 sm:p-8">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 id="vf-demo-modal-title" className="text-2xl font-extrabold text-green-800">
                Agendar uma demonstração
              </h2>
              <p className="mt-1 text-muted">Conte um pouco sobre a sua operação e a gente entra em contato.</p>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-lg text-green-800 hover:bg-green-50"
              aria-label="Fechar janela"
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>
          <Suspense fallback={<p className="py-8 text-center text-muted">Carregando formulário...</p>}>
            <DemoForm />
          </Suspense>
        </div>
      ) : null}
    </dialog>
  );
}
