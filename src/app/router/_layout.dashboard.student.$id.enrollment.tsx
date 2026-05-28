import { createFileRoute, redirect } from '@tanstack/react-router';
import { EnrollmentDetail } from '../../pages/EnrollmentDetailPage';

export const Route = createFileRoute('/_layout/dashboard/student/$id/enrollment')({
  beforeLoad: () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/login' });
    }
  },
  component: EnrollmentDetail,
});
