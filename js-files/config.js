/**
 * Central configuration file for the application.
 * This file contains all the shared configuration values used across the application.
 */

// API Base URL - Single source of truth for all API calls
const API_BASE_URL = "https://cartbutler.duckdns.org/api";

// TODO: Consider adding environment-specific configurations (dev, staging, prod)
// TODO: Consider adding other configuration values like:
//       - API timeout values
//       - Retry configurations
//       - Feature flags
//       - Analytics keys

// Export for ES6 modules
export { API_BASE_URL };
