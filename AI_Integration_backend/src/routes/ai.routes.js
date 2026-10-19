// AI routes for task planning
import express from 'express';
import { generateTaskPlan } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/plan-task', generateTaskPlan);

export default router;