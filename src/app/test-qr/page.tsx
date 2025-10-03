"use client";

import { WhatsAppQRCode } from '@/components/WhatsAppQRCode';

export default function TestQRPage() {
  const testMessage = "Olá! Este é um teste do QR Code do WhatsApp.";
  const testPhone = "5598999999999";

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Teste do QR Code WhatsApp</h1>
      
      <div className="space-y-8">
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Teste 1: QR Code Básico</h2>
          <WhatsAppQRCode 
            phoneNumber={testPhone}
            message={testMessage}
          />
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Teste 2: QR Code com Número Formatado</h2>
          <WhatsAppQRCode 
            phoneNumber="(98) 99999-9999"
            message={testMessage}
          />
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Teste 3: QR Code com Mensagem Longa</h2>
          <WhatsAppQRCode 
            phoneNumber={testPhone}
            message="Olá! Meu nome é João e fiz o Teste Vocacional do Senac Maranhão na Expoindustria 2025.\n\nBaseado no meu perfil, o teste indicou que tenho afinidade com os seguintes cursos:\n\n• Assistente de Tecnologias da Informação\n• Formação - Programação em Python\n• Introdução à Informática Windows e Office\n\nGostaria de receber mais informações sobre esses cursos e as próximas turmas disponíveis.\n\nObrigado(a)!"
          />
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Teste 4: Erro - Sem Número</h2>
          <WhatsAppQRCode 
            phoneNumber=""
            message={testMessage}
          />
        </div>

        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Teste 5: Erro - Sem Mensagem</h2>
          <WhatsAppQRCode 
            phoneNumber={testPhone}
            message=""
          />
        </div>
      </div>
    </div>
  );
}