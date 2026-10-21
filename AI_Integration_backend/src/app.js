// Express app setup with routes and middleware
import express from 'express';
import taskRoutes from './routes/task.routes.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();

// Middleware
app.use(express.json());

// Mount routes
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health-check', (req, res) => {
  return res.status(200).json({
    success: true,
    status: 'ok',
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((error, req, res, next) => {
  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON request body',
    });
  }

  return next(error);
});

export default app;