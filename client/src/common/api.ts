/**
 * API configuration utilities
 */

/**
 * Get the base API URL based on the environment
 * In development: returns empty string to use Vite proxy
 * In production: returns the full backend URL
 */
export const getApiBaseUrl = (): string => {
  // In development, use Vite proxy (empty string means relative URLs)
  if (import.meta.env.DEV) {
    return '';
  }
  
  // In production, use the full backend URL
  return import.meta.env.VITE_API_URL || '';
};

/**
 * Create a full API URL
 */
export const getApiUrl = (path: string): string => {
  const baseUrl = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};
