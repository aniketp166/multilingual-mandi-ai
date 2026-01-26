import type { NextApiRequest, NextApiResponse } from 'next';

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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
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
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const responseText = data.candidates[0].content.parts[0].text;
    
    try {
      const parsedResponse = JSON.parse(responseText);
      
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