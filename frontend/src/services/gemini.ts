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

  constructor() {
    // No API key needed on frontend - handled by API routes
  }

  // Generic API request to our secure endpoints
  private async makeApiRequest<T>(endpoint: string, data: unknown): Promise<GeminiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
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
  }

  // Translation service
  async translate(request: TranslationRequest): Promise<GeminiResponse<TranslationResponse>> {
    try {
      return await this.makeApiRequest<TranslationResponse>('/translate', request);
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