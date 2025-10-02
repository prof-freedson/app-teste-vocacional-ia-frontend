"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface WhatsAppConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'validation';
  message: string;
  onNewTest?: () => void;
}

export function WhatsAppConfirmationModal({ 
  isOpen, 
  onClose, 
  type, 
  message, 
  onNewTest 
}: WhatsAppConfirmationModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />;
      case 'error':
        return <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />;
      case 'validation':
        return <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />;
      default:
        return <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'success':
        return 'Enviado com Sucesso!';
      case 'error':
        return 'Erro no Envio';
      case 'validation':
        return 'Número Obrigatório';
      default:
        return 'WhatsApp';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      case 'validation':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-center">
            {getIcon()}
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {getTitle()}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              {message}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6">
          {type === 'success' && onNewTest && (
            <Button
              onClick={() => {
                onClose();
                onNewTest();
              }}
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Fazer Novo Teste
            </Button>
          )}
          
          <Button
            onClick={onClose}
            className={`flex items-center gap-2 w-full sm:w-auto ${getButtonColor()}`}
          >
            {type === 'success' ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Entendi
              </>
            ) : type === 'error' ? (
              <>
                <AlertCircle className="w-4 h-4" />
                Tentar Novamente
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4" />
                OK
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}