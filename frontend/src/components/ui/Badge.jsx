export const Badge = ({ children, className = '', dotClass = '', label }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${className}`}
    title={label}
  >
    {dotClass && <span className={`size-1.5 rounded-full ${dotClass}`} aria-hidden="true" />}
    {children}
  </span>
);
