import { AlertCircle, AlertTriangle } from 'lucide-react';

export const Alert = ({ title, children, variant = 'error', action, className = '' }) => {
  const isError = variant === 'error';

  const Icon = isError ? AlertCircle : AlertTriangle;
  const toneClass = isError
    ? 'border-rose-200 bg-rose-50 text-rose-900'
    : 'border-amber-200 bg-amber-50 text-amber-900';
  const iconClass = isError ? 'text-rose-600' : 'text-amber-600';

  return (
    <div className={`rounded-xl border p-4 ${toneClass} ${className}`} role="alert">
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 size-5 shrink-0 ${iconClass}`} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          {title && <p className="text-sm font-semibold">{title}</p>}
          {children && <div className="mt-1 text-sm leading-6 opacity-90">{children}</div>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
};
