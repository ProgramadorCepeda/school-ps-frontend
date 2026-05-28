import { createFileRoute } from '@tanstack/react-router';
import { EnrollmentDetail } from '../../../../pages/EnrollmentDetailPage';
import { AppLayout } from '../../../../shared/ui/templates/AppLayout';

export const Route = createFileRoute('/student/$id/enrollment')({
  component: () => (
    <AppLayout>
      <EnrollmentDetail />
    </AppLayout>
  ),
});
