/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_WS_BASE_URL: process.env.NEXT_PUBLIC_WS_BASE_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Multilingual Mandi',
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || 'production',
    NEXT_PUBLIC_ENABLE_DEBUG_LOGS: process.env.NEXT_PUBLIC_ENABLE_DEBUG_LOGS || 'false',
    NEXT_PUBLIC_ENABLE_DARK_MODE: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE || 'true',
    NEXT_PUBLIC_ENABLE_OFFLINE_MODE: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE || 'true',
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS || 'false',
    NEXT_PUBLIC_STORAGE_VERSION: process.env.NEXT_PUBLIC_STORAGE_VERSION || '1.0.0',
    NEXT_PUBLIC_MAX_STORAGE_SIZE: process.env.NEXT_PUBLIC_MAX_STORAGE_SIZE || '5242880',
    NEXT_PUBLIC_DEFAULT_LANGUAGE: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
    NEXT_PUBLIC_DEFAULT_CURRENCY: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'INR',
    NEXT_PUBLIC_DEFAULT_LOCATION: process.env.NEXT_PUBLIC_DEFAULT_LOCATION || 'India',
    NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
    NEXT_PUBLIC_MAX_RETRIES: process.env.NEXT_PUBLIC_MAX_RETRIES,
    NEXT_PUBLIC_RETRY_DELAY: process.env.NEXT_PUBLIC_RETRY_DELAY,
    NEXT_PUBLIC_THEME: process.env.NEXT_PUBLIC_THEME || 'light',
    NEXT_PUBLIC_MOBILE_BREAKPOINT: process.env.NEXT_PUBLIC_MOBILE_BREAKPOINT || '768',
    NEXT_PUBLIC_TOUCH_TARGET_SIZE: process.env.NEXT_PUBLIC_TOUCH_TARGET_SIZE || '44',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8001',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig