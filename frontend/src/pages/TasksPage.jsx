import { useMemo, useState } from 'react';
import { ListTodo, Plus, RefreshCw, SearchX } from 'lucide-react';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/EmptyState';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { TaskCardSkeleton } from '../components/ui/Skeleton';
import { useTasks } from '../context/tasks-context';
import { useTaskForm } from '../context/task-form-context';
import { useToast } from '../context/toast-context';
import { filterTasks } from '../utils/task';

export const TasksPage = () => {
  const { tasks, summary, isLoading, error, refresh, removeTask } = useTasks();
  const { openCreateForm, openEditForm } = useTaskForm();
  const { success, error: notifyError } = useToast();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [pendingDeletion, setPendingDeletion] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const visibleTasks = useMemo(() => filterTasks(tasks, { search, status }), [tasks, search, status]);

  const filterCounts = useMemo(
    () => ({
      all: tasks.length,
      pending: summary.pending,
      'in-progress': summary['in-progress'],
      completed: summary.completed,
    }),
    [tasks.length, summary],
  );

  const handleRefresh = () => {
    refresh({ silent: true });
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeletion || isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await removeTask(pendingDeletion.id);

      if (!result.ok) {
        notifyError(result.error);
        return;
      }

      success('Task deleted successfully.');
      setPendingDeletion(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters = search.trim().length > 0 || status !== 'all';

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">All tasks</h2>
          <p className="mt-1 text-sm text-slate-500">
            {isLoading ? 'Loading tasks…' : `${visibleTasks.length} of ${tasks.length} tasks shown`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleRefresh} disabled={isLoading} aria-label="Refresh tasks">
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

      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        counts={filterCounts}
      />

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3].map((index) => (
            <TaskCardSkeleton key={index} />
          ))}
        </div>
      ) : visibleTasks.length === 0 ? (
        tasks.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title="No tasks yet"
            description="Create your first task to start tracking work, or use the AI Task Planner to break a goal into actionable steps."
            action={<Button onClick={openCreateForm}>Create a task</Button>}
          />
        ) : (
          <EmptyState
            icon={SearchX}
            title="No tasks match your filters"
            description="Try a different search term or reset the status filter to see all tasks."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch('');
                  setStatus('all');
                }}
              >
                Clear filters
              </Button>
            }
          />
        )
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEditForm}
              onDelete={setPendingDeletion}
              busy={isDeleting && pendingDeletion?.id === task.id}
            />
          ))}
        </div>
      )}

      {hasActiveFilters && !isLoading && tasks.length > 0 && (
        <p className="text-center text-xs text-slate-500">
          Filters are applied locally on the tasks already loaded from the server.
        </p>
      )}

      <ConfirmDialog
        open={Boolean(pendingDeletion)}
        title="Delete task"
        description={pendingDeletion ? `"${pendingDeletion.title}" will be removed from the server.` : undefined}
        confirmLabel="Delete task"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          if (!isDeleting) {
            setPendingDeletion(null);
          }
        }}
      />
    </div>
  );
};
