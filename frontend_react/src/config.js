/**
 * Centralized runtime configuration for the React app.
 *
 * Uses CRA env var conventions. Do not hardcode environment-specific values.
 */

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /**
   * Returns the backend API base URL.
   *
   * Env:
   * - REACT_APP_API_BASE_URL: e.g. "http://localhost:3001"
   */
  return (process.env.REACT_APP_API_BASE_URL || "http://localhost:3001").replace(/\/+$/, "");
}

