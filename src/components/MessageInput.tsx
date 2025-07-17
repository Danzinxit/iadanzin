import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, X, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string, imageFile?: File | null) => void;
  disabled?: boolean;
  isProcessingImage?: boolean;
}

const MessageInput = ({ onSendMessage, disabled = false, isProcessingImage = false }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || imageFile) && !disabled) {
      onSendMessage(message.trim(), imageFile);
      setMessage('');
      setImageFile(null);
      setImagePreview(null);
      // Adicionar feedback visual
      const form = e.currentTarget as HTMLElement;
      form.classList.add('animate-shake');
      setTimeout(() => form.classList.remove('animate-shake'), 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="border-t bg-black p-2 sm:p-4 animate-fade-in-up">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2 sm:space-y-3">
        {imagePreview && (
          <div className="relative w-fit max-w-xs mb-2 animate-scale-in">
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-xl border border-red-700 max-h-40 object-contain bg-neutral-900"
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-white hover:bg-red-700 transition"
              onClick={handleRemoveImage}
              title="Remover imagem"
            >
              <X size={16} />
            </button>
            {isProcessingImage && (
              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                <div className="flex items-center space-x-2 text-white">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-xs">Analisando imagem...</span>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex items-end space-x-2 sm:space-x-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-600 p-1 sm:p-2 hover-scale animate-float"
            onClick={() => fileInputRef.current?.click()}
            tabIndex={-1}
            disabled={disabled}
          >
            <Paperclip size={16} className="sm:w-4.5 sm:h-4.5" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              tabIndex={-1}
              disabled={disabled}
            />
          </Button>
          <div className="flex-1 relative animate-scale-in">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem aqui..."
              disabled={disabled}
              className="min-h-[40px] sm:min-h-[44px] max-h-24 sm:max-h-32 resize-none border border-red-700 focus:border-red-500 focus:ring-red-500 rounded-xl pr-10 sm:pr-12 bg-black text-red-100 placeholder:text-red-400 text-sm transition-all duration-300 hover-lift focus:animate-glow"
              rows={1}
            />
          </div>
          <Button
            type="submit"
            disabled={(!message.trim() && !imageFile) || disabled}
            className="bg-red-700 hover:bg-red-800 text-white rounded-xl px-3 py-2 sm:px-4 transition-all duration-300 hover-scale hover-glow animate-bounce-in"
          >
            {isProcessingImage ? (
              <Loader2 size={16} className="sm:w-4.5 sm:h-4.5 animate-spin" />
            ) : (
              <Send size={16} className="sm:w-4.5 sm:h-4.5" />
            )}
          </Button>
        </div>
        <div className="text-xs text-red-400 text-center px-2 animate-fade-in-down">
          Pressione Enter para enviar, Shift + Enter para nova linha
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
