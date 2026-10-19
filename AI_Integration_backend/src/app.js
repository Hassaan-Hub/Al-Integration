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

export default app;