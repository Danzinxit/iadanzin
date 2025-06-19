
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
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <div className="flex items-end space-x-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <Paperclip size={18} />
          </Button>
          
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              disabled={disabled}
              className="min-h-[44px] max-h-32 resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl pr-12"
              rows={1}
            />
          </div>
          
          <Button
            type="submit"
            disabled={!message.trim() || disabled}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 transition-colors"
          >
            <Send size={18} />
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          Press Enter to send, Shift + Enter for new line
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
