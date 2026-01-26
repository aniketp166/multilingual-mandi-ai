import type { NextApiRequest, NextApiResponse } from 'next';

interface PriceSuggestionRequest {
  product_name: string;
  quantity: number;
  current_price?: number;
  location?: string;
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
    const { product_name, quantity, current_price, location }: PriceSuggestionRequest = req.body;

    if (!product_name || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: product_name, quantity'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return mock response for development
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

    const prompt = `As a market analyst for Indian agricultural products, provide pricing recommendations for the following:

    Product: ${product_name}
    Quantity: ${quantity} kg
    Current asking price: ₹${current_price || 'Not specified'}
    Location: ${location || 'India'}

    Please provide:
    1. Minimum fair price per kg
    2. Maximum reasonable price per kg  
    3. Recommended selling price per kg
    4. Brief reasoning (2-3 sentences)
    5. Market trend (rising/falling/stable)

    Format your response as JSON:
    {
      "min_price": number,
      "max_price": number,
      "recommended_price": number,
      "reasoning": "string",
      "market_trend": "rising|falling|stable"
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
      
      const priceSuggestionResponse: PriceSuggestionResponse = {
        min_price: parsedResponse.min_price || 20,
        max_price: parsedResponse.max_price || 60,
        recommended_price: parsedResponse.recommended_price || 40,
        reasoning: parsedResponse.reasoning || 'AI-generated pricing based on market analysis',
        market_trend: parsedResponse.market_trend || 'stable',
        confidence: 0.85
      };

      return res.status(200).json({
        data: priceSuggestionResponse,
        success: true
      });
    } catch (parseError) {
      throw new Error('Failed to parse price suggestion response');
    }

  } catch (error) {
    console.error('Price suggestion API error:', error);
    
    // Fallback to mock response on error
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