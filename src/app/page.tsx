"use client";
import { useState } from 'react'
import { HomeScreen } from "./_components/home-screen";
import UnifiedVocationalTest from './_components/unified-vocational-test';
import { VocationalResults } from "./_components/vocational-results";
import { DietForm } from "./_components/diet-form";
import { DietGenerator } from './_components/diet-generator';
import { DietData } from '@/types/diet-data.type';
import { VocationalData } from '@/types/vocational-data.type';

type AppState = 'home' | 'test' | 'results' | 'diet-form' | 'diet-results';

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [vocationalData, setVocationalData] = useState<VocationalData | null>(null);
  const [dietData, setDietData] = useState<DietData | null>(null);

  function handleStart() {
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
      
      {currentState === 'test' && (
        <UnifiedVocationalTest 
          onComplete={handleTestComplete}
          onBack={() => setCurrentState('home')}
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
