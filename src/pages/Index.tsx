
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import TypingIndicator from '@/components/TypingIndicator';
import { Button } from '@/components/ui/button';
import { Bot, Plus, Menu } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: '2',
      content: "Hi! Can you help me understand how AI language models work?",
      isUser: true,
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: '3',
      content: "Of course! AI language models like myself are neural networks trained on vast amounts of text data. We learn patterns in language to generate human-like responses. The training process involves predicting the next word in sequences, which helps us understand context, grammar, and meaning. This allows us to engage in conversations, answer questions, and assist with various tasks. Is there a specific aspect you'd like to explore further?",
      isUser: false,
      timestamp: new Date(Date.now() - 30000)
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message! I'm a demo AI assistant. In a real implementation, this would connect to an actual AI service like OpenAI's GPT, Claude, or other language models to provide intelligent responses.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 2000);
  };

  const startNewChat = () => {
    setMessages([{
      id: Date.now().toString(),
      content: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }]);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <Button
            onClick={startNewChat}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 rounded-lg"
          >
            <Plus size={16} className="mr-2" />
            New Chat
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <div className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">
              Recent Chats
            </div>
            <div className="p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <div className="text-sm font-medium truncate">AI Language Models Discussion</div>
              <div className="text-xs text-gray-400 mt-1">2 minutes ago</div>
            </div>
            <div className="p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
              <div className="text-sm font-medium truncate">Getting Started Guide</div>
              <div className="text-xs text-gray-400 mt-1">1 hour ago</div>
            </div>
            <div className="p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
              <div className="text-sm font-medium truncate">Project Planning Help</div>
              <div className="text-xs text-gray-400 mt-1">Yesterday</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div>
              <div className="text-sm font-medium">AI Assistant</div>
              <div className="text-xs text-gray-400">Online</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu size={20} />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">AI Chat Assistant</h1>
              <p className="text-sm text-gray-500">Powered by advanced language models</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="max-w-4xl mx-auto w-full">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
