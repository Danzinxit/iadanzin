
import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Bot, User, Copy } from 'lucide-react';
import { cn } from '../lib/utils';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/github-dark.css';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  imageUrl?: string | null;
}

const ChatMessage = ({ message, isUser, timestamp, imageUrl }: ChatMessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [message]);

  // Função para copiar código
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    // Adicionar feedback visual
    const button = document.activeElement as HTMLElement;
    if (button) {
      button.classList.add('animate-shake');
      setTimeout(() => button.classList.remove('animate-shake'), 500);
    }
  };

  // Função para renderizar mensagem com blocos de código
  const renderMessage = () => {
    // Regex para detectar blocos de código markdown
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    const elements: React.ReactNode[] = [];
    let idx = 0;
    while ((match = codeBlockRegex.exec(message)) !== null) {
      if (match.index > lastIndex) {
        elements.push(
          <span key={idx++} className="animate-fade-in-up">{message.slice(lastIndex, match.index)}</span>
        );
      }
      const lang = match[1] || '';
      const code = match[2];
      elements.push(
        <div key={idx++} className="relative group my-2 animate-scale-in">
          <button
            className="absolute top-2 right-2 z-10 p-1 rounded bg-gray-800/80 hover:bg-gray-700 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover-scale hover-glow"
            onClick={() => handleCopy(code)}
            title="Copiar código"
          >
            <Copy size={16} />
          </button>
          <pre className="rounded-xl overflow-x-auto bg-gray-900 text-white text-xs sm:text-sm p-2 sm:p-4 border border-gray-700 shadow-md hover-lift">
            <code className={lang ? `language-${lang}` : ''}>{code}</code>
          </pre>
        </div>
      );
      lastIndex = codeBlockRegex.lastIndex;
    }
    if (lastIndex < message.length) {
      elements.push(<span key={idx++} className="animate-fade-in-up">{message.slice(lastIndex)}</span>);
    }
    return elements;
  };

  return (
    <div className={cn(
      "flex gap-2 sm:gap-4 p-2 sm:p-4 animate-bounce-in hover-lift",
      isUser ? "flex-row-reverse bg-red-950/40" : "bg-black"
    )}>
      <Avatar className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 animate-float">
        <AvatarFallback className={cn(
          "text-xs font-medium transition-all duration-300 hover-scale",
          isUser ? "bg-red-700 text-white" : "bg-black text-red-600 border border-red-700"
        )}>
          {isUser ? <User size={12} className="sm:w-4 sm:h-4" /> : <Bot size={12} className="sm:w-4 sm:h-4" />}
        </AvatarFallback>
      </Avatar>
      <div className={cn(
        "flex flex-col max-w-[85%] sm:max-w-[80%] space-y-1 sm:space-y-2",
        isUser ? "items-end" : "items-start"
      )}>
        <div
          ref={messageRef}
          className={cn(
            "rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed break-words transition-all duration-300 hover-lift",
            isUser
              ? "bg-red-700 text-white rounded-br-md hover-glow"
              : "bg-neutral-900 text-red-100 rounded-bl-md hover-glow"
          )}
        >
          {imageUrl && (
            <div className="mb-3 animate-scale-in">
              <img
                src={imageUrl}
                alt="Imagem enviada"
                className="rounded-lg max-w-full max-h-64 object-contain border border-red-700/50 hover-lift"
              />
            </div>
          )}
          {message && renderMessage()}
        </div>
        <span className="text-xs text-red-300 px-2 animate-fade-in-down">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
