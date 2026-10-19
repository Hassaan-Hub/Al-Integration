// Task controller to handle CRUD operations
import mongoose from 'mongoose';
import Task from '../models/task.model.js';

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const allowedStatuses = ['pending', 'in-progress', 'completed'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: pending, in-progress, completed',
      });
    }

    const task = await Task.create({
      title,
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
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
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
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
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
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update a task by ID
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID',
      });
    }

    if (title !== undefined && !title) {
      return res.status(400).json({
        success: false,
        message: 'Title cannot be empty',
      });
    }

    const allowedStatuses = ['pending', 'in-progress', 'completed'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: pending, in-progress, completed',
      });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, status, dueDate },
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
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
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
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};