"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, Sparkles, ArrowRight, Users, Target, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface HomeScreenProps {
  onStart: () => void;
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <div className="p-8 md:p-12 text-center">
          
          {/* Logo e Título Principal */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <GraduationCap className="w-20 h-20 text-blue-600" />
              </motion.div>
            </div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Teste Vocacional
            </motion.h1>
            
            <motion.div
              className="flex items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="text-xl md:text-2xl text-orange-600 font-semibold">Senac Maranhão</span>
              <Sparkles className="w-6 h-6 text-orange-500" />
            </motion.div>
          </motion.div>

          {/* Descrição */}
          <motion.p 
            className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Descubra sua vocação profissional e encontre o curso ideal para seu futuro. 
            Um teste personalizado que vai te ajudar a escolher a carreira dos seus sonhos!
          </motion.p>

          {/* Cards de Benefícios */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Personalizado</h3>
              <p className="text-sm text-gray-600 text-center">Análise baseada no seu perfil único</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg">
              <Target className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Preciso</h3>
              <p className="text-sm text-gray-600 text-center">Recomendações com inteligência artificial</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
              <BookOpen className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-900 mb-1">Completo</h3>
              <p className="text-sm text-gray-600 text-center">Trilhas de cursos do Senac MA</p>
            </div>
          </motion.div>

          {/* Botão de Início */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <Button 
              onClick={onStart}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white px-8 py-4 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>Começar Teste</span>
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </motion.div>

          {/* Informação adicional */}
          <motion.p 
            className="text-sm text-gray-500 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            ⏱️ Tempo estimado: 5-10 minutos | 📱 Receba o resultado no seu WhatsApp
          </motion.p>
        </div>
      </Card>
    </div>
  );
}