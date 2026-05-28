import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '../../pages/LoginPage';

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage,
});
