import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

Return ONLY a JSON object with this exact format:
{
  "suggestions": ["response1", "response2", "response3"],
  "tone": "friendly"
}`;

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (error) {
      console.error('Gemini error:', error);
      throw error;
    }

    let responseText = '';
    try {
      if (result && result.response) {
        responseText = result.response.text();
      } else {
        responseText = JSON.stringify(result);
      }
    } catch (textError) {
      console.error('Error extracting text:', textError);
      responseText = JSON.stringify(result);
    }
    
    let jsonText = responseText.trim();
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                      responseText.match(/```\n([\s\S]*?)\n```/);
    
    if (jsonMatch && jsonMatch[1]) {
      jsonText = jsonMatch[1].trim();
    } else {
      const objectMatch = responseText.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        jsonText = objectMatch[0];
      }
    }
    
    try {
      const parsedResponse = JSON.parse(jsonText);
      
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
        tone: parsedResponse.tone || 'friendly'
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
