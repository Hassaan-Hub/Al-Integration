import { useCallback, useMemo, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastContext } from '../../context/toast-context';

const AUTO_DISMISS_MS = 5000;

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const TONE_CLASSES = {
  success: 'text-emerald-600',
  error: 'text-rose-600',
  info: 'text-brand-600',
};

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));

    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const notify = useCallback(
    (message, { type = 'info', duration = AUTO_DISMISS_MS } = {}) => {
      toastId += 1;
      const id = toastId;

      setToasts((current) => [...current, { id, message, type }]);

      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      notify,
      dismiss,
      success: (message, options) => notify(message, { ...options, type: 'success' }),
      error: (message, options) => notify(message, { ...options, type: 'error' }),
      info: (message, options) => notify(message, { ...options, type: 'info' }),
    }),
    [notify, dismiss],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] ?? Info;

          return (
            <div
              key={toast.id}
              role="status"
              aria-live="polite"
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/5"
            >
              <Icon className={`mt-0.5 size-5 shrink-0 ${TONE_CLASSES[toast.type]}`} aria-hidden="true" />
              <p className="flex-1 text-sm leading-6 text-slate-700">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                aria-label="Dismiss notification"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
