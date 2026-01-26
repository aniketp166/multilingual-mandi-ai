import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';

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

    const genai = new GoogleGenAI({ apiKey });
    
    const prompt = `Translate the following text from ${source_language} to ${target_language}. 
    Only return the translated text, nothing else.
    
    Text to translate: "${text}"`;

    let result;
    try {
      // Using latest gemini-2.5-flash model
      result = await genai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.3,
          maxOutputTokens: 1000,
        }
      });
    } catch (error) {
      console.error('Gemini 2.5 Flash error:', error);
      throw error;
    }

    // Extract text safely from the @google/genai SDK result
    let translatedText = '';
    try {
      if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
        translatedText = result.candidates[0].content.parts[0].text;
      } else if (typeof result?.text === 'string') {
        translatedText = result.text;
      } else {
        translatedText = JSON.stringify(result);
      }
    } catch (textError) {
      console.error('Error extracting text from result:', textError);
      translatedText = String(result?.text || '');
    }

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
