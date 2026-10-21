import { useState } from 'react';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { PlanResult } from '../components/ai/PlanResult';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { generateTaskPlan } from '../services/ai.service';

const MAX_DESCRIPTION_LENGTH = 2000;

const EXAMPLES = [
  'I need to build a portfolio website within three days.',
  'Prepare a weekly project status report for the team.',
  'Organise an onboarding checklist for two new interns.',
];

export const AIPlannerPage = () => {
  const [description, setDescription] = useState('');
  const [plan, setPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isGenerating) {
      return;
    }

    const trimmed = description.trim();

    if (trimmed.length === 0) {
      setValidationError('Describe what you want to accomplish before generating a plan.');
      setError(null);
      return;
    }

    setValidationError(null);
    setError(null);
    setIsGenerating(true);

    try {
      const generatedPlan = await generateTaskPlan(trimmed);
      setPlan(generatedPlan);
    } catch (requestError) {
      setError(requestError.message);
      setPlan(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExampleClick = (example) => {
    setDescription(example);
    setValidationError(null);
  };

  const handleReset = () => {
    setDescription('');
    setPlan(null);
    setError(null);
    setValidationError(null);
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold text-slate-900">Generate a task plan</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          Describe a goal in your own words. The backend sends it to the AI provider and returns a structured
          plan with a summary, priority, effort estimate and step-by-step actions.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5">
            <label htmlFor="ai-description" className="block text-sm font-medium text-slate-700">
              What do you want to accomplish?
            </label>
            <p id="ai-description-help" className="mt-1 text-xs text-slate-500">
              The more context you provide, the more useful the plan will be.
            </p>

            <textarea
              id="ai-description"
              name="description"
              rows={9}
              value={description}
              maxLength={MAX_DESCRIPTION_LENGTH}
              onChange={(event) => {
                setDescription(event.target.value);
                if (validationError) {
                  setValidationError(null);
                }
              }}
              disabled={isGenerating}
              placeholder="I need to build a portfolio website within three days."
              aria-describedby="ai-description-help"
              aria-invalid={Boolean(validationError)}
              className={`mt-3 block w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-50 ${
                validationError
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30'
                  : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500/30'
              }`}
            />

            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>{description.trim().length} characters</span>
              {plan && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="font-medium text-brand-600 transition hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  Clear
                </button>
              )}
            </div>

            {validationError && (
              <p className="mt-3 text-sm font-medium text-rose-600" role="alert">
                {validationError}
              </p>
            )}

            <Button type="submit" className="mt-4 w-full" size="lg" loading={isGenerating}>
              {isGenerating ? (
                'Generating plan…'
              ) : (
                <>
                  <Sparkles className="size-4" aria-hidden="true" />
                  Generate plan
                </>
              )}
            </Button>

            {isGenerating && (
              <p className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500" role="status">
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                The AI provider is drafting your plan. This usually takes a few seconds.
              </p>
            )}

            <div className="mt-6 border-t border-slate-100 pt-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Wand2 className="size-3.5" aria-hidden="true" />
                Try an example
              </p>
              <div className="mt-2.5 space-y-2">
                {EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => handleExampleClick(example)}
                    disabled={isGenerating}
                    className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-xs leading-5 text-slate-600 transition hover:border-brand-300 hover:bg-brand-50/50 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-60"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </section>

        <section className="lg:col-span-3">
          {error && (
            <Alert title="The AI service could not generate a plan" className="mb-4">
              {error}
            </Alert>
          )}

          {isGenerating && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  </span>
                  <div className="space-y-2">
                    <div className="h-3 w-40 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-64 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          )}

          {!isGenerating && !error && !plan && (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Sparkles className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-900">Your plan will appear here</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Write a description on the left and generate a plan to see a summary, priority, effort estimate
                and an actionable checklist.
              </p>
            </div>
          )}

          {!isGenerating && plan && <PlanResult plan={plan} />}
        </section>
      </div>
    </div>
  );
};
