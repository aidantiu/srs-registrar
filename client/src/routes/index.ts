import { createFileRoute } from '@tanstack/react-router';
import { Home } from '../pages/Home';
import { requireAuth } from '../common/route-guards';

export const Route = createFileRoute('/')({
  component: Home,
  beforeLoad: async () => {
    await requireAuth();
  },
});

export default Route;
