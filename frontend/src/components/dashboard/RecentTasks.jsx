import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';
import { formatRelativeTime } from '../../utils/date';

const ACTIVITY_TYPES = [
  { key: 'create', label: 'New task', className: 'bg-emerald-50 text-emerald-700' },
  { key: 'update', label: 'Updated', className: 'bg-sky-50 text-sky-700' },
];

const getActivityType = (task) => {
  if (!task.updatedAt || !task.createdAt) {
    return 'create';
  }

  const createdAt = new Date(task.createdAt).getTime();
  const updatedAt = new Date(task.updatedAt).getTime();
  return updatedAt - createdAt > 1000 ? 'update' : 'create';
};

export const RecentTasks = ({ tasks, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
            <Skeleton className="size-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
        <Sparkles className="mx-auto size-6 text-slate-400" aria-hidden="true" />
        <p className="mt-3 text-sm font-medium text-slate-700">No activity yet</p>
        <p className="mt-1 text-sm text-slate-500">Create your first task to see it listed here.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => {
        const activityType = getActivityType(task);
        const meta = ACTIVITY_TYPES.find((item) => item.key === activityType) ?? ACTIVITY_TYPES[0];

        return (
          <li
            key={task.id}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-slate-900">{task.title}</p>
                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.className}`}>
                  {meta.label}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {activityType === 'update' ? 'Last updated' : 'Created'}{' '}
                {formatRelativeTime(activityType === 'update' ? task.updatedAt : task.createdAt)}
              </p>
            </div>

            <div className="shrink-0">
              <StatusBadge status={task.status} />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export const ViewAllLink = () => (
  <Link
    to="/tasks"
    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
  >
    View all tasks
    <ArrowRight className="size-4" aria-hidden="true" />
  </Link>
);

export const EmptyTasksButton = ({ onClick }) => (
  <Button onClick={onClick}>
    Create your first task
  </Button>
);
