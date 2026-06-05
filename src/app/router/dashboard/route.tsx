import { Outlet, createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '@/shared/ui';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      // return redirect({ to: '/' });
    }
  },
  component: () => (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
});
