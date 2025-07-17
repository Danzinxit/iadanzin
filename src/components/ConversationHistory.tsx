
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

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
}

const ConversationHistory = ({ 
  conversations, 
  currentConversationId, 
  onSwitchConversation,
  onDeleteConversation 
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
        <div className="text-xs text-red-400 uppercase tracking-wider font-medium mb-2 sm:mb-3 px-2 animate-fade-in-down">
          Conversas Recentes
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
