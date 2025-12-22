/**
 * Authentication utilities for client-side
 */

export type UserRole = 'admin' | 'teacher';

export interface User {
  id: string;
  fullName: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

/**
 * Get stored JWT token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Get stored user data
 */
export const getUser = (): User | null => {
  const userString = localStorage.getItem('user');
  if (!userString) return null;
  
  try {
    return JSON.parse(userString) as User;
  } catch {
    return null;
  }
};

/**
 * Store authentication data
 */
export const setAuth = (token: string, user: User): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Clear authentication data
 */
export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Verify token with backend
 */
export const verifyAuth = async (): Promise<boolean> => {
  const token = getToken();
  
  if (!token) {
    return false;
  }

  try {
    const response = await fetch('/api/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json()) as AuthResponse;
    
    if (!data.success) {
      clearAuth();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Auth verification error:', error);
    clearAuth();
    return false;
  }
};

/**
 * Login user
 */
export const login = async (
  email: string,
  password: string,
  role: UserRole
): Promise<AuthResponse> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, role }),
    });

    const data = (await response.json()) as AuthResponse;
    
    if (data.success && data.token && data.user) {
      setAuth(data.token, data.user);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'An error occurred during login',
    };
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  const token = getToken();
  
  if (token) {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  
  clearAuth();
};

/**
 * Create Authorization header with token
 */
export const getAuthHeader = ():
  | { Authorization: string }
  | Record<string, never> => {
  const token = getToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Check if user has specific role
 */
export const hasRole = (role: UserRole): boolean => {
  const user = getUser();
  return user?.role === role;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (roles: Array<UserRole>): boolean => {
  const user = getUser();
  if (!user) return false;
  
  return roles.includes(user.role);
};
