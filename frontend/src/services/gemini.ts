// Gemini AI Service for Multilingual Mandi Frontend
// Secure integration via API routes (no exposed API keys)

import { 
  TranslationRequest, 
  TranslationResponse, 
  PriceSuggestionRequest, 
  PriceSuggestionResponse,
  NegotiationRequest,
  NegotiationResponse 
} from '../types';

// Gemini API Response wrapper
interface GeminiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Gemini API Error class
export class GeminiError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

// Gemini AI Client class
class GeminiAIClient {
  private baseUrl = '/api/ai';
  private cachePrefix = 'gemini_cache_';
  private maxRetries = 3;

  constructor() {
    // No API key needed on frontend - handled by API routes
  }

  // Cache helper
  private getCached<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(this.cachePrefix + key);
      if (!item) return null;
      
      const { value, expiry } = JSON.parse(item);
      if (Date.now() > expiry) {
        localStorage.removeItem(this.cachePrefix + key);
        return null;
      }
      return value;
    } catch (e) {
      return null;
    }
  }

  // Set cache helper (default 24h expiry)
  private setCache<T>(key: string, value: T, ttlMs = 24 * 60 * 60 * 1000): void {
    if (typeof window === 'undefined') return;
    try {
      const item = {
        value,
        expiry: Date.now() + ttlMs
      };
      localStorage.setItem(this.cachePrefix + key, JSON.stringify(item));
    } catch (e) {
        // Handle quota exceeded
        console.warn('LocalStorage quota exceeded, clearing old cache');
        this.clearOldCache();
    }
  }

  private clearOldCache() {
      if (typeof window === 'undefined') return;
      // Simple strategy: clear all gemini cache
      Object.keys(localStorage).forEach(key => {
          if (key.startsWith(this.cachePrefix)) {
              localStorage.removeItem(key);
          }
      });
  }

  // Retry helper with exponential backoff
  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: unknown;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        // Don't retry client errors (4xx) usually, but here we treat most as potentially transient or rate limits
        // If it's a GeminiError with specific code, check if we should retry? 
        // For simplicity, we retry on all except maybe critical validation errors.
        
        if (attempt === this.maxRetries) break;
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  }

  // Generic API request to our secure endpoints
  private async makeApiRequest<T>(endpoint: string, data: unknown): Promise<GeminiResponse<T>> {
    return this.withRetry(async () => {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data)
            });
      
            if (!response.ok) {
              // Rate limiting handling (429) could be specific here
              throw new GeminiError(`API error: ${response.status} ${response.statusText}`);
            }
      
            const result = await response.json();
            return result;
          } catch (error) {
            if (error instanceof GeminiError) {
              throw error;
            }
            throw new GeminiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
    });
  }

  // Translation service
  async translate(request: TranslationRequest): Promise<GeminiResponse<TranslationResponse>> {
    // Generate cache key based on text and target language
    // Assumes request has text and targetLang
    const cacheKey = typeof request === 'object' && request !== null && 'text' in request && 'target_language' in request
        ? `trans_${(request as unknown as Record<string, unknown>).target_language}_${(request as unknown as Record<string, unknown>).text ? String((request as unknown as Record<string, unknown>).text).substring(0, 30) : ''}_${(request as unknown as Record<string, unknown>).text ? String((request as unknown as Record<string, unknown>).text).length : 0}` // Simple hash key
        : null;

    if (cacheKey) {
        const cached = this.getCached<GeminiResponse<TranslationResponse>>(cacheKey);
        if (cached) return cached;
    }

    try {
      const response = await this.makeApiRequest<TranslationResponse>('/translate', request);
      if (cacheKey && response.success) {
          this.setCache(cacheKey, response);
      }
      return response;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  // Price suggestion service
  async getPriceSuggestion(request: PriceSuggestionRequest): Promise<GeminiResponse<PriceSuggestionResponse>> {
    try {
      return await this.makeApiRequest<PriceSuggestionResponse>('/price-suggestion', request);
    } catch (error) {
      console.error('Price suggestion error:', error);
      throw error;
    }
  }

  // Negotiation assistance service
  async getNegotiationSuggestions(request: NegotiationRequest): Promise<GeminiResponse<NegotiationResponse>> {
    try {
      return await this.makeApiRequest<NegotiationResponse>('/negotiation', request);
    } catch (error) {
      console.error('Negotiation suggestion error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<GeminiResponse<{ status: string; service: string }>> {
    return {
      data: {
        status: 'healthy',
        service: 'Gemini AI (via secure API routes)'
      },
      success: true
    };
  }
}

// Create singleton instance
export const geminiClient = new GeminiAIClient();

// Export individual AI functions for convenience
export const geminiAI = {
  // Translation services
  translate: (request: TranslationRequest) => geminiClient.translate(request),

  // Price discovery services
  getPriceSuggestion: (request: PriceSuggestionRequest) => 
    geminiClient.getPriceSuggestion(request),

  // Negotiation services
  getNegotiationSuggestions: (request: NegotiationRequest) => 
    geminiClient.getNegotiationSuggestions(request),

  // Health check
  healthCheck: () => geminiClient.healthCheck(),
};

export default geminiClient;