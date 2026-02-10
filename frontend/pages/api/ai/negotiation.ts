import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';
import { parseGeminiResponse } from '../../../src/utils/ai-helpers';
import { NegotiationRequest, NegotiationResponse } from '../../../src/types';

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

    if (buyer_message.length > 5000) {
      return res.status(400).json({
        success: false,
        error: 'Message too long (max 5000 characters)'
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

    const languageNames: Record<string, string> = {
      'en': 'English',
      'hi': 'Hindi',
      'ta': 'Tamil',
      'te': 'Telugu',
      'bn': 'Bengali',
      'mr': 'Marathi',
      'gu': 'Gujarati',
      'kn': 'Kannada'
    };

    const client = new GoogleGenAI({ apiKey });
    const languageName = languageNames[vendor_language] || 'English';

    const conversationHistory = conversation_history
      .map(msg => `${msg.sender}: ${msg.text}`)
      .join('\n');

    const prompt = `You are a vendor in an Indian marketplace negotiating with a buyer. 

Product: ${product.name} (₹${product.price}/kg, ${product.quantity}kg available)
Conversation:
${conversationHistory}
Buyer: "${buyer_message}"

Generate 3 VERY SHORT (max 1 sentence each) professional responses in ${languageName}.
Return as JSON:
{
  "suggestions": ["short message in ${languageName}", "another short message in ${languageName}", "one more in ${languageName}"],
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

    // Use centralized parser
    try {
      const parsedResponse = parseGeminiResponse<NegotiationResponse>(result);
      
      const negotiationResponse: NegotiationResponse = {
        suggestions: parsedResponse.suggestions || [],
        context: parsedResponse.context || "AI-generated negotiation assistance",
        tone: (parsedResponse.tone || 'friendly') as "friendly" | "professional" | "firm"
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
