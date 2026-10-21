import { ClipboardList, Clock3, Loader2, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';

const CARDS = [
  {
    key: 'total',
    label: 'Total tasks',
    icon: ClipboardList,
    iconClass: 'bg-brand-50 text-brand-600',
    valueClass: 'text-slate-900',
  },
  {
    key: 'pending',
    label: 'Pending',
    icon: Clock3,
    iconClass: 'bg-amber-50 text-amber-600',
    valueClass: 'text-amber-600',
  },
  {
    key: 'in-progress',
    label: 'In progress',
    icon: Loader2,
    iconClass: 'bg-sky-50 text-sky-600',
    valueClass: 'text-sky-600',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
    iconClass: 'bg-emerald-50 text-emerald-600',
    valueClass: 'text-emerald-600',
  },
];

export const SummaryCards = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map((card) => (
          <div key={card.key} className="rounded-xl border border-slate-200 bg-white p-5">
            <Skeleton className="size-10 rounded-lg" />
            <Skeleton className="mt-4 h-7 w-16" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map((card) => {
        const Icon = card.icon;

        return (
          <div key={card.key} className="rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-sm">
            <div className="flex items-start justify-between">
              <span className={`inline-flex size-10 items-center justify-center rounded-lg ${card.iconClass}`}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>

            <p className={`mt-4 text-2xl font-semibold tabular-nums ${card.valueClass}`}>
              {summary[card.key] ?? 0}
            </p>
            <p className="mt-1 text-sm text-slate-500">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
};
