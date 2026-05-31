import { createFileRoute } from '@tanstack/react-router';
import { MainLayout } from '../../widgets/Layout/ui/MainLayout';

export const Route = createFileRoute('/_layout')({
  component: MainLayout,
});
