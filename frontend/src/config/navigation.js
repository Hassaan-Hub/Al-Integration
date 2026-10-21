import { LayoutDashboard, ListTodo, Sparkles } from 'lucide-react';

/**
 * Single source of truth for the application navigation.
 * Used by the sidebar links and by the top bar page title.
 */
export const NAV_ITEMS = [
  {
    to: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    title: 'Dashboard',
    subtitle: 'An overview of your tasks and planning progress.',
  },
  {
    to: '/tasks',
    label: 'Tasks',
    icon: ListTodo,
    title: 'Tasks',
    subtitle: 'Create, update and track every task in your workspace.',
  },
  {
    to: '/ai-planner',
    label: 'AI Task Planner',
    icon: Sparkles,
    title: 'AI Task Planner',
    subtitle: 'Describe a goal and let the assistant draft a structured plan.',
  },
];

export const findNavItem = (pathname) =>
  NAV_ITEMS.find((item) => (item.to === '/' ? pathname === '/' : pathname.startsWith(item.to))) ??
  NAV_ITEMS[0];
