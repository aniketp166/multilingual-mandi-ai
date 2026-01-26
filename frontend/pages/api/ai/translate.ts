import type { NextApiRequest, NextApiResponse } from 'next';

interface TranslationRequest {
  text: string;
  source_language: string;
  target_language: string;
}

interface TranslationResponse {
  translated_text: string;
  original_text: string;
  source_language: string;
  target_language: string;
  confidence: number;
}

interface ApiResponse {
  data?: TranslationResponse;
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
    const { text, source_language, target_language }: TranslationRequest = req.body;

    if (!text || !source_language || !target_language) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: text, source_language, target_language'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return mock response for development
      const mockResponse: TranslationResponse = {
        translated_text: `[MOCK] Translated: ${text}`,
        original_text: text,
        source_language,
        target_language,
        confidence: 0.95
      };

      return res.status(200).json({
        data: mockResponse,
        success: true,
        message: 'Using mock translation (API key not configured)'
      });
    }

    const prompt = `Translate the following text from ${source_language} to ${target_language}. 
    Only return the translated text, nothing else.
    
    Text to translate: "${text}"`;

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

    const translatedText = data.candidates[0].content.parts[0].text;

    const translationResponse: TranslationResponse = {
      translated_text: translatedText.trim(),
      original_text: text,
      source_language,
      target_language,
      confidence: 0.9
    };

    return res.status(200).json({
      data: translationResponse,
      success: true
    });

  } catch (error) {
    console.error('Translation API error:', error);
    
    // Fallback to mock response on error
    const mockResponse: TranslationResponse = {
      translated_text: `[FALLBACK] ${req.body.text}`,
      original_text: req.body.text,
      source_language: req.body.source_language,
      target_language: req.body.target_language,
      confidence: 0.5
    };

    return res.status(200).json({
      data: mockResponse,
      success: true,
      message: 'Using fallback translation due to API error'
    });
  }
}