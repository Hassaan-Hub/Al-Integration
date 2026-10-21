import { createContext, useContext } from 'react';

export const TaskFormContext = createContext(null);

/**
 * Access the global create/edit task modal. Must be used inside <TaskFormProvider>.
 */
export const useTaskForm = () => {
  const context = useContext(TaskFormContext);

  if (!context) {
    throw new Error('useTaskForm must be used within a TaskFormProvider');
  }

  return context;
};
