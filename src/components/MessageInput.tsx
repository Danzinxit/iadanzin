import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const MessageInput = ({ onSendMessage, disabled = false }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="border-t bg-black p-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <div className="flex items-end space-x-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-600 p-2"
          >
            <Paperclip size={18} />
          </Button>
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem aqui..."
              disabled={disabled}
              className="min-h-[44px] max-h-32 resize-none border border-red-700 focus:border-red-500 focus:ring-red-500 rounded-xl pr-12 bg-black text-red-100 placeholder:text-red-400"
              rows={1}
            />
          </div>
          <Button
            type="submit"
            disabled={!message.trim() || disabled}
            className="bg-red-700 hover:bg-red-800 text-white rounded-xl px-4 py-2 transition-colors"
          >
            <Send size={18} />
          </Button>
        </div>
        <div className="text-xs text-red-400 text-center">
          Pressione Enter para enviar, Shift + Enter para nova linha
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
