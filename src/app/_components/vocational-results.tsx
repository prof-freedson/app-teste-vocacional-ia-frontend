"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MessageCircle, Home, Share, Loader2 } from 'lucide-react';
import { VocationalData } from '@/types/vocational-data.type';
import ReactMarkdown from 'react-markdown';
import { WhatsAppConfirmationModal } from './whatsapp-confirmation-modal';
import { WhatsAppQRCode } from '@/components/WhatsAppQRCode';

interface VocationalResultsProps {
  vocationalData: VocationalData;
  onBackToHome: () => void;
}

export function VocationalResults({ vocationalData, onBackToHome }: VocationalResultsProps) {
  const [results, setResults] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [whatsappMessage, setWhatsappMessage] = useState<string>('');
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

  useEffect(() => {
    if (results) {
      generateWhatsAppMessage();
    }
  }, [results]);

  const generateResults = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"}/vocational-test`, {
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

  const generateWhatsAppMessage = async () => {
    try {
      // 1. Obter configurações do Senac para informações de contato
      const configResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"}/admin/config`);
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
      
      // 2. Tentar extrair cursos recomendados do JSON estruturado primeiro
      let cursosRecomendados = '';
      let hasCourseRecommendations = false;
      
      try {
        // Tentar parsear como JSON primeiro (novo formato dos agentes)
        const jsonMatch = results.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const resultData = JSON.parse(jsonMatch[0]);
          
          if (resultData.trilhas_recomendadas && resultData.trilhas_recomendadas.length > 0) {
            const cursos: string[] = [];
            resultData.trilhas_recomendadas.forEach((trilha: any) => {
              if (trilha.cursos && trilha.cursos.length > 0) {
                trilha.cursos.slice(0, 3).forEach((curso: any) => {
                  cursos.push(curso.nome);
                });
              }
            });
            
            if (cursos.length > 0) {
              cursosRecomendados = cursos.join(', ');
              hasCourseRecommendations = true;
            }
          }
        }
      } catch (jsonError) {
        console.log('Não foi possível parsear JSON, tentando extração de texto...');
      }
      
      // 3. Fallback: extrair cursos do texto (formato antigo)
      if (!hasCourseRecommendations) {
        const cursosMatch = results.match(/(?:Cursos Recomendados|Recomendações de Cursos|CURSOS SUGERIDOS)[:\s]*\n([\s\S]*?)(?=\n\n|\n#|$)/i);
        
        if (cursosMatch && cursosMatch[1]) {
          const linhasCursos = cursosMatch[1].split('\n').filter(linha => linha.trim()).slice(0, 3);
          const cursosExtraidos = linhasCursos.map(linha => linha.replace(/^[-*•]\s*/, '').trim()).filter(curso => curso);
          
          if (cursosExtraidos.length > 0) {
            cursosRecomendados = cursosExtraidos.join(', ');
            hasCourseRecommendations = true;
          }
        }
      }
      
      // 4. Criar mensagem baseada na disponibilidade de recomendações
      let finalMessage;
      
      if (hasCourseRecommendations && cursosRecomendados) {
        // Mensagem com cursos recomendados
        finalMessage = `🎓 *SENAC MARANHÃO*\n\n` +
          `Olá, ${vocationalData.nome}! 👋\n\n` +
          `✅ *Cursos recomendados para você:*\n${cursosRecomendados}\n\n` +
          `Obrigado por fazer nosso teste vocacional! Entre em contato conosco para saber mais sobre os cursos e se inscrever.\n\n` +
          `📞 ${senacInfo.phone}\n` +
          `🌐 ${senacInfo.website}`;
      } else {
        // Mensagem orientando contato quando não há recomendações específicas
        finalMessage = `🎓 *SENAC MARANHÃO*\n\n` +
          `Olá, ${vocationalData.nome}! 👋\n\n` +
          `Obrigado por fazer nosso teste vocacional! Temos várias opções de cursos na área de ${vocationalData.area_interesse} que podem ser ideais para você.\n\n` +
          `Entre em contato conosco para uma orientação personalizada e conheça todas as oportunidades disponíveis.\n\n` +
          `📞 ${senacInfo.phone}\n` +
          `🌐 ${senacInfo.website}`;
      }
      
      setWhatsappMessage(finalMessage);
      
    } catch (err) {
      console.error('Erro ao gerar mensagem WhatsApp:', err);
      const fallbackMessage = `🎓 *SENAC MARANHÃO*\n\n` +
        `Olá, ${vocationalData.nome}! 👋\n\n` +
        `Obrigado por fazer nosso teste vocacional! Entre em contato conosco para conhecer os cursos ideais para seu perfil na área de ${vocationalData.area_interesse}.\n\n` +
        `📞 (98) 3216-4000\n` +
        `🌐 www.ma.senac.br`;
      setWhatsappMessage(fallbackMessage);
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

        {/* WhatsApp QR Code Section */}
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
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    📱 Escaneie o QR Code com seu celular para receber os resultados no WhatsApp
                  </p>
                  <WhatsAppQRCode 
                     phoneNumber="559831981530" // Número oficial do Senac Maranhão
                     message={whatsappMessage}
                   />
                  <p className="text-sm text-gray-500 mt-4">
                    💡 Abra a câmera do seu celular e aponte para o QR Code acima
                  </p>
                </div>
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
