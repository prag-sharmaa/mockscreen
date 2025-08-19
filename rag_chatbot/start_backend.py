#!/usr/bin/env python3
"""
Startup script for the RAG Chatbot Backend
"""

import uvicorn
import sys
import os

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import fastapi
        import langchain
        import langchain_ollama
        import langchain_community
        import gpt4all
        import faiss
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please install dependencies with: pip install -r requirements.txt")
        return False

def check_ollama():
    """Check if Ollama is running and Mistral model is available"""
    try:
        import requests
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json().get("models", [])
            mistral_available = any("mistral" in model.get("name", "").lower() for model in models)
            if mistral_available:
                print("✅ Ollama is running and Mistral model is available")
                return True
            else:
                print("⚠️  Ollama is running but Mistral model not found")
                print("Please run: ollama pull mistral")
                return False
        else:
            print("❌ Ollama is not responding")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to Ollama: {e}")
        print("Please start Ollama first: ollama serve")
        return False

def check_vectorstore():
    """Check if vectorstore files exist"""
    if os.path.exists("vectorstore/index.faiss") and os.path.exists("vectorstore/index.pkl"):
        print("✅ Vector store files found")
        return True
    else:
        print("❌ Vector store files not found")
        print("Please run: python save_index.py")
        return False

def main():
    print("🚀 Starting RAG Chatbot Backend...")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Check Ollama
    if not check_ollama():
        sys.exit(1)
    
    # Check vectorstore
    if not check_vectorstore():
        sys.exit(1)
    
    print("=" * 50)
    print("🎯 Starting FastAPI server...")
    print("📡 Backend will be available at: http://localhost:8000")
    print("🔗 Frontend can connect at: http://localhost:3000")
    print("=" * 50)
    
    # Start the server
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main() 