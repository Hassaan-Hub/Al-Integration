import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
    <span className="inline-flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
      <Compass className="size-7" aria-hidden="true" />
    </span>

    <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-600">404</p>
    <h2 className="mt-2 text-xl font-semibold text-slate-900">Page not found</h2>
    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
      The page you are looking for does not exist or has been moved. Use the navigation to get back to your
      workspace.
    </p>

    <Link
      to="/"
      className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Back to dashboard
    </Link>
  </div>
);
