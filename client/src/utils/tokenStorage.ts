/**
 * Get the authentication token from local storage
 * @returns The token or null if not found
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Set the authentication token in local storage
 * @param token The token to store
 */
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * Remove the authentication token from local storage
 */
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * Check if the token is expired
 * @param token JWT token to check
 * @returns True if expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    return true; // If there's an error parsing the token, consider it expired
  }
};

/**
 * Get user ID from token
 * @param token JWT token
 * @returns User ID or null if token is invalid
 */
export const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || null;
  } catch (error) {
    return null;
  }
};

/**
 * Get token expiration date
 * @param token JWT token
 * @returns Expiration date or null if token is invalid
 */
export const getTokenExpirationDate = (token: string): Date | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return new Date(expirationTime);
  } catch (error) {
    return null;
  }
};