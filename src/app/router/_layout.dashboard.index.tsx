import { createFileRoute, redirect } from '@tanstack/react-router';
import { DashboardPage } from '../../pages/DashboardPage';

export const Route = createFileRoute('/_layout/dashboard/')({
  beforeLoad: () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/login' });
    }
  },
  component: DashboardPage,
});
