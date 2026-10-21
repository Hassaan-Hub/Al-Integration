import { CalendarDays, Clock3, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { formatDate, formatRelativeTime, isOverdue } from '../../utils/date';

export const TaskCard = ({ task, onEdit, onDelete, busy = false }) => {
  const overdue = task.status !== 'completed' && isOverdue(task.dueDate);

  return (
    <article className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-900">{task.title}</h3>

          {task.description ? (
            <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-500">{task.description}</p>
          ) : (
            <p className="mt-1.5 text-sm italic leading-6 text-slate-400">No description provided</p>
          )}
        </div>

        <div className="shrink-0">
          <StatusBadge status={task.status} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
        {task.dueDate && (
          <span className={`inline-flex items-center gap-1.5 ${overdue ? 'font-medium text-rose-600' : ''}`}>
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <span>Due {formatDate(task.dueDate)}</span>
            {overdue && (
              <span className="inline-flex items-center gap-1">
                <AlertTriangle className="size-3.5" aria-hidden="true" />
                Overdue
              </span>
            )}
          </span>
        )}

        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="size-3.5" aria-hidden="true" />
          <span>Created {formatRelativeTime(task.createdAt)}</span>
        </span>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
        <Button variant="ghost" size="sm" onClick={() => onEdit(task)} disabled={busy}>
          <Pencil className="size-4" aria-hidden="true" />
          Edit
        </Button>
        <Button variant="danger-ghost" size="sm" onClick={() => onDelete(task)} disabled={busy}>
          <Trash2 className="size-4" aria-hidden="true" />
          Delete
        </Button>
      </div>
    </article>
  );
};
