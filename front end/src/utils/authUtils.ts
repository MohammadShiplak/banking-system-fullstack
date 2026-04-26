/**
 * Authentication utility functions
 * Helper functions for managing JWT tokens and authentication state
 */

/**
 * Save JWT token to localStorage
 * Called automatically by Login function, but useful if you need to do it manually
 */
export const saveToken = (token: string): void => {
  localStorage.setItem("authToken", token);
  console.log("✅ Token saved");
};

/**
 * Get JWT token from localStorage
 * Used by axiosInstance interceptor
 */
export const getToken = (): string | null => {
  return localStorage.getItem("authToken");
};

/**
 * Check if user is logged in (has a valid token)
 * Useful for conditional rendering or protecting routes
 */
export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("authToken");
  return !!token; // Returns true if token exists, false otherwise
};

/**
 * Logout user by removing token and redirecting to login
 * Call this when user clicks "Sign Out" button
 */
export const logout = (): void => {
  localStorage.removeItem("authToken");
  console.log("✅ Token removed - User logged out");
  // Redirect to login page
  window.location.href = "/login";
};

/**
 * Clear all authentication data
 * More thorough logout that clears other stored data if needed
 */
export const clearAuthData = (): void => {
  localStorage.removeItem("authToken");
  sessionStorage.clear();
  console.log("✅ All auth data cleared");
};
