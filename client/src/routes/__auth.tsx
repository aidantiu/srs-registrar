import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { getApiUrl } from '../common/api';

// Verify authentication
const verifyAuth = async (): Promise<boolean> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(getApiUrl('/api/auth/verify'), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = (await response.json()) as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
};

export const Route = createFileRoute('/__auth')({
  beforeLoad: async () => {
    const isAuthenticated = await verifyAuth();
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: '/login' });
    }
  },
  component: () => <Outlet />,
});
