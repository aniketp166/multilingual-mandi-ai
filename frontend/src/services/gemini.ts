// Gemini AI Service for Multilingual Mandi Frontend
// Direct integration with Google Gemini API

import { config } from '../config';
import { 
  TranslationRequest, 
  TranslationResponse, 
  PriceSuggestionRequest, 
  PriceSuggestionResponse,
  NegotiationRequest,
  NegotiationResponse 
} from '../types';

// Gemini API Response wrapper
interface GeminiResponse<T = any> {
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

// Mock responses for development when API key is not available
const getMockTranslation = (request: TranslationRequest): TranslationResponse => ({
  translated_text: `[MOCK] Translated: ${request.text}`,
  original_text: request.text,
  source_language: request.source_language,
  target_language: request.target_language,
  confidence: 0.95
});

const getMockPriceSuggestion = (request: PriceSuggestionRequest): PriceSuggestionResponse => ({
  min_price: Math.max(1, request.current_price ? request.current_price * 0.8 : 20),
  max_price: request.current_price ? request.current_price * 1.2 : 60,
  recommended_price: request.current_price ? request.current_price * 1.05 : 40,
  reasoning: `Based on market analysis for ${request.product_name}, considering current supply and demand factors.`,
  market_trend: 'stable' as const,
  confidence: 0.85
});

const getMockNegotiationSuggestions = (_request: NegotiationRequest): NegotiationResponse => ({
  suggestions: [
    "Thank you for your interest! I can offer a competitive price for this quality product.",
    "Let me check what I can do for you. How about we meet in the middle?",
    "I appreciate your business. This is a fair price considering the current market conditions."
  ],
  context: "Professional negotiation response",
  tone: 'friendly' as const
});

// Gemini AI Client class
class GeminiAIClient {
  private apiKey: string | undefined;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    this.apiKey = config.ai.geminiApiKey;
    
    if (!this.apiKey && config.app.environment === 'development') {
      console.warn('🔑 Gemini API key not found - using mock responses for development');
    }
  }

  // Check if API is available
  private isApiAvailable(): boolean {
    return !!this.apiKey;
  }

  // Generic Gemini API request
  private async makeGeminiRequest(prompt: string): Promise<string> {
    if (!this.isApiAvailable()) {
      throw new GeminiError('Gemini API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: config.ai.temperature,
            maxOutputTokens: config.ai.maxTokens,
          }
        })
      });

      if (!response.ok) {
        throw new GeminiError(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new GeminiError('Invalid response from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
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
      if (!this.isApiAvailable()) {
        return {
          data: getMockTranslation(request),
          success: true,
          message: 'Using mock translation (API key not configured)'
        };
      }

      const prompt = `Translate the following text from ${request.source_language} to ${request.target_language}. 
      Only return the translated text, nothing else.
      
      Text to translate: "${request.text}"`;

      const translatedText = await this.makeGeminiRequest(prompt);

      const response: TranslationResponse = {
        translated_text: translatedText.trim(),
        original_text: request.text,
        source_language: request.source_language,
        target_language: request.target_language,
        confidence: 0.9
      };

      return {
        data: response,
        success: true
      };
    } catch (error) {
      console.error('Translation error:', error);
      
      // Fallback to mock response
      return {
        data: getMockTranslation(request),
        success: true,
        message: 'Using fallback translation due to API error'
      };
    }
  }

  // Price suggestion service
  async getPriceSuggestion(request: PriceSuggestionRequest): Promise<GeminiResponse<PriceSuggestionResponse>> {
    try {
      if (!this.isApiAvailable()) {
        return {
          data: getMockPriceSuggestion(request),
          success: true,
          message: 'Using mock price suggestion (API key not configured)'
        };
      }

      const prompt = `As a market analyst for Indian agricultural products, provide pricing recommendations for the following:

      Product: ${request.product_name}
      Quantity: ${request.quantity} kg
      Current asking price: ₹${request.current_price || 'Not specified'}
      Location: ${request.location || 'India'}

      Please provide:
      1. Minimum fair price per kg
      2. Maximum reasonable price per kg  
      3. Recommended selling price per kg
      4. Brief reasoning (2-3 sentences)
      5. Market trend (rising/falling/stable)

      Format your response as JSON:
      {
        "min_price": number,
        "max_price": number,
        "recommended_price": number,
        "reasoning": "string",
        "market_trend": "rising|falling|stable"
      }`;

      const responseText = await this.makeGeminiRequest(prompt);
      
      try {
        const parsedResponse = JSON.parse(responseText);
        
        const response: PriceSuggestionResponse = {
          min_price: parsedResponse.min_price || 20,
          max_price: parsedResponse.max_price || 60,
          recommended_price: parsedResponse.recommended_price || 40,
          reasoning: parsedResponse.reasoning || 'AI-generated pricing based on market analysis',
          market_trend: parsedResponse.market_trend || 'stable',
          confidence: 0.85
        };

        return {
          data: response,
          success: true
        };
      } catch (parseError) {
        throw new GeminiError('Failed to parse price suggestion response');
      }
    } catch (error) {
      console.error('Price suggestion error:', error);
      
      // Fallback to mock response
      return {
        data: getMockPriceSuggestion(request),
        success: true,
        message: 'Using fallback price suggestion due to API error'
      };
    }
  }

  // Negotiation assistance service
  async getNegotiationSuggestions(request: NegotiationRequest): Promise<GeminiResponse<NegotiationResponse>> {
    try {
      if (!this.isApiAvailable()) {
        return {
          data: getMockNegotiationSuggestions(request),
          success: true,
          message: 'Using mock negotiation suggestions (API key not configured)'
        };
      }

      const conversationHistory = request.conversation_history
        .map(msg => `${msg.sender}: ${msg.text}`)
        .join('\n');

      const prompt = `You are helping a vendor in an Indian marketplace negotiate with a buyer. 

      Product: ${request.product.name} (₹${request.product.price}/kg, ${request.product.quantity}kg available)
      Conversation so far:
      ${conversationHistory}
      
      Latest buyer message: "${request.buyer_message}"
      
      Generate 3 professional, culturally appropriate responses for the vendor in ${request.vendor_language}. 
      The responses should be:
      1. Friendly and professional
      2. Aimed at closing the deal
      3. Respectful of Indian business culture
      
      Format as JSON:
      {
        "suggestions": ["response1", "response2", "response3"],
        "tone": "friendly|professional|firm"
      }`;

      const responseText = await this.makeGeminiRequest(prompt);
      
      try {
        const parsedResponse = JSON.parse(responseText);
        
        const response: NegotiationResponse = {
          suggestions: parsedResponse.suggestions || [
            "Thank you for your interest in our products.",
            "Let me see what I can offer you.",
            "I appreciate your business."
          ],
          context: "AI-generated negotiation assistance",
          tone: parsedResponse.tone || 'friendly'
        };

        return {
          data: response,
          success: true
        };
      } catch (parseError) {
        throw new GeminiError('Failed to parse negotiation response');
      }
    } catch (error) {
      console.error('Negotiation suggestion error:', error);
      
      // Fallback to mock response
      return {
        data: getMockNegotiationSuggestions(request),
        success: true,
        message: 'Using fallback negotiation suggestions due to API error'
      };
    }
  }

  // Health check
  async healthCheck(): Promise<GeminiResponse<{ status: string; service: string }>> {
    return {
      data: {
        status: this.isApiAvailable() ? 'healthy' : 'mock_mode',
        service: 'Gemini AI'
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