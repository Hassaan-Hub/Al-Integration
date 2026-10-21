import { Search, SlidersHorizontal } from 'lucide-react';
import { STATUS_META } from '../../utils/task';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: STATUS_META.pending.label },
  { value: 'in-progress', label: STATUS_META['in-progress'].label },
  { value: 'completed', label: STATUS_META.completed.label },
];

export const TaskFilters = ({ search, onSearchChange, status, onStatusChange, counts = {} }) => (
  <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="relative flex-1">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
        aria-hidden="true"
      />
      <label htmlFor="task-search" className="sr-only">
        Search tasks
      </label>
      <input
        id="task-search"
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by title or description"
        className="block w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />
    </div>

    <div className="flex items-center gap-2 overflow-x-auto">
      <SlidersHorizontal className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
      <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1" role="group" aria-label="Filter by status">
        {FILTERS.map((filter) => {
          const isActive = status === filter.value;
          const count = counts[filter.value];

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onStatusChange(filter.value)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter.label}
              {typeof count === 'number' && (
                <span className="rounded bg-slate-200/80 px-1.5 text-xs font-semibold text-slate-700">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);
