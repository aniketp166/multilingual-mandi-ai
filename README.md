# 🇮🇳 Multilingual Mandi - AI-Powered Local Trade Platform

> **26 Jan Prompt Challenge** - Building for a Viksit Bharat using Generative AI

A web platform empowering India's local vendors with AI-driven multilingual communication, price discovery, and negotiation tools.

**🌐 Live Demo:** [https://mandi-ai.aniketppatil.com/](https://mandi-ai.aniketppatil.com/)

**📹 Demo Videos:**
- [Price Translation & Negotiation](https://assets.aniketppatil.com/kiro-challenge/price_translated_negotiation.mp4)
- [AI Price Suggestion](https://assets.aniketppatil.com/kiro-challenge/ai_suggested_real_pricing.mp4)
- [Message Translation](https://assets.aniketppatil.com/kiro-challenge/message_translate.mp4)

---

## 🤖 Advanced AI Features

Our platform leverages **Gemini 2.5 Flash** (the flagship model) to provide a suite of intelligent tools designed specifically for the Indian marketplace:

1.  **🌐 Real-Time Linguistic Bridge**: Seamless, automatic translation between **8+ Indian languages** (Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, and English). Buyers and vendors can chat in their native tongues without ever knowing a language barrier exists.
2.  **📈 Grounded Price Discovery**: Smart pricing recommendations that aren't just guesses. Our AI uses **Google Search Grounding** to look up real-time market prices across India, providing vendors with Min/Max ranges and detailed reasoning.
3.  **🤝 Intelligent Negotiation Assistant**: To help local vendors close deals faster, the AI analyzes the chat history and suggests **3 contextually aware replies** in the vendor's native language.
4.  **🧠 Context-Aware Conversations**: Unlike simple translators, our AI maintains the "state" of the negotiation. It knows if the buyer is asking for more quantity than is available and adjusts its suggestions accordingly.
5.  **⚡ Ultra-Fast Processing**: Optimized for low-latency interactions, ensuring that AI-powered trade feels smooth and professional.
6.  **🔒 Secure & Sanitized Intelligence**: Every AI response passes through a sanitation layer to ensure clean, structured data and professional communication standards.

---

## ✨ Key UX Features

- **📊 Comprehensive Vendor Dashboard**: Manage inventory, monitor active chats, and see real-time valuation of your stock.
- **🛒 Inclusive Buyer Marketplace**: A clean, accessible interface for buyers to find local produce and connect with vendors.
- **📱 Bharat-First Design**: Optimized for mobile performance, considering the reality of local markets and traditional traders.
- **🔄 Live Sync & persistence**: Powered by resilient LocalStorage logic to ensure conversation history and products are never lost.

---

## 🛠️ Tech Stack

**Frontend:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion  
**AI Platform:** Google Gemini 2.5 Flash (API-Grounded)  
**Storage:** Resilient LocalStorage Manager with Quota Handling & Caching  
**Deployment:** Vercel

---

## 🚀 Quick Start

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

**Access:** [http://localhost:3000](http://localhost:3000)

---

## 🎨 Our Vision

We believe in technology that serves every Indian citizen. By bridging the linguistic divide, we are making commerce **inclusive, transparent, and efficient**. We are building the digital infrastructure for a **Viksit Bharat**.

**BEST of LUCK!**

---

**🇮🇳 Jai Hind! Building for a Viksit Bharat**  
*"Empowering local markets, one conversation at a time"*
