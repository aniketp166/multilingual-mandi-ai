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

    const client = new GoogleGenAI({ apiKey });

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
      // Using latest gemini-2.5-flash model
      result = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          responseMimeType: 'application/json'
        }
      });
    } catch (error) {
      console.error('Gemini 2.5 Flash error:', error);
      throw error;
    }

    // Extract text safely from the @google/genai SDK result
    let responseText = '';
    try {
      // Try to get text using the standard candidate path
      if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = result.candidates[0].content.parts[0].text;
      } else if (typeof result?.text === 'string') {
        responseText = result.text;
      } else {
        responseText = JSON.stringify(result);
      }
    } catch (textError) {
      console.error('Error extracting text from result:', textError);
      responseText = JSON.stringify(result);
    }
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = responseText;
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                      responseText.match(/```\n([\s\S]*?)\n```/) ||
                      responseText.match(/{[\s\S]*}/);
    
    if (jsonMatch) {
      jsonText = jsonMatch[0]; // If it matched the whole object, use it
      if (jsonMatch[1]) jsonText = jsonMatch[1]; // If it matched the group, use that
    }
    
    try {
      const parsedResponse = JSON.parse(jsonText);
      
      // CRITICAL: Ensure suggestions are strings! 
      const rawSuggestions = parsedResponse.suggestions || [];
      const sanitizedSuggestions = Array.isArray(rawSuggestions) 
        ? rawSuggestions.map((s: any) => {
            if (typeof s === 'string') return s;
            if (typeof s === 'object' && s !== null) {
              return s.response || s.text || s.suggestion || JSON.stringify(s);
            }
            return String(s);
          })
        : ["Thank you for your interest in our products."];

      const negotiationResponse: NegotiationResponse = {
        suggestions: sanitizedSuggestions.length > 0 ? sanitizedSuggestions : [
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
      console.log('Original response text:', responseText);
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
