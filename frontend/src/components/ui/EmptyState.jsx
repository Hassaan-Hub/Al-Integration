export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
    {Icon && (
      <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Icon className="size-6" aria-hidden="true" />
      </span>
    )}

    <h3 className="text-base font-semibold text-slate-900">{title}</h3>

    {description && <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>}

    {action && <div className="mt-6">{action}</div>}
  </div>
);
