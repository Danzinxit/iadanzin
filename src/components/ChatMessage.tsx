
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex gap-4 p-4 animate-fade-in",
      isUser ? "flex-row-reverse bg-gray-50/50" : "bg-white"
    )}>
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className={cn(
          "text-xs font-medium",
          isUser ? "bg-blue-500 text-white" : "bg-gray-900 text-white"
        )}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "flex flex-col max-w-[80%] space-y-2",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser 
            ? "bg-blue-500 text-white rounded-br-md" 
            : "bg-gray-100 text-gray-900 rounded-bl-md"
        )}>
          {message}
        </div>
        <span className="text-xs text-gray-500 px-2">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
