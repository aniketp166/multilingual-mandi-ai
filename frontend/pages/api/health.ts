import type { NextApiRequest, NextApiResponse } from 'next';

interface HealthResponse {
  status: string;
  timestamp: string;
  environment: string;
  gemini_configured: boolean;
  version: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  const geminiConfigured = !!process.env.GEMINI_API_KEY;
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    gemini_configured: geminiConfigured,
    version: '1.0.0'
  });
}