import { useCallback, useEffect, useMemo, useState } from 'react';
import { TasksContext } from '../../context/tasks-context';
import {
  createTask as createTaskRequest,
  listTasks,
  deleteTask as deleteTaskRequest,
  updateTask as updateTaskRequest,
} from '../../services/task.service';
import { summarizeTasks } from '../../utils/task';

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(({ silent = false } = {}) =>
    listTasks()
      .then(({ tasks: fetchedTasks }) => {
        setTasks(fetchedTasks);
        setError(null);
        return { ok: true };
      })
      .catch((requestError) => {
        setError(requestError.message);
        return { ok: false, error: requestError.message };
      })
      .finally(() => {
        if (!silent) {
          setIsLoading(false);
        }
      }), []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = useCallback(async (values) => {
    try {
      const task = await createTaskRequest(values);
      setTasks((current) => [task, ...current]);
      return { ok: true, task };
    } catch (requestError) {
      return { ok: false, error: requestError.message };
    }
  }, []);

  const updateTask = useCallback(async (id, values) => {
    try {
      const task = await updateTaskRequest(id, values);
      setTasks((current) => current.map((item) => (item.id === id ? task : item)));
      return { ok: true, task };
    } catch (requestError) {
      return { ok: false, error: requestError.message };
    }
  }, []);

  const removeTask = useCallback(async (id) => {
    try {
      await deleteTaskRequest(id);
      setTasks((current) => current.filter((item) => item.id !== id));
      return { ok: true };
    } catch (requestError) {
      return { ok: false, error: requestError.message };
    }
  }, []);

  const summary = useMemo(() => summarizeTasks(tasks), [tasks]);

  const value = useMemo(
    () => ({
      tasks,
      summary,
      isLoading,
      error,
      refresh: loadTasks,
      createTask,
      updateTask,
      removeTask,
    }),
    [tasks, summary, isLoading, error, loadTasks, createTask, updateTask, removeTask],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};
