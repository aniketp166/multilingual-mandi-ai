// Core data models for Multilingual Mandi Vendor Assistant

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  currency: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  quantity: number;
  price: number;
  language: string;
}

export interface Message {
  id: string;
  sender: "vendor" | "buyer";
  text: string;
  translated_text?: string;
  language: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  product_id: string;
  vendor_id: string;
  buyer_id: string;
  messages: Message[];
  status: "active" | "closed";
  created_at: string;
}

export interface PriceSuggestion {
  min_price: number;
  max_price: number;
  recommended_price: number;
  reasoning: string;
  market_trend: "rising" | "falling" | "stable";
  confidence: number;
}

// API Request/Response Types
export interface TranslationRequest {
  text: string;
  source_language: string;
  target_language: string;
}

export interface TranslationResponse {
  translated_text: string;
  original_text: string;
  source_language: string;
  target_language: string;
  confidence: number;
}

export interface PriceSuggestionRequest {
  product_name: string;
  quantity: number;
  current_price?: number;
  location?: string;
}

export interface PriceSuggestionResponse {
  min_price: number;
  max_price: number;
  recommended_price: number;
  reasoning: string;
  market_trend: "rising" | "falling" | "stable";
  confidence: number;
}

export interface NegotiationRequest {
  product: Product;
  conversation_history: Message[];
  buyer_message: string;
  vendor_language: string;
}

export interface NegotiationResponse {
  suggestions: string[];
  context: string;
  tone: "friendly" | "professional" | "firm";
}

// LocalStorage Schema
export interface LocalStorageData {
  products: Product[];
  user_preferences: {
    language: string;
    currency: string;
    location?: string;
  };
  chat_sessions: ChatSession[];
  version: string;
}

// UI State Types
export interface AppState {
  products: Product[];
  currentUser: {
    language: string;
    currency: string;
  };
  ui: {
    isAddProductModalOpen: boolean;
    isPriceSuggestionModalOpen: boolean;
    selectedProduct: Product | null;
    loading: boolean;
    error: string | null;
  };
  chat: {
    activeSessions: ChatSession[];
    currentSession: ChatSession | null;
    suggestions: string[];
  };
}

// Sample Products for Demo
export const SAMPLE_PRODUCTS = [
  "Tomato",
  "Onion", 
  "Potato",
  "Banana",
  "Apple"
] as const;

export type SampleProduct = typeof SAMPLE_PRODUCTS[number];

// Supported Languages
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" }
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]["code"];