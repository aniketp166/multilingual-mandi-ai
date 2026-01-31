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

    if (text.length > 5000) {
      return res.status(400).json({
        success: false,
        error: 'Text too long (max 5000 characters)'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
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

    const client = new GoogleGenAI({ apiKey });
    
    const prompt = `Translate the following text from ${source_language} to ${target_language}. 
    Only return the translated text, nothing else.
    
    Text to translate: "${text}"`;

    let result;
    try {
      result = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        }
      });
    } catch (error) {
      console.error('Gemini error:', error);
      throw error;
    }

    let translatedText = '';
    if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
      translatedText = result.candidates[0].content.parts[0].text;
    } else if (typeof result?.text === 'string') {
      translatedText = result.text;
    } else if (result?.text && typeof result.text === 'object') {
      translatedText = ((result.text as Record<string, unknown>).response as string) || ((result.text as Record<string, unknown>).text as string) || JSON.stringify(result.text);
    } else {
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
