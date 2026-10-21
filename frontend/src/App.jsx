import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ToastProvider } from './components/providers/ToastProvider';
import { TasksProvider } from './components/providers/TasksProvider';
import { TaskFormProvider } from './components/providers/TaskFormProvider';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { AIPlannerPage } from './pages/AIPlannerPage';
import { NotFoundPage } from './pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'ai-planner', element: <AIPlannerPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export const App = () => (
  <ToastProvider>
    <TasksProvider>
      <TaskFormProvider>
        <RouterProvider router={router} />
      </TaskFormProvider>
    </TasksProvider>
  </ToastProvider>
);
