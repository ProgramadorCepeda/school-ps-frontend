import { createFileRoute } from '@tanstack/react-router';
import { AppLayout } from '../../shared/ui/templates/AppLayout';

export const Route = createFileRoute('/_layout')({
  component: AppLayout,
});
