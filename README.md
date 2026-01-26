# 🇮🇳 Multilingual Mandi - AI-Powered Local Trade Platform

> **26 Jan Prompt Challenge** - Building for a Viksit Bharat using Generative AI

A web platform empowering India's local vendors with AI-driven multilingual communication, price discovery, and negotiation tools.

**🌐 Live Demo:** [https://mandi-ai.aniketppatil.com/](https://mandi-ai.aniketppatil.com/)

**Demo live recording:** [AI Price Suggestion]
https://assets.aniketppatil.com/kiro-challenge/ai_suggested_real_pricing.mp4

## 🎯 Challenge Overview

**Theme:** Creating a real-time linguistic bridge for local trade  
**Goal:** Empower India's local markets with AI, making trade inclusive and efficient  
**Vision:** Technology that serves every Indian trader, regardless of language or location

## ✨ Key Features

- **💬 Real-Time Chat** - Instant buyer-vendor communication with multilingual support
- **🗣️ 8 Indian Languages** - Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada
- **💰 AI Price Discovery** - Smart pricing recommendations powered by Google Gemini
- **🤝 Negotiation Assistant** - AI-powered negotiation with smart reply suggestions
- **📊 Vendor Dashboard** - Product management with inventory tracking and chat inbox
- **🛒 Buyer Marketplace** - Browse products and contact vendors directly
- **📱 Mobile Responsive** - Optimized for smartphones and tablets

## 🛠️ Tech Stack

**Frontend:** Next.js 14, TypeScript, Tailwind CSS  
**AI:** Google Gemini API (gemini-2.0-flash-exp, gemini-1.5-flash)  
**Storage:** LocalStorage for client-side persistence  
**Deployment:** Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone and navigate
git clone https://github.com/aniketp166/multilingual-mandi-ai.git
cd multilingual-mandi-ai/frontend

# Install dependencies
npm install

# Configure environment
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Run development server
npm run dev
```

**Access:** http://localhost:3000

## 📖 Usage Guide

### For Vendors (`/dashboard`)
1. Set your preferred language
2. Add products with name, quantity, and price
3. Get AI-powered price suggestions
4. Monitor chat inbox for buyer inquiries
5. Respond with AI-generated negotiation suggestions

### For Buyers (`/buyer`)
1. Select your preferred language
2. Browse available products
3. Click "Contact Vendor" to start a chat
4. Negotiate prices with automatic translation

### Chat Features
- **Auto Translation** - Messages translated between buyer and vendor languages
- **AI Suggestions** - Smart reply suggestions for vendors during negotiations
- **Message History** - All conversations saved in LocalStorage
- **Show Original** - Toggle between translated and original text

## 🎨 Design Philosophy

**Bharat-First Approach**
- Multilingual by design (8+ Indian languages)
- Simple interfaces for traditional traders
- Mobile accessibility for basic smartphones

**AI for Good**
- Democratizing technology for local vendors
- Transparent pricing and fair trade
- Bridging traditional and digital commerce

## 📱 Implemented Features

✅ Vendor dashboard with product management  
✅ Buyer marketplace with search  
✅ Real-time chat with translation  
✅ AI price suggestions  
✅ Negotiation assistance  
✅ LocalStorage persistence  
✅ Mobile-first responsive design  
✅ Secure API routes

## 📄 License

MIT License - Built with ❤️ for the 26 Jan Prompt Challenge

---

**🇮🇳 Jai Hind! Building for a Viksit Bharat**  
*"Empowering local markets, one conversation at a time"*
