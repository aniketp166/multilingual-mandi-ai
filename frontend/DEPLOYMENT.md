# Deployment Guide - Multilingual Mandi

## Quick Deployment to Vercel

### Prerequisites
- Vercel account (free tier works)
- Gemini API key from Google AI Studio

### Steps

1. **Get Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key for later use

2. **Deploy to Vercel**
   - Fork/clone this repository
   - Connect your GitHub repo to Vercel
   - Or use Vercel CLI: `vercel --prod`

3. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   NEXT_PUBLIC_ENVIRONMENT=production
   ```

4. **Deploy**
   - Push to main branch or trigger manual deployment
   - Vercel will automatically build and deploy

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your Gemini API key
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

### Features Available

✅ **Core Features (Working)**
- Product management with LocalStorage
- Mobile-responsive design
- AI-powered price suggestions (with Gemini API)
- Modern UI with Tailwind CSS

🚧 **Coming Soon**
- Multi-language translation
- Chat and negotiation system
- Advanced analytics

### Architecture

- **Frontend**: Next.js 16.1.1 + TypeScript + Tailwind CSS
- **Database**: LocalStorage (client-side)
- **AI**: Direct Gemini API integration
- **Deployment**: Vercel (serverless)

### Performance

- Static site generation for optimal performance
- Client-side data persistence
- Responsive design for all devices
- Progressive Web App capabilities

### Support

For issues or questions, check the main README.md file or create an issue in the repository.