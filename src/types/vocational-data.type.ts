export interface VocationalData {
  nome: string;
  idade: number;
  escolaridade: "fundamental" | "medio" | "superior" | "pos_graduacao";
  area_interesse: "tecnologia" | "saude" | "educacao" | "negocios" | "arte_design" | "gastronomia" | "beleza_estetica" | "turismo_hospitalidade" | "industria" | "servicos";
  habilidades: string[];
  personalidade: "analitico" | "criativo" | "comunicativo" | "lider" | "detalhista" | "inovador" | "colaborativo" | "empreendedor";
  experiencia: string;
  objetivos: string;
  disponibilidade: "integral" | "matutino" | "vespertino" | "noturno" | "fins_de_semana";
  respostas_teste: Record<string, string | number | string[]>;
  whatsapp?: string;
}

export interface VocationalQuestion {
  id: number;
  category: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

export interface VocationalTestState {
  currentQuestion: number;
  totalQuestions: number;
  answers: Record<string, string | number | string[]>;
  isComplete: boolean;
}