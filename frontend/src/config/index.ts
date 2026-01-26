// Configuration management for Multilingual Mandi Frontend
// All environment variables are centralized here

interface AppConfig {
  // API Configuration
  api: {
    baseUrl: string;
    wsBaseUrl: string;
    timeout: number;
    maxRetries: number;
    retryDelay: number;
  };
  
  // AI Services
  ai: {
    geminiApiKey?: string;
  };
  
  // App Information
  app: {
    name: string;
    version: string;
    environment: string;
  };
  
  // Feature Flags
  features: {
    darkMode: boolean;
    offlineMode: boolean;
    analytics: boolean;
    debugLogs: boolean;
  };
  
  // Storage Configuration
  storage: {
    version: string;
    maxSize: number;
    keyPrefix: string;
  };
  
  // Default Settings
  defaults: {
    language: string;
    currency: string;
    location: string;
  };

  // UI Configuration
  ui: {
    theme: string;
    mobileBreakpoint: number;
    touchTargetSize: number;
  };
}

// Helper function to get environment variable with fallback
const getEnvVar = (key: string, fallback: string = ''): string => {
  return process.env[key] || fallback;
};

// Helper function to get boolean environment variable
const getEnvBool = (key: string, fallback: boolean = false): boolean => {
  const value = process.env[key];
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
};

// Helper function to get number environment variable
const getEnvNumber = (key: string, fallback: number = 0): number => {
  const value = process.env[key];
  if (value === undefined) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

// Main configuration object
export const config: AppConfig = {
  api: {
    baseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8001'),
    wsBaseUrl: getEnvVar('NEXT_PUBLIC_WS_BASE_URL', 'ws://localhost:8001'),
    timeout: getEnvNumber('NEXT_PUBLIC_API_TIMEOUT', 10000), // 10 seconds
    maxRetries: getEnvNumber('NEXT_PUBLIC_MAX_RETRIES', 3),
    retryDelay: getEnvNumber('NEXT_PUBLIC_RETRY_DELAY', 1000),
  },
  
  ai: {
    geminiApiKey: getEnvVar('NEXT_PUBLIC_GEMINI_API_KEY'),
  },
  
  app: {
    name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Multilingual Mandi'),
    version: getEnvVar('NEXT_PUBLIC_APP_VERSION', '1.0.0'),
    environment: getEnvVar('NEXT_PUBLIC_ENVIRONMENT', 'development'),
  },
  
  features: {
    darkMode: getEnvBool('NEXT_PUBLIC_ENABLE_DARK_MODE', true),
    offlineMode: getEnvBool('NEXT_PUBLIC_ENABLE_OFFLINE_MODE', true),
    analytics: getEnvBool('NEXT_PUBLIC_ENABLE_ANALYTICS', false),
    debugLogs: getEnvBool('NEXT_PUBLIC_ENABLE_DEBUG_LOGS', false),
  },
  
  storage: {
    version: getEnvVar('NEXT_PUBLIC_STORAGE_VERSION', '1.0.0'),
    maxSize: getEnvNumber('NEXT_PUBLIC_MAX_STORAGE_SIZE', 5242880), // 5MB
    keyPrefix: 'multilingual-mandi',
  },
  
  defaults: {
    language: getEnvVar('NEXT_PUBLIC_DEFAULT_LANGUAGE', 'en'),
    currency: getEnvVar('NEXT_PUBLIC_DEFAULT_CURRENCY', 'INR'),
    location: getEnvVar('NEXT_PUBLIC_DEFAULT_LOCATION', 'India'),
  },

  ui: {
    theme: getEnvVar('NEXT_PUBLIC_THEME', 'light'),
    mobileBreakpoint: getEnvNumber('NEXT_PUBLIC_MOBILE_BREAKPOINT', 768),
    touchTargetSize: getEnvNumber('NEXT_PUBLIC_TOUCH_TARGET_SIZE', 44),
  },
};

// API Endpoints - constructed from base URL
export const apiEndpoints = {
  // Translation endpoints
  translate: `${config.api.baseUrl}/api/translate`,
  
  // Price discovery endpoints
  priceDiscovery: `${config.api.baseUrl}/api/price-suggest`,
  
  // Negotiation endpoints
  negotiate: `${config.api.baseUrl}/api/negotiate`,
  
  // Health check
  health: `${config.api.baseUrl}/health`,
  
  // Version info
  version: `${config.api.baseUrl}/version`,
  
  // WebSocket endpoint
  websocket: `${config.api.wsBaseUrl}/ws`,
};

// Validation function to check if required config is present
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check required API URL
  if (!config.api.baseUrl) {
    errors.push('NEXT_PUBLIC_API_BASE_URL is required');
  }
  
  // Check if API URL is reachable format
  try {
    new URL(config.api.baseUrl);
  } catch {
    errors.push('NEXT_PUBLIC_API_BASE_URL must be a valid URL');
  }
  
  // Warn about missing AI key in production
  if (config.app.environment === 'production' && !config.ai.geminiApiKey) {
    console.warn('NEXT_PUBLIC_GEMINI_API_KEY is not set - AI features may not work');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Development helper to log configuration (excluding sensitive data)
export const logConfig = (): void => {
  if (config.app.environment === 'development' && config.features.debugLogs) {
    console.group('🔧 Multilingual Mandi Configuration');
    console.log('API Base URL:', config.api.baseUrl);
    console.log('WebSocket URL:', config.api.wsBaseUrl);
    console.log('App Version:', config.app.version);
    console.log('Environment:', config.app.environment);
    console.log('Features:', config.features);
    console.log('Storage Config:', config.storage);
    console.log('Defaults:', config.defaults);
    console.log('UI Config:', config.ui);
    console.log('AI Key Present:', !!config.ai.geminiApiKey);
    console.groupEnd();
  }
};

// Export individual config sections for convenience
export const { api: apiConfig, app: appConfig, features, storage: storageConfig, defaults, ui: uiConfig } = config;

export default config;