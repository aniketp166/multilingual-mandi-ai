export interface GeminiResponseCandidate {
  content?: {
    parts?: { text: string }[];
  };
}

export interface GeminiResponse {
  candidates?: GeminiResponseCandidate[];
  text?: string | { response?: string; text?: string; [key: string]: unknown };
}

/**
 * Robustly parses a JSON response from Gemini, handling markdown blocks, 
 * control characters, and various response formats.
 */
export function parseGeminiResponse<T>(result: unknown): T {
  const res = result as any;
  let responseText = '';

  // Extract text from varies Gemini response structures
  if (res?.candidates?.[0]?.content?.parts?.[0]?.text) {
    responseText = res.candidates[0].content.parts[0].text;
  } else if (typeof res?.text === 'string') {
    responseText = res.text;
  } else if (res?.text && typeof res.text === 'object') {
    // Handle case where text is already an object or specific wrapper
    const textObj = res.text as Record<string, unknown>;
    responseText = (textObj.response as string) || (textObj.text as string) || JSON.stringify(res.text);
  } else {
    responseText = String(res?.text || '');
  }

  // 1. Try extracting from Markdown JSON block
  let jsonText = responseText.trim();
  const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  
  if (jsonMatch && jsonMatch[1]) {
    jsonText = jsonMatch[1].trim();
  } else {
    // 2. Try extracting raw object structure if no markdown
    const objectMatch = responseText.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      jsonText = objectMatch[0];
    }
  }

  // 3. Clean control characters that break JSON.parse
  // Removing null bytes, control chars, but keeping line breaks/tabs if valid in JSON strings
  const cleanJsonText = jsonText.replace(/[\u0000-\u001F\u007F-\u009F]/g, (match) => {
    // Keep valid JSON whitespace
    if (match === '\n' || match === '\r' || match === '\t') return match;
    return " ";
  });

  try {
    return JSON.parse(cleanJsonText) as T;
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    console.error('Original Text:', responseText);
    console.error('Cleaned Text:', cleanJsonText);
    throw new Error('Failed to parse AI response');
  }
}
