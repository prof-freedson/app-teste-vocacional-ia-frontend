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

        {/* Link direto como fallback */}
        <div className="mt-4">
          <a
            href={qrCodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.687z"/>
            </svg>
            Abrir WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}