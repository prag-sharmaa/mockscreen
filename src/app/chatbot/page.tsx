'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastMessage: string;
  timestamp: Date;
}

const ChatbotPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'How to build a React app',
      messages: [
        { id: '1', type: 'user', content: 'How do I build a React app?', timestamp: new Date() },
        { id: '2', type: 'bot', content: 'To build a React app, you can use Create React App or Vite. Here\'s how with Create React App: npx create-react-app my-app', timestamp: new Date() }
      ],
      lastMessage: 'To build a React app, you can use Create React App or Vite...',
      timestamp: new Date()
    },
    {
      id: '2',
      title: 'JavaScript best practices',
      messages: [
        { id: '3', type: 'user', content: 'What are some JavaScript best practices?', timestamp: new Date() },
        { id: '4', type: 'bot', content: 'Some JavaScript best practices include: using const and let instead of var, writing clean and readable code, using meaningful variable names, and following the DRY principle.', timestamp: new Date() }
      ],
      lastMessage: 'Some JavaScript best practices include: using const and let...',
      timestamp: new Date()
    }
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    // Create new chat session if none exists
    if (!currentChat) {
      const newChat: ChatSession = {
        id: Date.now().toString(),
        title: currentMessage.substring(0, 30) + (currentMessage.length > 30 ? '...' : ''),
        messages: [userMessage],
        lastMessage: currentMessage,
        timestamp: new Date()
      };
      setCurrentChat(newChat);
      setChatHistory(prev => [newChat, ...prev]);
    } else {
      // Add message to current chat
      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, userMessage],
        lastMessage: currentMessage,
        timestamp: new Date()
      };
      setCurrentChat(updatedChat);
      setChatHistory(prev => 
        prev.map(chat => chat.id === currentChat.id ? updatedChat : chat)
      );
    }

    setCurrentMessage('');
    setIsLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `I understand you're asking about "${userMessage.content}". This is a simulated response from your AI chatbot. In a real implementation, this would connect to your AI service.`,
        timestamp: new Date()
      };

      if (currentChat) {
        const updatedChat = {
          ...currentChat,
          messages: [...currentChat.messages, userMessage, botMessage],
          lastMessage: botMessage.content,
          timestamp: new Date()
        };
        setCurrentChat(updatedChat);
        setChatHistory(prev => 
          prev.map(chat => chat.id === currentChat.id ? updatedChat : chat)
        );
      }
      setIsLoading(false);
    }, 1500);
  };

  const selectChat = (chat: ChatSession) => {
    setCurrentChat(chat);
  };

  const createNewChat = () => {
    setCurrentChat(null);
    setCurrentMessage('');
  };

  if (!user) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-slate-800 border-r border-slate-700 transition-all duration-300 overflow-hidden`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">Chat History</h2>
              <button
                onClick={createNewChat}
                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto p-2">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                onClick={() => selectChat(chat)}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  currentChat?.id === chat.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                <h3 className="font-medium truncate">{chat.title}</h3>
                <p className="text-sm opacity-75 truncate mt-1">{chat.lastMessage}</p>
                <p className="text-xs opacity-50 mt-1">
                  {chat.timestamp.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h1 className="text-white font-semibold">AI ChatBot</h1>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white text-sm font-medium">{user.name}</p>
              <p className="text-gray-400 text-xs">{user.email}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!currentChat ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to AI ChatBot</h2>
                <p className="text-gray-400 mb-6">Ask me anything! I'm here to help you with your questions.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <h3 className="text-white font-medium mb-2">💡 Suggestions</h3>
                    <p className="text-gray-400 text-sm">"How do I build a React app?"</p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <h3 className="text-white font-medium mb-2">🔧 Help</h3>
                    <p className="text-gray-400 text-sm">"What are JavaScript best practices?"</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            currentChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-gray-200 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-slate-700">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!currentMessage.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
