import { api, ApiError } from './api';

const PRIORITIES = ['low', 'medium', 'high'];

/**
 * Normalises the plan returned by `POST /api/ai/plan-task`.
 * The backend shape is `{ success: true, plan: { summary, priority, estimatedHours, steps } }`.
 */
const normalizePlan = (rawPlan) => {
  if (!rawPlan || typeof rawPlan !== 'object' || Array.isArray(rawPlan)) {
    return null;
  }

  const summary = typeof rawPlan.summary === 'string' ? rawPlan.summary.trim() : '';
  if (summary.length === 0) {
    return null;
  }

  const steps = Array.isArray(rawPlan.steps)
    ? rawPlan.steps.map((step) => (typeof step === 'string' ? step.trim() : '')).filter(Boolean)
    : [];

  return {
    summary,
    priority: PRIORITIES.includes(rawPlan.priority) ? rawPlan.priority : 'medium',
    estimatedHours:
      typeof rawPlan.estimatedHours === 'number' && Number.isFinite(rawPlan.estimatedHours)
        ? rawPlan.estimatedHours
        : null,
    steps,
  };
};

/**
 * Requests an AI-generated task plan from the backend.
 * The backend proxies Groq, so the API key never reaches the browser.
 */
export const generateTaskPlan = async (description) => {
  const response = await api.post(
    '/api/ai/plan-task',
    { description: String(description).trim() },
    { timeout: 60000 },
  );
  const plan = normalizePlan(response.data?.plan);

  if (!plan) {
    throw new ApiError('The AI returned a plan that could not be read.', { status: response.status });
  }

  return plan;
};

export { PRIORITIES };
