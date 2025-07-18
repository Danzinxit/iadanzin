import React, { useState } from 'react';
import { Button } from './ui/button';
import { X, Image, Lightbulb } from 'lucide-react';

const ImageInstructions = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-neutral-900 border border-red-700 rounded-xl p-4 mb-4 animate-fade-in-up">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Image size={20} className="text-red-500" />
          <h3 className="text-sm font-semibold text-white">Análise de Imagem</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-600 p-1"
          onClick={() => setIsVisible(false)}
        >
          <X size={16} />
        </Button>
      </div>
      
      <div className="space-y-2 text-xs text-red-200">
        <div className="flex items-start space-x-2">
          <Lightbulb size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p>Clique no ícone de clipe para anexar uma imagem. A IA irá analisar e responder sobre o conteúdo da imagem.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          <div className="bg-black/30 rounded-lg p-2">
            <h4 className="font-medium text-red-400 mb-1">O que posso fazer:</h4>
            <ul className="space-y-1 text-xs">
              <li>• Descrever objetos na imagem</li>
              <li>• Identificar pessoas ou lugares</li>
              <li>• Analisar textos em imagens</li>
              <li>• Responder perguntas sobre a imagem</li>
            </ul>
          </div>
          
          <div className="bg-black/30 rounded-lg p-2">
            <h4 className="font-medium text-red-400 mb-1">Dicas:</h4>
            <ul className="space-y-1 text-xs">
              <li>• Imagens claras funcionam melhor</li>
              <li>• Você pode combinar texto + imagem</li>
              <li>• Formatos: JPG, PNG, GIF</li>
              <li>• Tamanho máximo: 10MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageInstructions; 