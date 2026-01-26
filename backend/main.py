from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Multilingual Mandi API", version="1.0.0")

# CORS middleware to allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Multilingual Mandi API - Empowering Local Trade with AI",
        "status": "running",
        "challenge": "26 Jan Prompt Challenge - Viksit Bharat",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Multilingual Mandi Backend"}

@app.get("/api/test")
async def test_endpoint():
    return {
        "message": "Backend connection successful!",
        "features": [
            "Real-time multilingual communication",
            "AI-driven price discovery", 
            "Smart negotiation assistance",
            "Vendor empowerment tools"
        ]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)