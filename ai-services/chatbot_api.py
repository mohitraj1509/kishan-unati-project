from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import uvicorn
import os
from dotenv import load_dotenv

# Import only the chatbot components
from chatbot import ChatbotHandler

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Kisan Unnati Chatbot API",
    description="AI-powered agricultural chatbot for farmers",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize chatbot handler
chatbot_handler = ChatbotHandler()

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    intent: str
    confidence: float
    suggested_actions: Optional[List[str]] = None
    follow_up_question: Optional[str] = None

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Kisan Unnati Chatbot API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "chatbot"}

@app.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """AI-powered agricultural chatbot"""
    try:
        response = chatbot_handler.process_message(
            message=request.message,
            context=request.context,
            user_id=request.user_id
        )

        return ChatResponse(**response)
    except Exception as e:
        print(f"Chat processing error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

@app.get("/chat/suggestions")
async def get_chat_suggestions():
    """Get suggested questions for the chatbot"""
    suggestions = [
        "What crops should I grow in my area?",
        "How can I identify plant diseases?",
        "Tell me about government schemes for farmers",
        "What are the best farming practices?",
        "How does weather affect my crops?",
        "I need help with soil management"
    ]
    return {"suggestions": suggestions}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"Starting Kisan Unnati Chatbot API on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)