"use client";
import { useState } from 'react'
import { HomeScreen } from "./_components/home-screen";
import { VocationalForm } from "./_components/vocational-form";
import VocationalTest from './_components/vocational-test';
import { VocationalResults } from "./_components/vocational-results";
import { DietForm } from "./_components/diet-form";
import { DietGenerator } from './_components/diet-generator';
import { DietData } from '@/types/diet-data.type';
import { VocationalData } from '@/types/vocational-data.type';

type AppState = 'home' | 'form' | 'test' | 'results' | 'diet-form' | 'diet-results';

interface BasicInfo {
  nome: string;
  idade: number;
  escolaridade: "fundamental" | "medio" | "superior" | "pos_graduacao";
  area_interesse: "tecnologia" | "saude" | "educacao" | "negocios" | "arte_design" | "gastronomia" | "beleza_estetica" | "turismo_hospitalidade" | "industria" | "servicos";
  disponibilidade: "integral" | "matutino" | "vespertino" | "noturno" | "fins_de_semana";
}

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);
  const [vocationalData, setVocationalData] = useState<VocationalData | null>(null);
  const [dietData, setDietData] = useState<DietData | null>(null);

  function handleStart() {
    setCurrentState('form');
  }

  function handleBasicInfoSubmit(info: BasicInfo) {
    setBasicInfo(info);
    setCurrentState('test');
  }

  function handleTestComplete(testData: VocationalData) {
    setVocationalData(testData);
    setCurrentState('results');
  }

  function handleBackToHome() {
    setCurrentState('home');
    setBasicInfo(null);
    setVocationalData(null);
  }

  function handleBackToForm() {
    setCurrentState('form');
  }

  // Funções para manter compatibilidade com sistema de dieta
  function handleDietSubmit(userInfo: DietData) {
    setDietData(userInfo);
    setCurrentState('diet-results');
  }

  function goToDietForm() {
    setCurrentState('diet-form');
  }

  return (
    <>
      {currentState === 'home' && (
        <HomeScreen onStart={handleStart} />
      )}
      
      {currentState === 'form' && (
        <VocationalForm 
          onSubmit={handleBasicInfoSubmit} 
          onBack={handleBackToHome}
        />
      )}
      
      {currentState === 'test' && basicInfo && (
        <VocationalTest 
          basicInfo={basicInfo}
          onComplete={handleTestComplete}
          onBack={handleBackToForm}
        />
      )}
      
      {currentState === 'results' && vocationalData && (
        <VocationalResults 
          vocationalData={vocationalData}
          onBackToHome={handleBackToHome}
        />
      )}

      {/* Sistema de dieta (manter para compatibilidade) */}
      {currentState === 'diet-form' && (
        <DietForm onSubmit={handleDietSubmit} />
      )}
      
      {currentState === 'diet-results' && dietData && (
        <DietGenerator data={dietData} />
      )}

     
    </>
  );
}
