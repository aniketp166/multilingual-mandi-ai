import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';

interface PriceSuggestionRequest {
  product_name: string;
  quantity: number;
  current_price?: number;
  location?: string;
  language?: string;
}

interface PriceSuggestionResponse {
  min_price: number;
  max_price: number;
  recommended_price: number;
  reasoning: string;
  market_trend: 'rising' | 'falling' | 'stable';
  confidence: number;
}

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

    const client = new GoogleGenAI({ apiKey });

    const responseLanguage = language || 'en';
    const languageInstruction = responseLanguage !== 'en' 
      ? `Provide the reasoning in ${responseLanguage} language.` 
      : '';

    const prompt = `As a market analyst for Indian agricultural products, provide pricing recommendations:

Product: ${product_name}
Quantity: ${quantity} kg
Current Price: ₹${current_price || 'Not specified'}
Location: ${location || 'India'}

Requirements:
1. reasoning must be max 2 VERY SHORT sentences in ${responseLanguage}.
2. market_trend must be rising|falling|stable.

Format:
{
  "min_price": number,
  "max_price": number,
  "recommended_price": number,
  "reasoning": "string",
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
      const cleanJsonText = jsonText.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");
      const parsedResponse = JSON.parse(cleanJsonText);
      
      const priceSuggestionResponse: PriceSuggestionResponse = {
        min_price: parsedResponse.min_price || 20,
        max_price: parsedResponse.max_price || 60,
        recommended_price: parsedResponse.recommended_price || 40,
        reasoning: (parsedResponse.reasoning || 'AI-generated pricing based on market analysis').trim().replace(/^[n]\s+/, ""),
        market_trend: (parsedResponse.market_trend || 'stable').trim() as any,
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
