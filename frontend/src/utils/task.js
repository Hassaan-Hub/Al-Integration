export const STATUS_META = {
  pending: {
    label: 'Pending',
    badgeClass: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    dotClass: 'bg-amber-500',
  },
  'in-progress': {
    label: 'In Progress',
    badgeClass: 'bg-sky-50 text-sky-700 ring-sky-600/20',
    dotClass: 'bg-sky-500',
  },
  completed: {
    label: 'Completed',
    badgeClass: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    dotClass: 'bg-emerald-500',
  },
};

export const PRIORITY_META = {
  low: {
    label: 'Low',
    badgeClass: 'bg-slate-100 text-slate-700 ring-slate-500/20',
    dotClass: 'bg-slate-400',
  },
  medium: {
    label: 'Medium',
    badgeClass: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    dotClass: 'bg-amber-500',
  },
  high: {
    label: 'High',
    badgeClass: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    dotClass: 'bg-rose-500',
  },
};

export const getStatusMeta = (status) => STATUS_META[status] ?? STATUS_META.pending;

export const getPriorityMeta = (priority) => PRIORITY_META[priority] ?? PRIORITY_META.medium;

/**
 * Counts tasks per status using the real task list returned by the backend.
 */
export const summarizeTasks = (tasks = []) => {
  const summary = { total: tasks.length, pending: 0, 'in-progress': 0, completed: 0 };

  for (const task of tasks) {
    if (task?.status in summary) {
      summary[task.status] += 1;
    }
  }

  return summary;
};

/**
 * Client-side search across the fields the backend already returns.
 */
export const filterTasks = (tasks = [], { search = '', status = 'all' } = {}) => {
  const query = search.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesStatus = status === 'all' || task.status === status;

    if (!query) {
      return matchesStatus;
    }

    const haystack = `${task.title ?? ''} ${task.description ?? ''}`.toLowerCase();
    return matchesStatus && haystack.includes(query);
  });
};
