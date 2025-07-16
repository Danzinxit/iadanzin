
import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
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
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
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
          <span key={idx++}>{message.slice(lastIndex, match.index)}</span>
        );
      }
      const lang = match[1] || '';
      const code = match[2];
      elements.push(
        <div key={idx++} className="relative group my-2">
          <button
            className="absolute top-2 right-2 z-10 p-1 rounded bg-gray-800/80 hover:bg-gray-700 text-white opacity-0 group-hover:opacity-100 transition"
            onClick={() => handleCopy(code)}
            title="Copiar código"
          >
            <Copy size={16} />
          </button>
          <pre className="rounded-xl overflow-x-auto bg-gray-900 text-white text-sm p-4 border border-gray-700 shadow-md">
            <code className={lang ? `language-${lang}` : ''}>{code}</code>
          </pre>
        </div>
      );
      lastIndex = codeBlockRegex.lastIndex;
    }
    if (lastIndex < message.length) {
      elements.push(<span key={idx++}>{message.slice(lastIndex)}</span>);
    }
    return elements;
  };

  return (
    <div className={cn(
      "flex gap-4 p-4 animate-fade-in",
      isUser ? "flex-row-reverse bg-red-950/40" : "bg-black"
    )}>
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className={cn(
          "text-xs font-medium",
          isUser ? "bg-red-700 text-white" : "bg-black text-red-600 border border-red-700"
        )}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </AvatarFallback>
      </Avatar>
      <div className={cn(
        "flex flex-col max-w-[80%] space-y-2",
        isUser ? "items-end" : "items-start"
      )}>
        <div
          ref={messageRef}
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-red-700 text-white rounded-br-md"
              : "bg-neutral-900 text-red-100 rounded-bl-md"
          )}
        >
          {renderMessage()}
        </div>
        <span className="text-xs text-red-300 px-2">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
