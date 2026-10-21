import { useState } from 'react';
import { Button } from '../ui/Button';
import { TASK_STATUSES } from '../../services/task.service';

const EMPTY_VALUES = {
  title: '',
  description: '',
  status: 'pending',
  dueDate: '',
};

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const FIELD_CLASSES =
  'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:bg-slate-50 disabled:text-slate-500';

const ERROR_FIELD_CLASSES = 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30';

export const TaskForm = ({
  initialValues,
  mode = 'create',
  onSubmit,
  onCancel,
  submitting = false,
  serverError = null,
}) => {
  const [values, setValues] = useState(() => ({
    ...EMPTY_VALUES,
    ...initialValues,
    description: initialValues?.description ?? '',
    dueDate: initialValues?.dueDate ?? '',
  }));
  const [errors, setErrors] = useState({});

  const isEdit = mode === 'edit';

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const validate = () => {
    const nextErrors = {};

    if (typeof values.title !== 'string' || values.title.trim().length === 0) {
      nextErrors.title = 'Title is required and cannot be empty.';
    }

    if (values.status && !TASK_STATUSES.includes(values.status)) {
      nextErrors.status = 'Select a valid status.';
    }

    if (values.dueDate && Number.isNaN(Date.parse(values.dueDate))) {
      nextErrors.dueDate = 'Enter a valid date.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (submitting || !validate()) {
      return;
    }

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      dueDate: values.dueDate || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {serverError && (
        <div
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
          role="alert"
        >
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="task-title" className="block text-sm font-medium text-slate-700">
          Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="task-title"
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          disabled={submitting}
          placeholder="e.g. Prepare project demonstration"
          aria-required="true"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'task-title-error' : undefined}
          className={`mt-1.5 ${FIELD_CLASSES} ${errors.title ? ERROR_FIELD_CLASSES : ''}`}
        />
        {errors.title && (
          <p id="task-title-error" className="mt-1.5 text-xs font-medium text-rose-600">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="task-description" className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="task-description"
          name="description"
          rows={4}
          value={values.description}
          onChange={handleChange}
          disabled={submitting}
          placeholder="Add more context about this task (optional)"
          className={`mt-1.5 resize-y ${FIELD_CLASSES}`}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="task-status" className="block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            id="task-status"
            name="status"
            value={values.status}
            onChange={handleChange}
            disabled={submitting}
            aria-invalid={Boolean(errors.status)}
            className={`mt-1.5 ${FIELD_CLASSES} ${errors.status ? ERROR_FIELD_CLASSES : ''}`}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.status}</p>
          )}
        </div>

        <div>
          <label htmlFor="task-due-date" className="block text-sm font-medium text-slate-700">
            Due date
          </label>
          <input
            id="task-due-date"
            name="dueDate"
            type="date"
            value={values.dueDate}
            onChange={handleChange}
            disabled={submitting}
            aria-invalid={Boolean(errors.dueDate)}
            aria-describedby={errors.dueDate ? 'task-due-date-error' : undefined}
            className={`mt-1.5 ${FIELD_CLASSES} ${errors.dueDate ? ERROR_FIELD_CLASSES : ''}`}
          />
          {errors.dueDate && (
            <p id="task-due-date-error" className="mt-1.5 text-xs font-medium text-rose-600">
              {errors.dueDate}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {isEdit ? 'Save changes' : 'Create task'}
        </Button>
      </div>
    </form>
  );
};
