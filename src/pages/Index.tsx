
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
      content: "Olá! Sou seu assistente de IA. Como posso ajudá-lo hoje?",
      isUser: false,
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: '2',
      content: "Oi! Você pode me ajudar a entender como funcionam os modelos de linguagem de IA?",
      isUser: true,
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: '3',
      content: "Claro! Os modelos de linguagem de IA como eu são redes neurais treinadas em vastas quantidades de dados de texto. Aprendemos padrões na linguagem para gerar respostas semelhantes às humanas. O processo de treinamento envolve prever a próxima palavra em sequências, o que nos ajuda a entender contexto, gramática e significado. Isso nos permite participar de conversas, responder perguntas e auxiliar em várias tarefas. Há algum aspecto específico que você gostaria de explorar mais?",
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

    // Simula o delay de resposta da IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Obrigado pela sua mensagem! Sou um assistente de IA de demonstração. Em uma implementação real, isso se conectaria a um serviço de IA real como GPT da OpenAI, Claude ou outros modelos de linguagem para fornecer respostas inteligentes.",
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
      content: "Olá! Sou seu assistente de IA. Como posso ajudá-lo hoje?",
      isUser: false,
      timestamp: new Date()
    }]);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Barra lateral */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <Button
            onClick={startNewChat}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 rounded-lg"
          >
            <Plus size={16} className="mr-2" />
            Nova Conversa
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <div className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">
              Conversas Recentes
            </div>
            <div className="p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <div className="text-sm font-medium truncate">Discussão sobre Modelos de IA</div>
              <div className="text-xs text-gray-400 mt-1">2 minutos atrás</div>
            </div>
            <div className="p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
              <div className="text-sm font-medium truncate">Guia de Introdução</div>
              <div className="text-xs text-gray-400 mt-1">1 hora atrás</div>
            </div>
            <div className="p-3 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
              <div className="text-sm font-medium truncate">Ajuda com Planejamento</div>
              <div className="text-xs text-gray-400 mt-1">Ontem</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div>
              <div className="text-sm font-medium">Assistente IA</div>
              <div className="text-xs text-gray-400">Online</div>
            </div>
          </div>
        </div>
      </div>

      {/* Área principal do chat */}
      <div className="flex-1 flex flex-col">
        {/* Cabeçalho */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu size={20} />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Assistente de Chat IA</h1>
              <p className="text-sm text-gray-500">Alimentado por modelos de linguagem avançados</p>
            </div>
          </div>
        </div>

        {/* Mensagens */}
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

        {/* Entrada de texto */}
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
