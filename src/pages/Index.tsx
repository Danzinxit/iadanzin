
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import TypingIndicator from '@/components/TypingIndicator';
import ConversationHistory from '@/components/ConversationHistory';
import { Button } from '@/components/ui/button';
import { Bot, Plus, Menu } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Discussão sobre Modelos de IA',
      lastUpdated: new Date(Date.now() - 120000),
      messages: [
        {
          id: '1',
          content: "Olá! Sou o Danzin IA, seu assistente inteligente. Como posso ajudá-lo hoje?",
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
      ]
    }
  ]);
  
  const [currentConversationId, setCurrentConversationId] = useState<string>('1');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(conv => conv.id === currentConversationId);
  const currentMessages = currentConversation?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isTyping]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    };

    // Atualizar a conversa atual com a nova mensagem
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { 
            ...conv, 
            messages: [...conv.messages, userMessage],
            lastUpdated: new Date()
          }
        : conv
    ));

    setIsTyping(true);

    // Simula o delay de resposta da IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "Obrigado pela sua mensagem! Sou o Danzin IA, seu assistente inteligente. Em uma implementação real, isso se conectaria ao GPT-4 da OpenAI para fornecer respostas inteligentes e úteis.",
        isUser: false,
        timestamp: new Date()
      };
      
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages, aiResponse],
              lastUpdated: new Date()
            }
          : conv
      ));
      setIsTyping(false);
    }, 1500 + Math.random() * 2000);
  };

  const startNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'Nova Conversa',
      lastUpdated: new Date(),
      messages: [{
        id: Date.now().toString(),
        content: "Olá! Sou o Danzin IA, seu assistente inteligente. Como posso ajudá-lo hoje?",
        isUser: false,
        timestamp: new Date()
      }]
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
  };

  const switchConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => {
      const filtered = prev.filter(conv => conv.id !== conversationId);
      if (conversationId === currentConversationId && filtered.length > 0) {
        setCurrentConversationId(filtered[0].id);
      } else if (filtered.length === 0) {
        // Se não há mais conversas, criar uma nova
        const newConv: Conversation = {
          id: Date.now().toString(),
          title: 'Nova Conversa',
          lastUpdated: new Date(),
          messages: [{
            id: Date.now().toString(),
            content: "Olá! Sou o Danzin IA, seu assistente inteligente. Como posso ajudá-lo hoje?",
            isUser: false,
            timestamp: new Date()
          }]
        };
        setCurrentConversationId(newConv.id);
        return [newConv];
      }
      return filtered;
    });
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
        
        <ConversationHistory 
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSwitchConversation={switchConversation}
          onDeleteConversation={deleteConversation}
        />
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div>
              <div className="text-sm font-medium">Danzin IA</div>
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
              <h1 className="text-lg font-semibold text-gray-900">Danzin IA</h1>
              <p className="text-sm text-gray-500">Assistente inteligente alimentado por GPT-4</p>
            </div>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {currentMessages.map((message) => (
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
