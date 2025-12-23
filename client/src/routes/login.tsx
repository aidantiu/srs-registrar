import { createFileRoute } from '@tanstack/react-router';
import LoginPage from '../pages/Login';
import { requireGuest } from '../common/route-guards';

export const Route = createFileRoute('/login')({
  component: LoginPage,
  beforeLoad: () => {
    requireGuest();
  },
});
