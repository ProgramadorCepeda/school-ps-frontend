import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { DashboardLayout } from '@/shared/ui';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/login' });
    }
  },
  component: () => (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
});
