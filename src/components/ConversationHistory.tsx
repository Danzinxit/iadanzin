
import React from 'react';
import { Button } from './ui/button';
import { Trash2, Search, Image, Play, Grid3X3 } from 'lucide-react';

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

interface ConversationHistoryProps {
  conversations: Conversation[];
  currentConversationId: string;
  onSwitchConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewChat: () => void;
}

const ConversationHistory = ({ 
  conversations, 
  currentConversationId, 
  onSwitchConversation,
  onDeleteConversation,
  onNewChat
}: ConversationHistoryProps) => {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const generateTitle = (messages: Message[]) => {
    const firstUserMessage = messages.find(msg => msg.isUser);
    if (firstUserMessage) {
      const words = firstUserMessage.content.split(' ').slice(0, 4);
      return words.join(' ') + (firstUserMessage.content.split(' ').length > 4 ? '...' : '');
    }
    return 'Nova Conversa';
  };

  const sortedConversations = [...conversations].sort((a, b) => 
    b.lastUpdated.getTime() - a.lastUpdated.getTime()
  );

  return (
    <div className="flex-1 overflow-y-auto p-2 sm:p-4 animate-fade-in-left">
      <div className="space-y-1 sm:space-y-2">
        {/* Menu Superior */}
        <div className="mb-4 space-y-1">
          <Button
            onClick={onNewChat}
            variant="ghost"
            className="w-full justify-start text-red-200 hover:bg-red-900 hover:text-white transition-all duration-300 hover-lift"
          >
            <div className="w-4 h-4 mr-3 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            Novo chat
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-red-200 hover:bg-red-900 hover:text-white transition-all duration-300 hover-lift"
          >
            <Search size={16} className="mr-3" />
            Buscar em chats
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-red-200 hover:bg-red-900 hover:text-white transition-all duration-300 hover-lift"
          >
            <Image size={16} className="mr-3" />
            Galeria
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-red-200 hover:bg-red-900 hover:text-white transition-all duration-300 hover-lift"
          >
            <Play size={16} className="mr-3" />
            Sora
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-red-200 hover:bg-red-900 hover:text-white transition-all duration-300 hover-lift"
          >
            <Grid3X3 size={16} className="mr-3" />
            GPTs
          </Button>
        </div>

        {/* Separador */}
        <div className="border-t border-red-700/50 my-4"></div>

        {/* Seção de Chats */}
        <div className="text-xs text-red-400 uppercase tracking-wider font-medium mb-2 sm:mb-3 px-2 animate-fade-in-down">
          Chats
        </div>
        
        {sortedConversations.map((conversation, index) => (
          <div
            key={conversation.id}
            className={`group relative p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-300 hover-lift animate-fade-in-up stagger-${Math.min(index + 1, 5)} ${
              conversation.id === currentConversationId
                ? 'bg-red-700 text-white animate-glow'
                : 'hover:bg-red-900 text-red-200 hover-glow'
            }`}
            onClick={() => onSwitchConversation(conversation.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-medium truncate animate-fade-in-right">
                  {generateTitle(conversation.messages)}
                </div>
                <div className="text-xs text-red-300 mt-1 animate-fade-in-down">
                  {formatTimeAgo(conversation.lastUpdated)}
                </div>
              </div>
              {conversations.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-1 h-auto w-auto ml-1 sm:ml-2 text-red-400 hover:text-red-600 hover-scale animate-scale-in"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                >
                  <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationHistory;
