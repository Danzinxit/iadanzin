
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-2 sm:gap-4 p-2 sm:p-4 bg-black animate-bounce-in">
      <Avatar className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 animate-float">
        <AvatarFallback className="bg-black text-red-600 text-xs font-medium animate-glow">
          <Bot size={12} className="sm:w-4 sm:h-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col max-w-[85%] sm:max-w-[80%] space-y-1 sm:space-y-2 animate-fade-in-left">
        <div className="bg-neutral-900 rounded-2xl rounded-bl-md px-3 py-2 sm:px-4 sm:py-3 flex items-center space-x-1 hover-lift">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="text-xs sm:text-sm text-red-300 ml-2 animate-fade-in-right">Danzin está pensando...</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
