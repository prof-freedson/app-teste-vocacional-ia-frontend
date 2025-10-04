'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { vocationalQuestions } from '@/data/vocational-questions';
import { VocationalData } from '@/types/vocational-data.type';

interface UnifiedVocationalTestProps {
  onComplete: (data: VocationalData) => void;
  onBack: () => void;
}

interface BasicQuestion {
  id: number;
  type: 'text' | 'single-select' | 'multi-select';
  question: string;
  options?: Array<{ value: string; label: string }>;
  field: string;
}

const basicQuestions: BasicQuestion[] = [
  {
    id: 1,
    type: 'text',
    question: 'Qual é o seu nome completo?',
    field: 'nome'
  },
  {
    id: 2,
    type: 'single-select',
    question: 'Qual é a sua faixa etária?',
    field: 'idade',
    options: [
      { value: '15', label: '0-17 anos' },
      { value: '22', label: '18-25 anos' },
      { value: '30', label: '26-35 anos' },
      { value: '40', label: '36-45 anos' },
      { value: '50', label: '46-60 anos' },
      { value: '65', label: '60+ anos' }
    ]
  },
  {
    id: 3,
    type: 'single-select',
    question: 'Qual é o seu nível de escolaridade?',
    field: 'escolaridade',
    options: [
      { value: 'fundamental', label: 'Ensino Fundamental' },
      { value: 'medio', label: 'Ensino Médio' },
      { value: 'superior', label: 'Ensino Superior' },
      { value: 'pos_graduacao', label: 'Pós-graduação' }
    ]
  },
  {
    id: 4,
    type: 'multi-select',
    question: 'Quais áreas mais despertam seu interesse? (pode escolher mais de uma opção)',
    field: 'area_interesse',
    options: [
      { value: 'tecnologia', label: 'Tecnologia' },
      { value: 'saude', label: 'Saúde' },
      { value: 'educacao', label: 'Educação' },
      { value: 'negocios', label: 'Negócios' },
      { value: 'arte_design', label: 'Arte e Design' },
      { value: 'gastronomia', label: 'Gastronomia' },
      { value: 'beleza_estetica', label: 'Beleza e Estética' },
      { value: 'turismo_hospitalidade', label: 'Turismo e Hospitalidade' },
      { value: 'industria', label: 'Indústria' },
      { value: 'servicos', label: 'Serviços' }
    ]
  },
  {
    id: 5,
    type: 'multi-select',
    question: 'Qual é a sua disponibilidade para estudar? (pode escolher mais de uma opção)',
    field: 'disponibilidade',
    options: [
      { value: 'integral', label: 'Período Integral' },
      { value: 'matutino', label: 'Período Matutino' },
      { value: 'vespertino', label: 'Período Vespertino' },
      { value: 'noturno', label: 'Período Noturno' },
      { value: 'fins_de_semana', label: 'Fins de Semana' }
    ]
  }
];

