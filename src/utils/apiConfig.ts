// API configuration based on development mode
export const getApiUrl = (endpoint: string): string => {
  // Check if we're running in development mode with Express server
  // This can be determined by checking if we're on port 5173 (Vite only)
  // vs port 8888 (Netlify Dev)
  const isViteOnly = window.location.port === "5173";

  if (isViteOnly && import.meta.env.DEV) {
    // Running dev:all - use Express server
    return `http://localhost:3001/api${endpoint}`;
  } else {
    // Running netlify dev or production - use Netlify functions
    return `/api${endpoint}`;
  }
};

export const API_ENDPOINTS = {
  TRANSCRIBE: "/transcribe",
  HEALTH: "/health",
} as const;
