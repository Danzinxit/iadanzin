
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-4 p-4 bg-black animate-fade-in">
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className="bg-black text-red-600 text-xs font-medium">
          <Bot size={16} />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col max-w-[80%] space-y-2">
        <div className="bg-neutral-900 rounded-2xl rounded-bl-md px-4 py-3 flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="text-sm text-red-300 ml-2">Danzin está pensando...</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
