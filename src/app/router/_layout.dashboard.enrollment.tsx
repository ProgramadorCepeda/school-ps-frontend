import { createFileRoute, redirect } from '@tanstack/react-router';
import { EnrollmentSearch } from '../../pages/EnrollmentSearchPage';

export const Route = createFileRoute('/_layout/dashboard/enrollment')({
  beforeLoad: () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/login' });
    }
  },
  component: EnrollmentSearch,
});
