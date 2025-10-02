"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Download, MessageCircle, Home, Share } from 'lucide-react';
import { VocationalData } from '@/types/vocational-data.type';
import ReactMarkdown from 'react-markdown';
import { WhatsAppConfirmationModal } from './whatsapp-confirmation-modal';

interface VocationalResultsProps {
  vocationalData: VocationalData;
  onBackToHome: () => void;
}

export function VocationalResults({ vocationalData, onBackToHome }: VocationalResultsProps) {
  const [results, setResults] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState(vocationalData.whatsapp || '');
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'validation';
    message: string;
  }>({
    isOpen: false,
    type: 'validation',
    message: ''
  });

  useEffect(() => {
    generateResults();
  }, []);

  const generateResults = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:3333/vocational-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vocationalData),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar resultados');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Erro ao ler resposta');
      }

      let accumulatedResults = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        accumulatedResults += chunk;
        setResults(accumulatedResults);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const sendToWhatsApp = async () => {
    if (!whatsapp.trim()) {
      setModalState({
        isOpen: true,
        type: 'validation',
        message: 'Por favor, informe seu número do WhatsApp para receber os resultados.'
      });
      return;
    }

    try {
      setSendingWhatsApp(true);
      
      // 1. Obter configurações do Senac para informações de contato
      const configResponse = await fetch('http://localhost:3333/admin/config');
      let senacInfo = {
        phone: '(98) 3216-4000',
        website: 'www.ma.senac.br'
      };
      
      if (configResponse.ok) {
        const configData = await configResponse.json();
        senacInfo = {
          phone: configData.data?.senac?.phone || '(98) 3216-4000',
          website: configData.data?.senac?.website || 'www.ma.senac.br'
        };
      }
      
      // 2. Criar mensagem personalizada com os resultados
      const finalMessage = `🎓 *SENAC MARANHÃO - RESULTADO DO TESTE VOCACIONAL*\n\n` +
        `👤 *Olá, ${vocationalData.nome}!*\n\n` +
        `📊 *SEUS RESULTADOS:*\n` +
        `${results}\n\n` +
        `📞 *Dúvidas? Entre em contato:*\n` +
        `Telefone: ${senacInfo.phone}\n` +
        `Site: ${senacInfo.website}\n\n` +
        `💡 *Que tal dar o próximo passo na sua carreira? Entre em contato conosco para mais informações sobre os cursos recomendados!*`;
      
      // 3. Criar link wa.me para o número do USUÁRIO
      const cleanUserNumber = whatsapp.replace(/\D/g, '');
      const encodedMessage = encodeURIComponent(finalMessage);
      
      // Verificar se o número tem código do país, se não tiver, adicionar +55
      const userNumber = cleanUserNumber.startsWith('55') ? cleanUserNumber : `55${cleanUserNumber}`;
      const whatsappUrl = `https://wa.me/${userNumber}?text=${encodedMessage}`;
      
      // Abrir WhatsApp do usuário
      window.open(whatsappUrl, '_blank');
      
      setModalState({
        isOpen: true,
        type: 'success',
        message: '🎉 Abrindo seu WhatsApp com os resultados!\n\n📱 Sua mensagem está pronta para ser enviada. Basta tocar em "Enviar" no WhatsApp para receber os resultados no seu celular.'
      });
      
    } catch (err) {
      console.error('Erro ao enviar para WhatsApp:', err);
      setModalState({
        isOpen: true,
        type: 'error',
        message: 'Ocorreu um erro ao abrir o WhatsApp. Verifique se o número está correto e tente novamente.'
      });
    } finally {
      setSendingWhatsApp(false);
    }
  };

  const downloadResults = () => {
    const element = document.createElement('a');
    const file = new Blob([results], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `teste-vocacional-${vocationalData.nome.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meus Resultados do Teste Vocacional - Senac MA',
          text: results.substring(0, 200) + '...',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      navigator.clipboard.writeText(results);
      alert('Resultados copiados para a área de transferência!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎉 Seus Resultados Estão Prontos!
          </h1>
          <p className="text-gray-600">
            Olá {vocationalData.nome}! Descubra sua vocação e os cursos ideais para você
          </p>
        </motion.div>

        {/* Results Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
              <CardTitle className="text-xl text-center">
                Análise Vocacional Personalizada
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                  <span className="text-gray-600">Analisando suas respostas...</span>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">❌ {error}</p>
                  <Button onClick={generateResults} variant="outline">
                    Tentar Novamente
                  </Button>
                </div>
              )}

              {results && !loading && (
                <div className="prose max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-800 mb-4">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-700 mb-3 mt-6">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-medium text-gray-600 mb-2 mt-4">{children}</h3>,
                      p: ({ children }) => <p className="text-gray-600 mb-3 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-4 text-gray-600">{children}</ul>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
                    }}
                  >
                    {results}
                  </ReactMarkdown>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* WhatsApp Section */}
        {results && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  Receber no WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="whatsapp">Número do WhatsApp (com DDD)</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="(98) 99999-9999"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      Digite seu número para receber os resultados diretamente
                    </p>
                  </div>
                  <Button 
                    onClick={sendToWhatsApp}
                    disabled={sendingWhatsApp}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {sendingWhatsApp ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Enviar Resultados
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  📱 Receba seus resultados completos no WhatsApp para consultar quando quiser
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        {results && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center mb-8"
          >
            {/*<Button onClick={downloadResults} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Baixar Resultados
            </Button>
            
            <Button onClick={shareResults} variant="outline" className="flex items-center gap-2">
              <Share className="w-4 h-4" />
              Compartilhar
            </Button>*/}
            
            <Button onClick={onBackToHome} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Home className="w-4 h-4" />
              Fazer Novo Teste
            </Button>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-500 text-sm"
        >
          <p className="mb-2">
            🎓 <strong>Senac Maranhão</strong> - Educação Profissional de Qualidade
          </p>
         
        </motion.div>
      </div>

      {/* WhatsApp Confirmation Modal */}
      <WhatsAppConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        message={modalState.message}
        onNewTest={onBackToHome}
      />
    </div>
  );
}