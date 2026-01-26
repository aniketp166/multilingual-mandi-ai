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

    const prompt = `You are a vendor in an Indian marketplace negotiating with a buyer. 

Product: ${product.name} (₹${product.price}/kg, ${product.quantity}kg available)
Conversation:
${conversationHistory}
Buyer: "${buyer_message}"

Generate 3 VERY SHORT (max 1 sentence each) professional responses in ${vendor_language}.
Return as JSON:
{
  "suggestions": ["short_res1", "short_res2", "short_res3"],
  "tone": "friendly"
}`;

    let result;
    try {
      result = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.4,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
        }
      });
    } catch (error) {
      console.error('Gemini error:', error);
      throw error;
    }

    let responseText = '';
    if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
      responseText = result.candidates[0].content.parts[0].text;
    } else if (typeof result?.text === 'string') {
      responseText = result.text;
    } else if (result?.text && typeof result.text === 'object') {
      responseText = (result.text as any).response || (result.text as any).text || JSON.stringify(result.text);
    } else {
      responseText = String(result?.text || '');
    }
    
    let jsonText = responseText.trim();
    
    // Improved JSON extraction regex
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (jsonMatch && jsonMatch[1]) {
      jsonText = jsonMatch[1].trim();
    } else {
      const objectMatch = responseText.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        jsonText = objectMatch[0];
      }
    }
    
    try {
      // Clean potential control characters that break JSON.parse
      const cleanJsonText = jsonText.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");
      const parsedResponse = JSON.parse(cleanJsonText);
      
      const rawSuggestions = parsedResponse.suggestions || [];
      const sanitizedSuggestions = Array.isArray(rawSuggestions) 
        ? rawSuggestions.map((s: any) => {
            if (typeof s === 'string') return s;
            if (typeof s === 'object' && s !== null) {
              return s.response || s.text || s.suggestion || JSON.stringify(s);
            }
            return String(s);
          }).filter((s: string) => s && s.length > 0)
        : [];

      const negotiationResponse: NegotiationResponse = {
        suggestions: sanitizedSuggestions.length > 0 ? sanitizedSuggestions : [
          "Thank you for your interest in our products.",
          "Let me see what I can offer you.",
          "I appreciate your business."
        ],
        context: "AI-generated negotiation assistance",
        tone: (parsedResponse.tone || 'friendly').trim()
      };

      return res.status(200).json({
        data: negotiationResponse,
        success: true
      });
    } catch (parseError) {
      console.error('Failed to parse negotiation response:', parseError);
      console.error('Response text was:', responseText);
      throw new Error('Failed to parse negotiation response');
    }

  } catch (error) {
    console.error('Negotiation API error:', error);
    
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
