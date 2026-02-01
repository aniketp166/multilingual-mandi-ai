/**
 * AI Prompt Templates for Frontend
 * Centralized prompt management for client-side AI interactions
 */

export interface PromptContext {
  userLanguage?: string;
  targetLanguage?: string;
  productName?: string;
  price?: number;
  quantity?: number;
  location?: string;
}

export class FrontendPrompts {
  /**
   * Build user-friendly translation prompt for display
   */
  static buildTranslationDisplay(
    originalText: string,
    sourceLanguage: string,
    targetLanguage: string
  ): string {
    const langNames: { [key: string]: string } = {
      'en': 'English',
      'hi': 'Hindi',
      'ta': 'Tamil',
      'te': 'Telugu',
      'bn': 'Bengali',
      'mr': 'Marathi',
      'gu': 'Gujarati',
      'kn': 'Kannada'
    };

    return `Translating from ${langNames[sourceLanguage] || sourceLanguage} to ${langNames[targetLanguage] || targetLanguage}...`;
  }

  /**
   * Build price discovery loading message
   */
  static buildPriceDiscoveryMessage(productName: string, quantity: number): string {
    return `Getting AI price suggestions for ${quantity} kg of ${productName}...`;
  }

  /**
   * Build negotiation assistance message
   */
  static buildNegotiationMessage(productName: string): string {
    return `AI is analyzing the conversation and generating helpful replies for ${productName}...`;
  }

  /**
   * Get fallback messages when AI services are unavailable
   */
  static getFallbackMessages() {
    return {
      translation: {
        title: "Translation Unavailable",
        message: "Translation service is temporarily unavailable. The original message is displayed below.",
        action: "Try again later"
      },
      priceDiscovery: {
        title: "Price Suggestions Unavailable", 
        message: "AI price discovery is temporarily unavailable. Default price ranges are shown based on typical market conditions.",
        action: "Check market prices manually"
      },
      negotiation: {
        title: "AI Assistant Unavailable",
        message: "Negotiation assistant is temporarily unavailable. Generic professional responses are provided.",
        action: "Use your best judgment"
      }
    };
  }

  /**
   * Validate user input before sending to AI
   */
  static validateInput(text: string, maxLength = 1000): { isValid: boolean; error?: string } {
    if (!text || !text.trim()) {
      return { isValid: false, error: "Input cannot be empty" };
    }

    if (text.length > maxLength) {
      return { isValid: false, error: `Input too long. Maximum ${maxLength} characters allowed.` };
    }

    // Check for potentially harmful patterns
    const harmfulPatterns = [
      /ignore\s+previous\s+instructions/i,
      /system\s+prompt/i,
      /jailbreak/i,
      /pretend\s+you\s+are/i,
    ];

    for (const pattern of harmfulPatterns) {
      if (pattern.test(text)) {
        return { isValid: false, error: "Invalid input detected" };
      }
    }

    return { isValid: true };
  }

  /**
   * Sanitize AI output for display
   */
  static sanitizeOutput(text: string): string {
    if (!text) return "";
    
    // Remove potential harmful content and limit length
    let sanitized = text.trim().substring(0, 1000);
    
    // Remove system-like responses
    if (sanitized.toLowerCase().startsWith("i am") || 
        sanitized.toLowerCase().startsWith("i'm an ai") ||
        sanitized.toLowerCase().startsWith("as an ai")) {
      sanitized = "I can help you with that request.";
    }
    
    return sanitized;
  }

  /**
   * Format error messages for user display
   */
  static formatErrorMessage(error: string, context = ""): string {
    const errorMap: { [key: string]: string } = {
      "RATE_LIMIT_EXCEEDED": "Too many requests. Please wait a moment and try again.",
      "VALIDATION_ERROR": "Please check your input and try again.",
      "NETWORK_ERROR": "Network connection issue. Please check your internet connection.",
      "SERVICE_UNAVAILABLE": "Service is temporarily unavailable. Please try again later.",
      "TIMEOUT": "Request timed out. Please try again.",
    };

    const userFriendlyError = errorMap[error] || error;
    return context ? `${context}: ${userFriendlyError}` : userFriendlyError;
  }

  /**
   * Generate loading messages with context
   */
  static getLoadingMessage(action: 'translate' | 'price' | 'negotiate', context?: PromptContext): string {
    switch (action) {
      case 'translate':
        return context?.targetLanguage 
          ? `Translating to ${context.targetLanguage.toUpperCase()}...`
          : "Translating...";
      
      case 'price':
        return context?.productName 
          ? `Getting price suggestions for ${context.productName}...`
          : "Getting price suggestions...";
      
      case 'negotiate':
        return context?.productName
          ? `Generating negotiation responses for ${context.productName}...`
          : "Generating negotiation responses...";
      
      default:
        return "Processing...";
    }
  }

  /**
   * Format success messages
   */
  static getSuccessMessage(action: 'translate' | 'price' | 'negotiate'): string {
    switch (action) {
      case 'translate':
        return "Translation completed successfully";
      case 'price':
        return "Price suggestions generated";
      case 'negotiate':
        return "Negotiation responses ready";
      default:
        return "Operation completed";
    }
  }

  /**
   * Get retry suggestions for failed operations
   */
  static getRetryMessage(action: 'translate' | 'price' | 'negotiate'): string {
    switch (action) {
      case 'translate':
        return "Try simplifying your message or check the language selection";
      case 'price':
        return "Verify the product name and quantity, then try again";
      case 'negotiate':
        return "Make sure your message is clear and try again";
      default:
        return "Please try again";
    }
  }
}

// Convenience functions for common use cases
export const getTranslationPrompt = (text: string, from: string, to: string) => 
  FrontendPrompts.buildTranslationDisplay(text, from, to);

export const getPricePrompt = (product: string, quantity: number) => 
  FrontendPrompts.buildPriceDiscoveryMessage(product, quantity);

export const getNegotiationPrompt = (product: string) => 
  FrontendPrompts.buildNegotiationMessage(product);

export const validateUserInput = (text: string, maxLength?: number) => 
  FrontendPrompts.validateInput(text, maxLength);

export const sanitizeAIOutput = (text: string) => 
  FrontendPrompts.sanitizeOutput(text);

export const formatError = (error: string, context?: string) => 
  FrontendPrompts.formatErrorMessage(error, context);

export default FrontendPrompts;