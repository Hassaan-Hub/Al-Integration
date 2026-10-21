import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ListTodo, Plus, RefreshCw, Sparkles } from 'lucide-react';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { RecentTasks, ViewAllLink } from '../components/dashboard/RecentTasks';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { useTasks } from '../context/tasks-context';
import { useTaskForm } from '../context/task-form-context';

const getActivityTimestamp = (task) => {
  const createdAt = task?.createdAt ? new Date(task.createdAt).getTime() : 0;
  const updatedAt = task?.updatedAt ? new Date(task.updatedAt).getTime() : 0;
  return Math.max(createdAt, updatedAt);
};

export const DashboardPage = () => {
  const { tasks, summary, isLoading, error, refresh } = useTasks();
  const { openCreateForm } = useTaskForm();

  const recentTasks = useMemo(
    () => [...tasks].sort((a, b) => getActivityTimestamp(b) - getActivityTimestamp(a)).slice(0, 5),
    [tasks],
  );

  const handleRefresh = () => {
    refresh({ silent: true });
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
          <p className="mt-1 text-sm text-slate-500">
            Live counts calculated from the tasks stored in your backend.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleRefresh} disabled={isLoading} aria-label="Refresh dashboard data">
            <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
            Refresh
          </Button>
          <Button onClick={openCreateForm}>
            <Plus className="size-4" aria-hidden="true" />
            New task
          </Button>
        </div>
      </section>

      {error && (
        <Alert
          title="Could not load tasks"
          action={
            <Button variant="secondary" size="sm" onClick={handleRefresh}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <SummaryCards summary={summary} isLoading={isLoading} />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ListTodo className="size-4 text-slate-400" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
            </div>
            <ViewAllLink />
          </div>

          <RecentTasks tasks={recentTasks} isLoading={isLoading} />
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-5">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">Plan with AI</h3>
            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              Describe a goal and the assistant returns a structured plan with priority, effort estimate and
              actionable steps.
            </p>
            <Link
              to="/ai-planner"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 transition hover:text-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              Open AI Task Planner
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900">Quick actions</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="flex items-center justify-between gap-3">
                <span>Create a task manually</span>
                <Button variant="ghost" size="sm" onClick={openCreateForm}>
                  Create
                </Button>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span>Review all tasks</span>
                <Link
                  to="/tasks"
                  className="text-sm font-medium text-brand-600 transition hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  Open
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};
