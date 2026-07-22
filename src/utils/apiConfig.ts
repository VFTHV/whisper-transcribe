// API configuration - always uses Netlify functions
export const getApiUrl = (endpoint: string): string => {
  return `/.netlify/functions${endpoint}`;
};

export const API_ENDPOINTS = {
  TRANSCRIBE: "/transcribe",
  HEALTH: "/health",
} as const;
