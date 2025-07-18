import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Info, Rocket, Sparkles } from 'lucide-react';

const BetaPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já viu o popup
    const hasSeenPopup = localStorage.getItem('chatcraft-pro-beta-popup-seen');
    
    if (!hasSeenPopup) {
      // Mostrar popup após 1 segundo do carregamento
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Marcar que o usuário já viu o popup
    localStorage.setItem('chatcraft-pro-beta-popup-seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay escuro */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in-up"
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-bounce-in">
        <div className="bg-neutral-900 border border-red-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center animate-float">
                <Sparkles size={16} className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">Versão Beta</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-400 hover:text-red-600 hover-scale"
              onClick={handleClose}
            >
              <X size={20} />
            </Button>
          </div>

          {/* Conteúdo */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Info size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white text-sm leading-relaxed">
                  Este é apenas uma <strong>versão beta e simples</strong> do ChatCraft Pro.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Rocket size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-200 text-sm leading-relaxed">
                  Você irá aprender a usar as <strong>IAs mais avançadas</strong> e tecnologias da atualidade!
                </p>
              </div>
            </div>

            {/* Lista de IAs e tecnologias */}
            <div className="bg-black/30 rounded-lg p-3">
              <h3 className="text-red-400 font-medium text-sm mb-2">O que você vai aprender:</h3>
              <ul className="space-y-1 text-xs text-red-200">
                <li>• <span className="text-white">GPT-4.1</span> e modelos avançados da OpenAI</li>
                <li>• <span className="text-white">Claude</span> da Anthropic</li>
                <li>• <span className="text-white">Gemini</span> do Google</li>
                <li>• <span className="text-white">Midjourney</span> para criação de imagens</li>
                <li>• <span className="text-white">DALL-E</span> e outras IAs visuais</li>
                <li>• <span className="text-white">Integração</span> de múltiplas IAs</li>
              </ul>
            </div>
          </div>

          {/* Botão de ação */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleClose}
              className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg transition-all duration-300 hover-scale hover-glow"
            >
              Entendi! Vamos começar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BetaPopup; 