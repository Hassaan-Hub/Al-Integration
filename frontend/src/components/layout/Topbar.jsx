import { Menu, Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { findNavItem } from '../../config/navigation';
import { Button } from '../ui/Button';
import { useTaskForm } from '../../context/task-form-context';

export const Topbar = ({ onOpenMenu }) => {
  const location = useLocation();
  const navItem = findNavItem(location.pathname);
  const { openCreateForm } = useTaskForm();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">{navItem.title}</h1>
          <p className="hidden truncate text-xs text-slate-500 sm:block">{navItem.subtitle}</p>
        </div>

        <Button onClick={openCreateForm} className="shrink-0">
          <Plus className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">New task</span>
          <span className="sr-only sm:hidden">Create a new task</span>
        </Button>
      </div>
    </header>
  );
};
