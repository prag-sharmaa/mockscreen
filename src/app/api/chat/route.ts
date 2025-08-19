import { NextRequest, NextResponse } from 'next/server';

const RAG_API_URL = 'http://127.0.0.1:8000'; // Your Python FastAPI server

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    // Forward the request to the Python RAG backend
    const response = await fetch(`${RAG_API_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`RAG API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      answer: data.answer,
      success: true
    });

  } catch (error) {
    console.error('Error calling RAG API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get response from AI service',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 