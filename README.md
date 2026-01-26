# 🇮🇳 Multilingual Mandi - Real-time Linguistic Bridge for Local Trade

> **26 Jan Prompt Challenge Submission** - Building for a Viksit Bharat using Generative AI

A revolutionary web platform empowering India's local vendors with AI-driven price discovery and negotiation tools, breaking language barriers to make trade more inclusive, transparent, and efficient.

## 🎯 Challenge Overview

**Theme:** The Multilingual Mandi Challenge - Creating a real-time linguistic bridge for local trade  
**Goal:** Empower India's local markets with AI, making trade inclusive, transparent, and efficient  
**Vision:** Building technology that serves every Indian trader, regardless of language or location

## 🚀 Features (Planned)

- **🗣️ Real-time Multilingual Communication** - Instant translation between Hindi, English, and regional languages
- **💰 AI-Driven Price Discovery** - Smart pricing recommendations based on market data
- **🤝 Negotiation Assistant** - AI-powered negotiation support for fair deals
- **📊 Vendor Dashboard** - Comprehensive vendor management and analytics
- **💬 Live Chat & Translation** - Real-time communication with translation overlay
- **📈 Market Insights** - Data-driven market trends and pricing analytics

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern, component-based UI
- **Material-UI (MUI)** - Clean, accessible design system
- **Socket.IO Client** - Real-time communication
- **Axios** - API integration
- **React Router** - Navigation

### Backend
- **Python FastAPI** - High-performance API framework
- **WebSockets** - Real-time bidirectional communication
- **Google Translate API** - Multilingual support
- **OpenAI GPT** - AI-powered features
- **SQLite/PostgreSQL** - Data persistence
- **Pandas** - Data analysis and insights

## 🏗️ Project Structure

```
multilingual-mandi/
├── frontend/              # React.js application
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   └── App.js        # Main app component
│   └── package.json
├── backend/               # Python FastAPI server
│   ├── main.py           # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   └── venv/            # Virtual environment (ignored)
├── .kiro/                # Kiro IDE configuration
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 16+** and npm
- **Python 3.8+** and pip
- Git

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/multilingual-mandi.git
cd multilingual-mandi
```

2. **Setup Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac
pip install -r requirements.txt
python main.py
```

3. **Setup Frontend** (in new terminal)
```bash
cd frontend
npm install
npm start
```

4. **Access the Application**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 🎨 Design Philosophy

### Bharat-First Approach
- **Multilingual by Design** - Hindi, English, and regional language support
- **Inclusive UX** - Simple interfaces for traditional traders
- **Cultural Sensitivity** - Respecting Indian trading customs and practices
- **Accessibility** - Works on basic smartphones and slow internet

### AI for Good
- **Democratizing Technology** - Making advanced AI accessible to local vendors
- **Fair Trade** - Transparent pricing and negotiation assistance
- **Digital Inclusion** - Bridging the gap between traditional and digital commerce
- **Empowerment** - Tools that enhance rather than replace human judgment

## 🌟 Key Innovation Areas

1. **Language Intelligence** - Context-aware translation for trade terminology
2. **Price Fairness** - AI ensuring equitable pricing for all parties
3. **Cultural Bridge** - Technology that respects and enhances traditional trading
4. **Scalable Impact** - Solutions that work from village markets to urban centers

## 📱 Current Status - Phase 1 Complete

✅ **Basic Setup**
- Project structure with frontend/backend separation
- React app with routing (Home, About, Contact)
- Python FastAPI server with CORS
- Frontend-backend connectivity test
- Git repository with proper .gitignore

🔄 **Next Phases**
- Phase 2: Core UI Foundation
- Phase 3: Language Support Integration
- Phase 4: Real-time Features
- Phase 5: AI Services Integration

## 🤝 Contributing

This project is built for the **26 Jan Prompt Challenge**. While it's a competition submission, we welcome:
- Bug reports and feature suggestions
- Code improvements and optimizations
- Documentation enhancements
- Testing and feedback

## 📄 License

MIT License - Built with ❤️ for the 26 Jan Prompt Challenge

## 🙏 Acknowledgments

- **AI for Bharat** - For organizing this inspiring challenge
- **Indian Traders** - The real heroes we're building for
- **Open Source Community** - For the amazing tools and libraries

---

**🇮🇳 Jai Hind! Building for a Viksit Bharat - Where Technology Serves Every Indian** 

*"Empowering local markets, one conversation at a time"*