'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  file?: {
    name: string;
    size: number;
    type: string;
    url?: string;
  };
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!currentMessage.trim() && !selectedFile) || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage || `Uploaded file: ${selectedFile?.name}`,
      timestamp: new Date(),
      file: selectedFile ? {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      } : undefined
    };

    // Create new chat session if none exists
    if (!currentChat) {
      const newChat: ChatSession = {
        id: Date.now().toString(),
        title: currentMessage.substring(0, 30) + (currentMessage.length > 30 ? '...' : '') || `File: ${selectedFile?.name}`,
        messages: [userMessage],
        lastMessage: currentMessage || `Uploaded file: ${selectedFile?.name}`,
        timestamp: new Date()
      };
      setCurrentChat(newChat);
      setChatHistory(prev => [newChat, ...prev]);
    } else {
      // Add message to current chat
      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, userMessage],
        lastMessage: currentMessage || `Uploaded file: ${selectedFile?.name}`,
        timestamp: new Date()
      };
      setCurrentChat(updatedChat);
      setChatHistory(prev => 
        prev.map(chat => chat.id === currentChat.id ? updatedChat : chat)
      );
    }

    setCurrentMessage('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: selectedFile 
          ? `I've received your file "${selectedFile.name}" (${(selectedFile.size / 1024).toFixed(1)} KB). This is a simulated response. In a real implementation, I would process this file and provide relevant insights.`
          : `I understand you're asking about "${userMessage.content}". This is a simulated response from your AI chatbot. In a real implementation, this would connect to your AI service.`,
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
    <div className="h-screen bg-white flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-gray-50 border-r border-gray-200 transition-all duration-300 overflow-hidden shadow-md`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900 font-semibold">Chat History</h2>
              <button
                onClick={createNewChat}
                className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition-colors"
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
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
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
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-400 hover:text-purple-600 transition-colors mr-2"
            title="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1" />
          {/* User Profile and Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-gray-900 text-sm font-medium">{user?.name}</p>
              <p className="text-gray-500 text-xs">{user?.email}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Centered Heading and Search Bar */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
              Have tech questions?
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
              Our <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">AI answer engine</span> can help.
            </h2>
            <form onSubmit={handleSendMessage} className="w-full flex items-center bg-gray-100 rounded-xl shadow px-4 py-2 mb-8">
              {/* File Upload Button */}
              <button
                type="button"
                onClick={handleFileUpload}
                className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                title="Attach file"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="*/*"
              />
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Please ask a question or initiate a search."
                className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-gray-900 placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={(!currentMessage.trim() && !selectedFile) || isLoading}
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
            {/* Selected file indicator */}
            {selectedFile && (
              <div className="w-full mb-4 bg-purple-50 rounded-lg p-2 border border-purple-200 shadow flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-900">{selectedFile.name}</span>
                  <span className="text-xs text-gray-400">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button
                  type="button"
                  onClick={removeSelectedFile}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {currentChat ? (
            currentChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-md ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.file && (
                    <div className="mt-2 p-2 bg-black bg-opacity-10 rounded border border-white border-opacity-10">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className="text-xs font-medium">{message.file.name}</span>
                        <span className="text-xs opacity-75">({(message.file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    </div>
                  )}
                  <p className="text-xs opacity-75 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          ) : null}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg shadow">
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
      </div>
    </div>
  );
};

export default ChatbotPage;
