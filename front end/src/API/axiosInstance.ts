import axios from "axios";

/**
 * Create axios instance with interceptors for JWT authentication
 * This automatically adds the JWT token to every API request
 */
const axiosInstance = axios.create({
  baseURL: "https://localhost:7259",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Allow credentials (cookies, auth headers)
  httpsAgent: {
    rejectUnauthorized: false, // Allow self-signed certificates in development
  },
});

/**
 * Request Interceptor: Add JWT token to all requests
 * Runs BEFORE the request is sent to the server
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("authToken");

    // If token exists, add it to request header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request setup errors
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor: Handle token expiration and errors
 * Runs AFTER response is received from server
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Success response - just return it
    return response;
  },
  (error) => {
    // Handle 401 (Unauthorized) - token expired or invalid
    if (error.response?.status === 401) {
      // Clear old token
      localStorage.removeItem("authToken");

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
