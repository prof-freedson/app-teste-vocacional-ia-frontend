'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface WhatsAppQRCodeProps {
  phoneNumber: string;
  message: string;
  className?: string;
}

export function WhatsAppQRCode({ phoneNumber, message, className = '' }: WhatsAppQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Função para limpar e formatar o número de telefone
  const formatPhoneNumber = (phone: string): string => {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Se não começar com código do país, adiciona +55 (Brasil)
    if (!cleanPhone.startsWith('55') && cleanPhone.length >= 10) {
      return `55${cleanPhone}`;
    }
    
    return cleanPhone;
  };

  // Gera a URL do WhatsApp no formato wa.me
  const generateWhatsAppUrl = (): string => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  };

  useEffect(() => {
    const generateQRCode = async () => {
      if (!phoneNumber || !message) {
        setError('Número de telefone e mensagem são obrigatórios');
        return;
      }

      try {
        const whatsappUrl = generateWhatsAppUrl();
        setQrCodeUrl(whatsappUrl);

        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, whatsappUrl, {
            width: 256,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
        }
        setError('');
      } catch (err) {
        console.error('Erro ao gerar QR Code:', err);
        setError('Erro ao gerar QR Code');
      }
    };

    generateQRCode();
  }, [phoneNumber, message]);

  if (error) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className={`text-center space-y-4 ${className}`}>
      <div className="bg-white p-4 rounded-lg shadow-md inline-block">
        <canvas 
          ref={canvasRef}
          className="max-w-full h-auto"
        />
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Escaneie o QR Code para enviar o resultado via WhatsApp
        </p>
        
        <div className="text-xs text-gray-500 space-y-1">
          <p>📱 Abra a câmera do seu celular</p>
          <p>📷 Aponte para o QR Code</p>
          <p>💬 Toque no link que aparecer</p>
        </div>
      </div>
    </div>
  );
}