# RAG Chatbot Integration Guide

This guide explains how to run the RAG chatbot backend with your Next.js frontend.

## 🏗️ Architecture

```
Frontend (Next.js) ←→ API Route ←→ Python Backend (FastAPI) ←→ RAG System
     Port 3000           Port 3000         Port 8000
```

## 🚀 Quick Start

### 1. Start the Python Backend

```bash
cd rag_chatbot

# Install dependencies (if not already done)
pip install -r requirements.txt

# Make sure Ollama is running and Mistral model is available
ollama serve
ollama pull mistral

# Start the backend
python start_backend.py
```

The backend will be available at: `http://localhost:8000`

### 2. Start the Next.js Frontend

```bash
# In a new terminal, from the root directory
npm run dev
# or
yarn dev
```

The frontend will be available at: `http://localhost:3000`

### 3. Test the Integration

1. Navigate to `http://localhost:3000/chatbot`
2. Ask questions about the CCAC technical guidance documents
3. The system will use the RAG backend to provide answers

## 🔧 Configuration

### Backend Configuration

- **Port**: 8000 (configurable in `start_backend.py`)
- **Model**: Mistral (via Ollama)
- **Vector Store**: FAISS with GPT4All embeddings
- **CORS**: Enabled for `localhost:3000`

### Frontend Configuration

- **API Endpoint**: `/api/chat` (proxies to `localhost:8000/ask`)
- **Error Handling**: Graceful fallback with user-friendly messages

## 📋 Prerequisites

### Python Backend
- Python 3.8+
- Ollama with Mistral model
- All dependencies in `requirements.txt`

### Frontend
- Node.js 16+
- Next.js 13+

## 🐛 Troubleshooting

### Backend Issues

1. **"Ollama not responding"**
   ```bash
   ollama serve
   ```

2. **"Mistral model not found"**
   ```bash
   ollama pull mistral
   ```

3. **"Vector store files not found"**
   ```bash
   python save_index.py
   ```

4. **"Missing dependencies"**
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Issues

1. **"Failed to get response from AI service"**
   - Check if backend is running on port 8000
   - Check browser console for detailed errors

2. **CORS errors**
   - Ensure backend CORS is configured for `localhost:3000`
   - Check if backend is accessible at `http://localhost:8000`

### Network Issues

1. **Port conflicts**
   - Change backend port in `start_backend.py`
   - Update API route in `src/app/api/chat/route.ts`

2. **Firewall issues**
   - Allow connections on ports 3000 and 8000
   - Check Windows Defender settings

## 🔍 Testing

### Test Backend Directly

```bash
curl -X POST http://localhost:8000/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What are pneumatic controllers?"}'
```

### Test Frontend API

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What are pneumatic controllers?"}'
```

## 📊 Monitoring

### Backend Logs
- Check terminal where `start_backend.py` is running
- Look for `[QUESTION]`, `[SMALL TALK]`, `[BLOCKED]` messages

### Frontend Logs
- Open browser developer tools
- Check Console and Network tabs
- Monitor API calls to `/api/chat`

## 🔄 Development Workflow

1. **Backend Changes**: Restart `start_backend.py`
2. **Frontend Changes**: Next.js auto-reloads
3. **API Changes**: Both may need restart

## 📝 Example Questions

Try these questions to test the system:

- "What are pneumatic controllers?"
- "How do glycol dehydrators work?"
- "What are the types of pneumatic devices?"
- "How to measure methane emissions?"
- "What is the CCAC Oil and Gas Methane Partnership?"

## 🎯 Next Steps

- Add authentication to the API
- Implement streaming responses
- Add file upload processing
- Enhance error handling
- Add response caching 