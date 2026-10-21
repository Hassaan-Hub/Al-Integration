import axios from 'axios';

const DEFAULT_BASE_URL = 'http://localhost:5000';
const REQUEST_TIMEOUT_MS = 30000;

const trimTrailingSlashes = (value) => String(value ?? '').trim().replace(/\/+$/, '');

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL;

/**
 * Normalised backend base URL. Never ends with a slash so that path joining
 * can never produce duplicated separators such as `//api/tasks`.
 */
export const API_BASE_URL = trimTrailingSlashes(rawBaseUrl) || DEFAULT_BASE_URL;

/**
 * Joins the API base URL with an endpoint path without producing malformed URLs.
 */
export const buildUrl = (path) => {
  const normalizedPath = String(path ?? '').trim();
  if (!normalizedPath) {
    return API_BASE_URL;
  }

  const withLeadingSlash = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  return `${API_BASE_URL}${withLeadingSlash}`;
};

/**
 * Normalised application error carrying the HTTP status and the backend message.
 */
export class ApiError extends Error {
  constructor(message, { status = 0, payload = null, code = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
    this.code = code;
  }
}

const readServerMessage = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  if (typeof payload.message === 'string' && payload.message.trim().length > 0) {
    return payload.message.trim();
  }

  if (typeof payload.error === 'string' && payload.error.trim().length > 0) {
    return payload.error.trim();
  }

  return null;
};

const buildFriendlyMessage = (error) => {
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return 'The server took too long to respond. Please try again.';
  }

  if (!error.response) {
    return `Unable to reach the backend at ${API_BASE_URL}. Make sure the server is running.`;
  }

  const { status, data } = error.response;

  if (typeof data === 'string' && data.trim().length > 0) {
    return data.trim();
  }

  if (status >= 500) {
    return 'The server encountered an unexpected error. Please try again.';
  }

  return `Request failed with status ${status}.`;
};

/**
 * Converts any Axios/fetch failure into a predictable ApiError instance.
 */
export const normalizeError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }

  const isJsonParseFailure =
    error instanceof SyntaxError ||
    error?.name === 'SyntaxError' ||
    error?.code === 'ERR_BAD_RESPONSE';

  if (isJsonParseFailure && error?.response) {
    return new ApiError('The server returned a response that could not be read as JSON.', {
      status: error.response.status,
      payload: null,
      code: 'INVALID_JSON',
    });
  }

  const serverMessage = readServerMessage(error?.response?.data);

  return new ApiError(serverMessage ?? buildFriendlyMessage(error), {
    status: error?.response?.status ?? 0,
    payload: error?.response?.data ?? null,
    code: error?.code ?? null,
  });
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeError(error)),
);
