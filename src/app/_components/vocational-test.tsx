'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { vocationalQuestions, getTotalQuestions } from '@/data/vocational-questions';
import { VocationalData } from '@/types/vocational-data.type';

interface VocationalTestProps {
  basicInfo: {
    nome: string;
    idade: number;
    escolaridade: string;
    area_interesse: string[];
    disponibilidade: string[];
  };
  onComplete: (data: VocationalData) => void;
  onBack: () => void;
}

export default function VocationalTest({ basicInfo, onComplete, onBack }: VocationalTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');

  const totalQuestions = getTotalQuestions();
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption) {
      setAnswers(prev => ({ ...prev, [currentQuestion]: selectedOption }));
      
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption('');
      } else {
        // Teste completo - processar resultados
        const finalAnswers = { ...answers, [currentQuestion]: selectedOption };
        
        // Extrair informações das respostas
        const skills = Object.values(finalAnswers).filter(answer => 
          answer.includes('técnica') || answer.includes('criativa') || answer.includes('analítica')
        );
        
        const personality = Object.values(finalAnswers).filter(answer => 
          answer.includes('extrovertido') || answer.includes('introvertido') || answer.includes('colaborativo')
        );
        
        const objectives = Object.values(finalAnswers).filter(answer => 
          answer.includes('carreira') || answer.includes('empreender') || answer.includes('especializar')
        );

        // Mapear personalidade para valores válidos do backend
        let personalidadeValida = 'colaborativo'; // valor padrão
        if (personality.some(p => p.includes('analítica') || p.includes('dados'))) {
          personalidadeValida = 'analitico';
        } else if (personality.some(p => p.includes('criativa') || p.includes('arte'))) {
          personalidadeValida = 'criativo';
        } else if (personality.some(p => p.includes('comunicativo') || p.includes('pessoas'))) {
          personalidadeValida = 'comunicativo';
        } else if (personality.some(p => p.includes('lider') || p.includes('liderar'))) {
          personalidadeValida = 'lider';
        }

        const vocationalData: VocationalData = {
          nome: basicInfo.nome,
          idade: basicInfo.idade,
          escolaridade: basicInfo.escolaridade as "fundamental" | "medio" | "superior" | "pos_graduacao",
          area_interesse: basicInfo.area_interesse[0] as "tecnologia" | "saude" | "educacao" | "negocios" | "arte_design" | "gastronomia" | "beleza_estetica" | "turismo_hospitalidade" | "industria" | "servicos",
          habilidades: skills.length > 0 ? skills : ['Habilidades diversas'],
          personalidade: personalidadeValida as "colaborativo" | "analitico" | "criativo" | "comunicativo" | "lider" | "detalhista" | "inovador" | "empreendedor",
          experiencia: 'Baseado nas respostas do teste',
          objetivos: objectives.join(', ') || basicInfo.area_interesse.join(', '),
          disponibilidade: basicInfo.disponibilidade[0] as "integral" | "matutino" | "vespertino" | "noturno" | "fins_de_semana",
          respostas_teste: finalAnswers,
          whatsapp: undefined
        };

        onComplete(vocationalData);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedOption(answers[currentQuestion - 1] || '');
    }
  };

  const currentQuestionData = vocationalQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header com progresso */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Teste Vocacional
            </h1>
            <div className="text-sm text-gray-600">
              {currentQuestion + 1} de {totalQuestions}
            </div>
          </div>
          
          {/* Barra de progresso customizada */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Pergunta */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {currentQuestionData.question}
              </h2>
              
              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect(option.value)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedOption === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        selectedOption === option.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedOption === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                        )}
                      </div>
                      <span className="text-gray-700">{option.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Botões de navegação */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={currentQuestion === 0 ? onBack : handlePrevious}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {currentQuestion === 0 ? 'Voltar' : 'Anterior'}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {currentQuestion === totalQuestions - 1 ? 'Finalizar' : 'Próxima'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}