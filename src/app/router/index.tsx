import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const token = localStorage.getItem('auth_token');
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: token ? '/dashboard' : '/login' });
  },
});
