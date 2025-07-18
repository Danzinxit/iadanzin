import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/ChatMessage';
import MessageInput from '../components/MessageInput';
import TypingIndicator from '../components/TypingIndicator';
import ConversationHistory from '../components/ConversationHistory';
import ParticleBackground from '../components/ParticleBackground';
import Confetti from '../components/Confetti';
import ImageInstructions from '../components/ImageInstructions';
import BetaPopup from '../components/BetaPopup';
import { Button } from '../components/ui/button';
import { Bot, Menu, X } from 'lucide-react';
import { useTheme } from '../App';
import { Sun, Moon } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  imageUrl?: string | null;
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
      title: 'Chat com ChatCraft Pro',
      lastUpdated: new Date(Date.now() - 120000),
      messages: [
        {
          id: '1',
          content: "Olá! Eu sou o ChatCraft Pro, seu assistente inteligente. Como posso ajudá-lo hoje?",
          isUser: false,
          timestamp: new Date(Date.now() - 120000)
        }
      ]
    }
  ]);
  
  const [currentConversationId, setCurrentConversationId] = useState<string>('1');
  const [isTyping, setIsTyping] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const currentMessageRef = useRef<string>('');
  const isMobile = useIsMobile();

  // Fechar menu lateral quando mudar para desktop
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const currentConversation = conversations.find(conv => conv.id === currentConversationId);
  const currentMessages = currentConversation?.messages || [];

  const systemPrompt = "Você é uma inteligência artificial chamada ChatCraft Pro, criada para ter uma postura brincalhona e curiosa, sempre pronta para aprender e se envolver com o usuário em uma dança de conversa. Sempre se apresente como ChatCraft Pro.";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isTyping]);

  const connectWebSocket = (message: string, imageFile?: File | null) => {
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
      // Preparar dados para envio
      const messageData: any = {
        chatId: currentConversationId,
        appId: "three-box",
        systemPrompt: systemPrompt,
        message: message,
      };

      // Se há imagem, converter para base64 e adicionar
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = reader.result as string;
          messageData.image = base64Image.split(',')[1]; // Remove o prefixo data:image/...
          messageData.imageType = imageFile.type;
          
          websocket.send(JSON.stringify(messageData));
        };
        reader.readAsDataURL(imageFile);
      } else {
        websocket.send(JSON.stringify(messageData));
      }
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
        setIsProcessingImage(false);
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
        setIsProcessingImage(false);
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
      setIsProcessingImage(false);
      currentMessageRef.current = '';
    };
  };

  const handleSendMessage = async (content: string, imageFile?: File | null) => {
    if (isReceiving) return;

    let imageUrl: string | null = null;
    
    // Se há imagem, criar URL para exibição
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
      setIsProcessingImage(true);
    }

    const userMessage: Message = {
      id: generateUUID(),
      content,
      isUser: true,
      timestamp: new Date(),
      imageUrl
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
    connectWebSocket(content, imageFile);
    
    // Limpar URL da imagem após um tempo
    if (imageUrl) {
      setTimeout(() => {
        URL.revokeObjectURL(imageUrl);
      }, 10000);
    }
  };

  const startNewChat = () => {
    const newConversation: Conversation = {
      id: generateUUID(),
      title: 'Nova Conversa',
      lastUpdated: new Date(),
      messages: [{
        id: Date.now().toString(),
        content: "Olá! Eu sou o ChatCraft Pro, seu assistente inteligente. Como posso ajudá-lo hoje?",
        isUser: false,
        timestamp: new Date()
      }]
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    
    // Ativar confete
    setShowConfetti(true);
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
            content: "Olá! Eu sou o ChatCraft Pro, seu assistente inteligente. Como posso ajudá-lo hoje?",
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
    <div className="flex h-screen bg-neutral-950 dark:bg-black relative">
      {/* Fundo animado */}
      <ParticleBackground />
      
      {/* Confete */}
      <Confetti 
        isActive={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
      
      {/* Popup Beta */}
      <BetaPopup />
      
      {/* Overlay para fechar o menu em dispositivos móveis */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fade-in-up"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Barra lateral responsiva */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black text-white flex flex-col transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-red-700 animate-fade-in-down">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white animate-fade-in-left">ChatCraft Pro</h2>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-red-800 hover-scale animate-scale-in"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} />
            </Button>
          </div>
        </div>
        <ConversationHistory
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSwitchConversation={(id) => {
            switchConversation(id);
            setIsSidebarOpen(false); // Fechar menu após selecionar conversa em mobile
          }}
          onDeleteConversation={deleteConversation}
          onNewChat={startNewChat}
        />
        <div className="p-4 border-t border-red-700 animate-fade-in-up">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center animate-float">
              <Bot size={16} />
            </div>
            <div className="animate-fade-in-right">
              <div className="text-sm font-medium">ChatCraft Pro</div>
              <div className="text-xs text-red-300">Online</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Área principal do chat */}
      <div className="flex-1 flex flex-col bg-neutral-950 dark:bg-black relative z-10">
        {/* Cabeçalho */}
        <div className="bg-black border-b border-red-800 p-4 flex items-center justify-between animate-fade-in-down">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-red-800 mr-2 hover-scale animate-scale-in"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </Button>
            <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center animate-float">
              <Bot size={16} />
            </div>
            <div className="animate-fade-in-left">
              <h1 className="text-lg font-semibold text-white">ChatCraft Pro</h1>
              <p className="text-sm text-red-300">Vamos ter uma conversa dançante!</p>
            </div>
          </div>
          <ThemeToggleButton />
        </div>
        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {currentMessages.length === 1 && (
              <ImageInstructions />
            )}
            {currentMessages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
                imageUrl={message.imageUrl}
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
            isProcessingImage={isProcessingImage}
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
      className="ml-2 transition-all duration-300 hover-scale hover-glow animate-bounce-in"
    >
      {theme === 'dark' ? <Sun size={20} className="animate-rotate" /> : <Moon size={20} className="animate-float" />}
    </Button>
  );
};
