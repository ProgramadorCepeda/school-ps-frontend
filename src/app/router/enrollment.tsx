import { createFileRoute } from '@tanstack/react-router';
import { EnrollmentSearch } from '../../pages/EnrollmentSearchPage';
import { AppLayout } from '../../shared/ui/templates/AppLayout';

export const Route = createFileRoute('/enrollment')({
  component: () => (
    <AppLayout>
      <EnrollmentSearch />
    </AppLayout>
  ),
});
