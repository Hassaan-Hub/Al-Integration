// Task controller to handle CRUD operations
import mongoose from 'mongoose';
import Task from '../models/task.model.js';

const allowedStatuses = ['pending', 'in-progress', 'completed'];

const isValidDueDate = (dueDate) => {
  if (dueDate === null) {
    return true;
  }

  if (typeof dueDate !== 'string' || dueDate.trim().length === 0) {
    return false;
  }

  const normalizedDate = dueDate.trim();
  if (Number.isNaN(Date.parse(normalizedDate))) {
    return false;
  }

  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(normalizedDate);
  if (!dateOnly) {
    return true;
  }

  const year = Number(dateOnly[1]);
  const month = Number(dateOnly[2]);
  const day = Number(dateOnly[3]);
  const parsedDate = new Date(0);
  parsedDate.setUTCFullYear(year, month - 1, day);
  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  );
};

const getTaskValidationError = (error) => {
  if (error?.name === 'ValidationError') {
    return 'Invalid task data';
  }

  if (error?.name === 'CastError') {
    return `Invalid value for ${error.path}`;
  }

  return null;
};

const sendTaskError = (res, error, action) => {
  const validationMessage = getTaskValidationError(error);

  if (validationMessage) {
    return res.status(400).json({
      success: false,
      message: validationMessage,
    });
  }

  console.error(`Failed to ${action} task`, {
    name: error?.name ?? 'Error',
  });
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body ?? {};

    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Title is required and must be a non-empty string',
      });
    }

    if (status !== undefined && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: pending, in-progress, completed',
      });
    }

    if (dueDate !== undefined && !isValidDueDate(dueDate)) {
      return res.status(400).json({
        success: false,
        message: 'Due date must be a valid date string or null',
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      status,
      dueDate,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    return sendTaskError(res, error, 'create');
  }
};

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    return sendTaskError(res, error, 'fetch');
  }
};

// Get a single task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID',
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return sendTaskError(res, error, 'fetch');
  }
};

// Update a task by ID
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body ?? {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID',
      });
    }

    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Title must be a non-empty string',
      });
    }

    if (status !== undefined && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: pending, in-progress, completed',
      });
    }

    if (dueDate !== undefined && !isValidDueDate(dueDate)) {
      return res.status(400).json({
        success: false,
        message: 'Due date must be a valid date string or null',
      });
    }

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (dueDate !== undefined) updates.dueDate = dueDate;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one task field must be provided',
      });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    return sendTaskError(res, error, 'update');
  }
};

// Delete a task by ID
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID',
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    return sendTaskError(res, error, 'delete');
  }
};