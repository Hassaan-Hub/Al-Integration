import { api, ApiError } from './api';

const TASK_STATUSES = ['pending', 'in-progress', 'completed'];

const isValidDateInput = (value) => {
  if (value === null || value === undefined || value === '') {
    return true;
  }

  return !Number.isNaN(Date.parse(value));
};

/**
 * Maps a raw task document coming from the backend into the shape the UI expects.
 * The backend returns Mongo documents with `_id`, `title`, `description`,
 * `status`, `dueDate`, `createdAt` and `updatedAt`.
 */
const normalizeTask = (task) => {
  if (!task || typeof task !== 'object') {
    return null;
  }

  const id = task._id ?? task.id ?? null;
  if (!id) {
    return null;
  }

  return {
    id: String(id),
    title: typeof task.title === 'string' ? task.title : '',
    description: typeof task.description === 'string' ? task.description : '',
    status: TASK_STATUSES.includes(task.status) ? task.status : 'pending',
    dueDate: isValidDateInput(task.dueDate) && task.dueDate ? task.dueDate : null,
    createdAt: task.createdAt ?? null,
    updatedAt: task.updatedAt ?? null,
  };
};

/**
 * Builds the request body for create/update using only fields the backend supports.
 * An empty due date is sent as `null` so the backend clears the field instead of
 * rejecting the request.
 */
export const buildTaskPayload = (values = {}) => {
  const payload = {};

  if (values.title !== undefined) {
    payload.title = String(values.title).trim();
  }

  if (values.description !== undefined) {
    payload.description = String(values.description ?? '').trim();
  }

  if (values.status !== undefined && values.status !== '') {
    payload.status = values.status;
  }

  if (values.dueDate !== undefined) {
    payload.dueDate = values.dueDate === '' || values.dueDate === null ? null : values.dueDate;
  }

  return payload;
};

export const listTasks = async () => {
  const response = await api.get('/api/tasks');
  const payload = response.data;

  if (!payload || typeof payload !== 'object') {
    throw new ApiError('The task list response was empty or malformed.', {
      status: response.status,
    });
  }

  const rawTasks = Array.isArray(payload.data) ? payload.data : [];
  const tasks = rawTasks.map(normalizeTask).filter(Boolean);

  return {
    tasks,
    count: typeof payload.count === 'number' ? payload.count : tasks.length,
  };
};

export const getTaskById = async (id) => {
  const response = await api.get(`/api/tasks/${id}`);
  const task = normalizeTask(response.data?.data);

  if (!task) {
    throw new ApiError('The task response was empty or malformed.', { status: response.status });
  }

  return task;
};

export const createTask = async (values) => {
  const payload = buildTaskPayload(values);
  const response = await api.post('/api/tasks', payload);
  const task = normalizeTask(response.data?.data);

  if (!task) {
    throw new ApiError('The task was created but the response could not be read.', {
      status: response.status,
    });
  }

  return task;
};

export const updateTask = async (id, values) => {
  const payload = buildTaskPayload(values);

  if (Object.keys(payload).length === 0) {
    throw new ApiError('At least one task field must be provided.', { status: 400 });
  }

  const response = await api.put(`/api/tasks/${id}`, payload);
  const task = normalizeTask(response.data?.data);

  if (!task) {
    throw new ApiError('The task was updated but the response could not be read.', {
      status: response.status,
    });
  }

  return task;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/api/tasks/${id}`);
  return response.data?.message ?? 'Task deleted successfully';
};

export const checkHealth = async () => {
  const response = await api.get('/health-check');
  return response.data;
};

export { TASK_STATUSES };
