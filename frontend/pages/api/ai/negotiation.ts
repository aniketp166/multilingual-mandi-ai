import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';

interface ConversationMessage {
  sender: 'buyer' | 'vendor';
  text: string;
  timestamp: string;
}

interface Product {
  name: string;
  price: number;
  quantity: number;
}

interface NegotiationRequest {
  product: Product;
  buyer_message: string;
  vendor_language: string;
  conversation_history: ConversationMessage[];
}

interface NegotiationResponse {
  suggestions: string[];
  context: string;
  tone: 'friendly' | 'professional' | 'firm';
}

interface ApiResponse {
  data?: NegotiationResponse;
  success: boolean;
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { product, buyer_message, vendor_language, conversation_history }: NegotiationRequest = req.body;

    if (!product || !buyer_message || !vendor_language) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: product, buyer_message, vendor_language'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return mock response for development
      const mockResponse: NegotiationResponse = {
        suggestions: [
          "Thank you for your interest! I can offer a competitive price for this quality product.",
          "Let me check what I can do for you. How about we meet in the middle?",
          "I appreciate your business. This is a fair price considering the current market conditions."
        ],
        context: "Professional negotiation response",
        tone: 'friendly'
      };

      return res.status(200).json({
        data: mockResponse,
        success: true,
        message: 'Using mock negotiation suggestions (API key not configured)'
      });
    }

    const genai = new GoogleGenAI({ apiKey });

    const conversationHistory = conversation_history
      .map(msg => `${msg.sender}: ${msg.text}`)
      .join('\n');

    const prompt = `You are helping a vendor in an Indian marketplace negotiate with a buyer. 

    Product: ${product.name} (₹${product.price}/kg, ${product.quantity}kg available)
    Conversation so far:
    ${conversationHistory}
    
    Latest buyer message: "${buyer_message}"
    
    Generate 3 professional, culturally appropriate responses for the vendor in ${vendor_language}. 
    The responses should be:
    1. Friendly and professional
    2. Aimed at closing the deal
    3. Respectful of Indian business culture
    
    Format as JSON:
    {
      "suggestions": ["response1", "response2", "response3"],
      "tone": "friendly|professional|firm"
    }`;

    let result;
    try {
      // Try with gemini-2.0-flash-exp first
      result = await genai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      });
    } catch (error) {
      // Fallback to gemini-1.5-flash
      result = await genai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      });
    }

    // Extract text - it's a property, not a method
    const responseText = result.text || '';
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = responseText;
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    }
    
    try {
      const parsedResponse = JSON.parse(jsonText);
      
      const negotiationResponse: NegotiationResponse = {
        suggestions: parsedResponse.suggestions || [
          "Thank you for your interest in our products.",
          "Let me see what I can offer you.",
          "I appreciate your business."
        ],
        context: "AI-generated negotiation assistance",
        tone: parsedResponse.tone || 'friendly'
      };

      return res.status(200).json({
        data: negotiationResponse,
        success: true
      });
    } catch (parseError) {
      console.error('Failed to parse negotiation response:', parseError);
      throw new Error('Failed to parse negotiation response');
    }

  } catch (error) {
    console.error('Negotiation API error:', error);
    
    // Fallback to mock response on error
    const mockResponse: NegotiationResponse = {
      suggestions: [
        "Thank you for your interest in our products.",
        "Let me see what I can offer you.",
        "I appreciate your business."
      ],
      context: "Fallback negotiation assistance",
      tone: 'friendly'
    };

    return res.status(200).json({
      data: mockResponse,
      success: true,
      message: 'Using fallback negotiation suggestions due to API error'
    });
  }
}
