import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '@/components/ChatMessage';
import MessageInput from '@/components/MessageInput';
import TypingIndicator from '@/components/TypingIndicator';
import ConversationHistory from '@/components/ConversationHistory';
import { Button } from '@/components/ui/button';
import { Bot, Plus, Menu } from 'lucide-react';
import { useTheme } from '@/App';
import { Sun, Moon } from 'lucide-react';

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

// Função para gerar UUID
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback para navegadores mais antigos
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Chat com DANZIN IA',
      lastUpdated: new Date(Date.now() - 120000),
      messages: [
        {
          id: '1',
          content: "Olá! Eu sou o Danzin, seu assistente inteligente. Como posso ajudá-lo hoje?",
          isUser: false,
          timestamp: new Date(Date.now() - 120000)
        }
      ]
    }
  ]);
  
  const [currentConversationId, setCurrentConversationId] = useState<string>('1');
  const [isTyping, setIsTyping] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const currentMessageRef = useRef<string>('');

  const currentConversation = conversations.find(conv => conv.id === currentConversationId);
  const currentMessages = currentConversation?.messages || [];

  const systemPrompt = "Você é uma inteligência artificial chamada Danzin, criada para ter uma postura brincalhona e curiosa, sempre pronta para aprender e se envolver com o usuário em uma dança de conversa. Sempre se apresente como Danzin.";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isTyping]);

  const connectWebSocket = (message: string) => {
    setIsReceiving(true);
    setIsTyping(true);
    
    const url = "wss://backend.buildpicoapps.com/api/chatbot/chat";
    const websocket = new WebSocket(url);
    websocketRef.current = websocket;

    // Criar mensagem da IA vazia inicialmente
    const aiMessage: Message = {
      id: generateUUID(),
      content: "",
      isUser: false,
      timestamp: new Date()
    };

    // Adicionar mensagem da IA à conversa
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { 
            ...conv, 
            messages: [...conv.messages, aiMessage],
            lastUpdated: new Date()
          }
        : conv
    ));

    websocket.addEventListener("open", () => {
      websocket.send(
        JSON.stringify({
          chatId: currentConversationId,
          appId: "three-box",
          systemPrompt: systemPrompt,
          message: message,
        })
      );
    });

    websocket.onmessage = (event) => {
      currentMessageRef.current += event.data;
      
      // Atualizar a mensagem da IA com o conteúdo recebido
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { 
              ...conv, 
              messages: conv.messages.map(msg => 
                msg.id === aiMessage.id 
                  ? { ...msg, content: currentMessageRef.current }
                  : msg
              ),
              lastUpdated: new Date()
            }
          : conv
      ));
      
      scrollToBottom();
    };

    websocket.onclose = (event) => {
      if (event.code === 1000) {
        setIsReceiving(false);
        setIsTyping(false);
        currentMessageRef.current = '';
      } else {
        // Em caso de erro, adicionar mensagem de erro
        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? { 
                ...conv, 
                messages: conv.messages.map(msg => 
                  msg.id === aiMessage.id 
                    ? { ...msg, content: msg.content + " Erro ao obter resposta do servidor. Recarregue a página e tente novamente." }
                    : msg
                ),
                lastUpdated: new Date()
              }
            : conv
        ));
        setIsReceiving(false);
        setIsTyping(false);
        currentMessageRef.current = '';
      }
    };

    websocket.onerror = () => {
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { 
              ...conv, 
              messages: conv.messages.map(msg => 
                msg.id === aiMessage.id 
                  ? { ...msg, content: msg.content + " Erro de conexão. Tente novamente." }
                  : msg
              ),
              lastUpdated: new Date()
            }
          : conv
      ));
      setIsReceiving(false);
      setIsTyping(false);
      currentMessageRef.current = '';
    };
  };

  const handleSendMessage = async (content: string) => {
    if (isReceiving) return;

    const userMessage: Message = {
      id: generateUUID(),
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

    // Conectar ao WebSocket para obter resposta da IA
    connectWebSocket(content);
  };

  const startNewChat = () => {
    const newConversation: Conversation = {
      id: generateUUID(),
      title: 'Nova Conversa',
      lastUpdated: new Date(),
      messages: [{
        id: Date.now().toString(),
        content: "Olá! Eu sou o Danzin, seu assistente inteligente. Como posso ajudá-lo hoje?",
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
          id: generateUUID(),
          title: 'Nova Conversa',
          lastUpdated: new Date(),
          messages: [{
            id: Date.now().toString(),
            content: "Olá! Eu sou o Danzin, seu assistente inteligente. Como posso ajudá-lo hoje?",
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

  // Limpeza do WebSocket ao desmontar componente
  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-neutral-950 dark:bg-black">
      {/* Barra lateral tradicional */}
      <div className="w-64 bg-black text-white flex flex-col">
        <div className="p-4 border-b border-red-700">
          <Button
            onClick={startNewChat}
            className="w-full bg-red-700 hover:bg-red-800 text-white border border-red-800 rounded-lg"
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
        <div className="p-4 border-t border-red-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div>
              <div className="text-sm font-medium">Danzin</div>
              <div className="text-xs text-red-300">Online</div>
            </div>
          </div>
        </div>
      </div>
      {/* Área principal do chat */}
      <div className="flex-1 flex flex-col bg-neutral-950 dark:bg-black">
        {/* Cabeçalho */}
        <div className="bg-black border-b border-red-800 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Danzin</h1>
              <p className="text-sm text-red-300">Vamos ter uma conversa dançante!</p>
            </div>
          </div>
          <ThemeToggleButton />
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
            disabled={isTyping || isReceiving}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Alternar tema"
      onClick={toggleTheme}
      className="ml-2"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
};
