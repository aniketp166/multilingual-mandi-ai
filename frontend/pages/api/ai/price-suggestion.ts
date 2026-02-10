import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';
import { parseGeminiResponse } from '../../../src/utils/ai-helpers';
import { PriceSuggestionRequest, PriceSuggestionResponse } from '../../../src/types';

interface ApiResponse {
  data?: PriceSuggestionResponse;
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
    const { product_name, quantity, current_price, location, language }: PriceSuggestionRequest = req.body;

    if (!product_name || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: product_name, quantity'
      });
    }

    if (product_name.length > 200) {
      return res.status(400).json({
        success: false,
        error: 'Product name too long (max 200 characters)'
      });
    }

    if (quantity < 0 || quantity > 100000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid quantity (must be between 0 and 100000)'
      });
    }

    if (location && location.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Location too long (max 100 characters)'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const mockResponse: PriceSuggestionResponse = {
        min_price: Math.max(1, current_price ? current_price * 0.8 : 20),
        max_price: current_price ? current_price * 1.2 : 60,
        recommended_price: current_price ? current_price * 1.05 : 40,
        reasoning: `Based on market analysis for ${product_name}, considering current supply and demand factors.`,
        market_trend: 'stable',
        confidence: 0.85
      };

      return res.status(200).json({
        data: mockResponse,
        success: true,
        message: 'Using mock price suggestion (API key not configured)'
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

    const responseLanguage = language || 'en';
    const responseLanguageName = languageNames[responseLanguage] || 'English';

    const prompt = `As a market analyst for Indian agricultural products, provide pricing recommendations using current market data.

Product: ${product_name}
Quantity: ${quantity} kg
Current Price: ₹${current_price || 'Not specified'}
Location: ${location || 'India'}

Requirements:
1. reasoning MUST be in ${responseLanguageName}. Do NOT use English if the language is not English.
2. reasoning must be max 2 VERY SHORT sentences.
3. market_trend must be rising|falling|stable.
4. Use current market data from search results.

Format:
{
  "min_price": number,
  "max_price": number,
  "recommended_price": number,
  "reasoning": "string in ${responseLanguageName}",
  "market_trend": "string"
}`;

    let result;
    try {
      result = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.4,
          maxOutputTokens: 2048,
          tools: [{ googleSearch: {} }]
        }
      });
    } catch (error) {
      console.error('Gemini error:', error);
      throw error;
    }

    try {
      const parsedResponse = parseGeminiResponse<PriceSuggestionResponse>(result);
      
      const priceSuggestionResponse: PriceSuggestionResponse = {
        min_price: parsedResponse.min_price || 20,
        max_price: parsedResponse.max_price || 60,
        recommended_price: parsedResponse.recommended_price || 40,
        reasoning: (parsedResponse.reasoning || 'AI-generated pricing based on market analysis').trim().replace(/^[n]\s+/, ""),
        market_trend: (parsedResponse.market_trend || 'stable').trim() as PriceSuggestionResponse['market_trend'],
        confidence: 0.85
      };

      return res.status(200).json({
        data: priceSuggestionResponse,
        success: true
      });
    } catch (parseError) {
      console.error('Failed to parse price suggestion response:', parseError);
      throw new Error('Failed to parse price suggestion response');
    }

  } catch (error) {
    console.error('Price suggestion API error:', error);
    
    const mockResponse: PriceSuggestionResponse = {
      min_price: Math.max(1, req.body.current_price ? req.body.current_price * 0.8 : 20),
      max_price: req.body.current_price ? req.body.current_price * 1.2 : 60,
      recommended_price: req.body.current_price ? req.body.current_price * 1.05 : 40,
      reasoning: `Fallback pricing for ${req.body.product_name} based on standard market calculations.`,
      market_trend: 'stable',
      confidence: 0.5
    };

    return res.status(200).json({
      data: mockResponse,
      success: true,
      message: 'Using fallback price suggestion due to API error'
    });
  }
}