export default function UnifiedVocationalTest({ onComplete, onBack }: UnifiedVocationalTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [basicAnswers, setBasicAnswers] = useState<Record<string, any>>({});
  const [vocationalAnswers, setVocationalAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textInput, setTextInput] = useState<string>('');

  const totalQuestions = basicQuestions.length + vocationalQuestions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isBasicQuestion = currentQuestion < basicQuestions.length;

  const getCurrentQuestion = () => {
    if (isBasicQuestion) {
      return basicQuestions[currentQuestion];
    } else {
      return vocationalQuestions[currentQuestion - basicQuestions.length];
    }
  };

  const canProceed = () => {
    if (isBasicQuestion) {
      const question = basicQuestions[currentQuestion];
      if (question.type === 'text') {
        return textInput.trim().length > 0;
      } else if (question.type === 'single-select') {
        return selectedOption.length > 0;
      } else if (question.type === 'multi-select') {
        return selectedOptions.length > 0;
      }
    } else {
      return selectedOption.length > 0;
    }
    return false;
  };

  const handleNext = () => {
    if (!canProceed()) return;

    if (isBasicQuestion) {
      const question = basicQuestions[currentQuestion];
      let value: any;

      if (question.type === 'text') {
        value = textInput;
      } else if (question.type === 'single-select') {
        value = question.field === 'idade' ? parseInt(selectedOption) : selectedOption;
      } else if (question.type === 'multi-select') {
        value = selectedOptions;
      }

      setBasicAnswers(prev => ({ ...prev, [question.field]: value }));
    } else {
      const questionIndex = currentQuestion - basicQuestions.length;
      setVocationalAnswers(prev => ({ ...prev, [questionIndex]: selectedOption }));
    }

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      resetInputs();
    } else {
      // Teste completo - processar resultados
      const finalVocationalAnswers = isBasicQuestion 
        ? vocationalAnswers 
        : { ...vocationalAnswers, [currentQuestion - basicQuestions.length]: selectedOption };

      // Extrair informações das respostas vocacionais
      const skills = Object.values(finalVocationalAnswers).filter(answer => 
        answer.includes('técnica') || answer.includes('criativa') || answer.includes('analítica')
      );
      
      const personality = Object.values(finalVocationalAnswers).filter(answer => 
        answer.includes('extrovertido') || answer.includes('introvertido') || answer.includes('colaborativo')
      );
      
      const objectives = Object.values(finalVocationalAnswers).filter(answer => 
        answer.includes('carreira') || answer.includes('empreender') || answer.includes('especializar')
      );

      // Mapear personalidade para valores válidos do backend
      let personalidadeValida = 'colaborativo';
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
        nome: basicAnswers.nome,
        idade: basicAnswers.idade,
        escolaridade: basicAnswers.escolaridade,
        area_interesse: Array.isArray(basicAnswers.area_interesse) ? basicAnswers.area_interesse[0] : basicAnswers.area_interesse,
        habilidades: skills.length > 0 ? skills : ['Habilidades diversas'],
        personalidade: personalidadeValida as any,
        experiencia: 'Baseado nas respostas do teste',
        objetivos: objectives.join(', ') || (Array.isArray(basicAnswers.area_interesse) ? basicAnswers.area_interesse.join(', ') : basicAnswers.area_interesse),
        disponibilidade: Array.isArray(basicAnswers.disponibilidade) ? basicAnswers.disponibilidade[0] : basicAnswers.disponibilidade,
        respostas_teste: { ...basicAnswers, ...finalVocationalAnswers },
        whatsapp: undefined
      };

      onComplete(vocationalData);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      resetInputs();
      
      // Restaurar valores anteriores
      if (currentQuestion - 1 < basicQuestions.length) {
        const question = basicQuestions[currentQuestion - 1];
        const savedValue = basicAnswers[question.field];
        
        if (question.type === 'text') {
          setTextInput(savedValue || '');
        } else if (question.type === 'single-select') {
          setSelectedOption(savedValue || '');
        } else if (question.type === 'multi-select') {
          setSelectedOptions(savedValue || []);
        }
      } else {
        const questionIndex = currentQuestion - 1 - basicQuestions.length;
        setSelectedOption(vocationalAnswers[questionIndex] || '');
      }
    }
  };

  const resetInputs = () => {
    setSelectedOption('');
    setSelectedOptions([]);
    setTextInput('');
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleMultiSelect = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const renderQuestion = () => {
    const question = getCurrentQuestion();

    if (isBasicQuestion) {
      const basicQ = question as BasicQuestion;
      
      return (
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {basicQ.question}
            </h2>

            {basicQ.type === 'text' && (
              <Input
                type="text"
                placeholder="Digite sua resposta..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full text-lg p-4"
              />
            )}

            {basicQ.type === 'single-select' && basicQ.options && (
              <div className="flex flex-wrap gap-3">
                {basicQ.options.map((option) => (
                  <Badge
                    key={option.value}
                    variant={selectedOption === option.value ? "default" : "outline"}
                    className={`p-4 text-center cursor-pointer transition-all hover:scale-105 text-base ${
                      selectedOption === option.value 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                    onClick={() => handleOptionSelect(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            )}

            {basicQ.type === 'multi-select' && basicQ.options && (
              <div className="flex flex-wrap gap-3">
                {basicQ.options.map((option) => (
                  <Badge
                    key={option.value}
                    variant={selectedOptions.includes(option.value) ? "default" : "outline"}
                    className={`p-4 text-center cursor-pointer transition-all hover:scale-105 text-base ${
                      selectedOptions.includes(option.value)
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                    onClick={() => handleMultiSelect(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      );
    } else {
      const vocationalQ = question as any;
      
      return (
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {vocationalQ.question}
            </h2>

            <div className="flex flex-wrap gap-3">
              {vocationalQ.options.map((option: any) => (
                <motion.div
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Badge
                    variant={selectedOption === option.value ? "default" : "outline"}
                    className={`p-4 text-center cursor-pointer transition-all text-base ${
                      selectedOption === option.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                    onClick={() => handleOptionSelect(option.value)}
                  >
                    {option.label}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }
  };

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
          
          {/* Barra de progresso */}
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
          {renderQuestion()}
        </motion.div>

        {/* Navegação */}
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
            disabled={!canProceed()}
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