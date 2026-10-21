const DATE_FORMAT_OPTIONS = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

const DATE_TIME_FORMAT_OPTIONS = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
};

const toDate = (value) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Formats an ISO date string as e.g. "Dec 31, 2026".
 */
export const formatDate = (value) => {
  const date = toDate(value);
  return date ? date.toLocaleDateString(undefined, DATE_FORMAT_OPTIONS) : '—';
};

/**
 * Formats an ISO date string including the time, e.g. "Dec 31, 2026, 10:30 PM".
 */
export const formatDateTime = (value) => {
  const date = toDate(value);
  return date ? date.toLocaleString(undefined, DATE_TIME_FORMAT_OPTIONS) : '—';
};

/**
 * Converts an ISO date into the `YYYY-MM-DD` shape used by `<input type="date">`.
 */
export const toDateInputValue = (value) => {
  const date = toDate(value);
  if (!date) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * True when the due date is in the past relative to the end of today.
 */
export const isOverdue = (value) => {
  const date = toDate(value);
  if (!date) {
    return false;
  }

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return date.getTime() < endOfToday.getTime();
};

/**
 * Human friendly "3 days ago" style label.
 */
export const formatRelativeTime = (value) => {
  const date = toDate(value);
  if (!date) {
    return '—';
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) {
    return 'just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }

  return formatDate(value);
};
