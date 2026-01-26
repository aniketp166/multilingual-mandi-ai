// Configuration management for Multilingual Mandi Frontend (Frontend-Only)
// All environment variables are centralized here

interface AppConfig {
  // AI Services
  ai: {
    geminiApiKey?: string;
    model: string;
    temperature: number;
    maxTokens: number;
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
  ai: {
    geminiApiKey: getEnvVar('NEXT_PUBLIC_GEMINI_API_KEY'),
    model: getEnvVar('NEXT_PUBLIC_GEMINI_MODEL', 'gemini-pro'),
    temperature: getEnvNumber('NEXT_PUBLIC_GEMINI_TEMPERATURE', 0.7),
    maxTokens: getEnvNumber('NEXT_PUBLIC_GEMINI_MAX_TOKENS', 1000),
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

// Validation function to check if required config is present
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check if Gemini API key is present in production
  if (config.app.environment === 'production' && !config.ai.geminiApiKey) {
    errors.push('NEXT_PUBLIC_GEMINI_API_KEY is required for production');
  }
  
  // Warn about missing AI key in development
  if (config.app.environment === 'development' && !config.ai.geminiApiKey) {
    console.warn('NEXT_PUBLIC_GEMINI_API_KEY is not set - AI features will use mock responses');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Development helper to log configuration (excluding sensitive data)
export const logConfig = (): void => {
  if (config.app.environment === 'development' && config.features.debugLogs) {
    console.group('🔧 Multilingual Mandi Configuration (Frontend-Only)');
    console.log('App Version:', config.app.version);
    console.log('Environment:', config.app.environment);
    console.log('Features:', config.features);
    console.log('Storage Config:', config.storage);
    console.log('Defaults:', config.defaults);
    console.log('UI Config:', config.ui);
    console.log('AI Config:', { 
      model: config.ai.model, 
      temperature: config.ai.temperature, 
      maxTokens: config.ai.maxTokens,
      keyPresent: !!config.ai.geminiApiKey 
    });
    console.groupEnd();
  }
};

// Export individual config sections for convenience
export const { ai: aiConfig, app: appConfig, features, storage: storageConfig, defaults, ui: uiConfig } = config;

export default config;