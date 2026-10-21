// CORS configuration so browser clients (e.g. the Vite dev server) can call this API.
import cors from 'cors';

const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];

const getAllowedOrigins = () => {
  const configuredOrigins = process.env.CORS_ORIGINS;

  if (!configuredOrigins) {
    return DEFAULT_ALLOWED_ORIGINS;
  }

  return configuredOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
};

const corsOptions = {
  origin(origin, callback) {
    // Requests without an Origin header (curl, server-to-server, same-origin) are allowed.
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = getAllowedOrigins();

    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Unknown origins are simply not granted CORS headers.
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  maxAge: 600,
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
