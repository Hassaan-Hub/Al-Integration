import { useCallback, useMemo, useState } from 'react';
import { TaskFormContext } from '../../context/task-form-context';
import { useTasks } from '../../context/tasks-context';
import { useToast } from '../../context/toast-context';
import { Modal } from '../ui/Modal';
import { TaskForm } from '../tasks/TaskForm';
import { toDateInputValue } from '../../utils/date';

const CLOSED_STATE = { open: false, mode: 'create', task: null };

export const TaskFormProvider = ({ children }) => {
  const { createTask, updateTask } = useTasks();
  const { success, error: notifyError } = useToast();

  const [state, setState] = useState(CLOSED_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const openCreateForm = useCallback(() => {
    setServerError(null);
    setState({ open: true, mode: 'create', task: null });
  }, []);

  const openEditForm = useCallback((task) => {
    setServerError(null);
    setState({ open: true, mode: 'edit', task });
  }, []);

  const closeForm = useCallback(() => {
    if (submitting) {
      return;
    }

    setServerError(null);
    setState(CLOSED_STATE);
  }, [submitting]);

  const handleSubmit = useCallback(
    async (values) => {
      if (submitting) {
        return;
      }

      setSubmitting(true);
      setServerError(null);

      try {
        if (state.mode === 'edit' && state.task) {
          const result = await updateTask(state.task.id, values);

          if (!result.ok) {
            setServerError(result.error);
            notifyError(result.error);
            return;
          }

          success('Task updated successfully.');
        } else {
          const result = await createTask(values);

          if (!result.ok) {
            setServerError(result.error);
            notifyError(result.error);
            return;
          }

          success('Task created successfully.');
        }

        setState(CLOSED_STATE);
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, state, updateTask, createTask, success, notifyError],
  );

  const value = useMemo(
    () => ({ openCreateForm, openEditForm, closeForm, isOpen: state.open }),
    [openCreateForm, openEditForm, closeForm, state.open],
  );

  const initialValues = state.task
    ? {
        title: state.task.title,
        description: state.task.description,
        status: state.task.status,
        dueDate: toDateInputValue(state.task.dueDate),
      }
    : undefined;

  return (
    <TaskFormContext.Provider value={value}>
      {children}

      <Modal
        open={state.open}
        onClose={closeForm}
        title={state.mode === 'edit' ? 'Edit task' : 'Create task'}
        description={
          state.mode === 'edit'
            ? 'Update the details of this task and save your changes.'
            : 'Add a new task to your task manager.'
        }
        closeOnBackdrop={!submitting}
      >
        {state.open && (
          <TaskForm
            key={state.mode === 'edit' ? state.task?.id : 'new-task'}
            mode={state.mode}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            submitting={submitting}
            serverError={serverError}
          />
        )}
      </Modal>
    </TaskFormContext.Provider>
  );
};
