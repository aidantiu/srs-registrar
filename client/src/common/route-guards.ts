import { redirect } from '@tanstack/react-router';
import { getApiUrl } from './api';

/**
 * Verify if user is authenticated by checking token with backend
 */
export const verifyAuth = async (): Promise<boolean> => {
  const token = localStorage.getItem('token');

  if (!token) {
    return false;
  }

  try {
    const response = await fetch(getApiUrl('/api/auth/verify'), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json()) as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
};

/**
 * Check if user is authenticated (just checks if token exists)
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Handle authentication redirect - redirects to login if not authenticated
 * Use this in route beforeLoad hooks
 */
export const requireAuth = async (): Promise<void> => {
  const authenticated = await verifyAuth();

  if (!authenticated) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: '/login' });
  }
};

/**
 * Handle guest redirect - redirects to home if already authenticated
 * Use this in public routes like login
 */
export const requireGuest = (): void => {
  if (isAuthenticated()) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: '/' });
  }
};
