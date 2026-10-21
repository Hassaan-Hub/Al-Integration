import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);

/**
 * Access the notification helpers. Must be used inside <ToastProvider>.
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
