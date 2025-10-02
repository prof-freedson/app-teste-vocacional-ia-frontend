import { VocationalQuestion } from '@/types/vocational-data.type';

export const vocationalQuestions: VocationalQuestion[] = [
  // Seção: Interesses e Preferências
  {
    id: 1,
    category: "interesses",
    question: "Qual atividade você mais gosta de fazer no seu tempo livre?",
    options: [
      { value: "tecnologia", label: "Mexer no computador, celular ou jogos" },
      { value: "saude", label: "Cuidar de pessoas ou animais" },
      { value: "arte", label: "Desenhar, pintar ou criar coisas" },
      { value: "negocios", label: "Vender produtos ou organizar eventos" },
      { value: "educacao", label: "Ensinar ou explicar coisas para outros" }
    ]
  },
  {
    id: 2,
    category: "interesses",
    question: "Em um grupo de trabalho, você prefere:",
    options: [
      { value: "liderar", label: "Liderar e tomar decisões" },
      { value: "colaborar", label: "Trabalhar em equipe" },
      { value: "individual", label: "Trabalhar sozinho(a)" },
      { value: "apoiar", label: "Apoiar e ajudar os outros" },
      { value: "criar", label: "Criar e inovar" }
    ]
  },
  {
    id: 3,
    category: "habilidades",
    question: "Qual dessas habilidades você considera seu ponto forte?",
    options: [
      { value: "comunicacao", label: "Comunicação e relacionamento" },
      { value: "logica", label: "Raciocínio lógico e matemática" },
      { value: "criatividade", label: "Criatividade e imaginação" },
      { value: "organizacao", label: "Organização e planejamento" },
      { value: "manual", label: "Habilidades manuais e práticas" }
    ]
  },
  {
    id: 4,
    category: "personalidade",
    question: "Como você se descreveria?",
    options: [
      { value: "extrovertido", label: "Extrovertido(a) e sociável" },
      { value: "introvertido", label: "Introvertido(a) e reflexivo(a)" },
      { value: "pratico", label: "Prático(a) e objetivo(a)" },
      { value: "criativo", label: "Criativo(a) e inovador(a)" },
      { value: "cuidadoso", label: "Cuidadoso(a) e detalhista" }
    ]
  },
  {
    id: 5,
    category: "ambiente",
    question: "Onde você se imagina trabalhando?",
    options: [
      { value: "escritorio", label: "Em um escritório ou ambiente corporativo" },
      { value: "hospital", label: "Em hospital, clínica ou área da saúde" },
      { value: "escola", label: "Em escola ou ambiente educacional" },
      { value: "laboratorio", label: "Em laboratório ou ambiente técnico" },
      { value: "atelier", label: "Em ateliê, estúdio ou espaço criativo" }
    ]
  },
  {
    id: 6,
    category: "motivacao",
    question: "O que mais te motiva em uma profissão?",
    options: [
      { value: "ajudar", label: "Ajudar pessoas e fazer a diferença" },
      { value: "criar", label: "Criar coisas novas e inovar" },
      { value: "ganhar", label: "Ter boa remuneração e estabilidade" },
      { value: "reconhecimento", label: "Ter reconhecimento e prestígio" },
      { value: "autonomia", label: "Ter autonomia e flexibilidade" }
    ]
  },
  {
    id: 7,
    category: "desafios",
    question: "Que tipo de desafio você prefere enfrentar?",
    options: [
      { value: "problemas_tecnicos", label: "Resolver problemas técnicos complexos" },
      { value: "cuidar_pessoas", label: "Cuidar e ajudar pessoas" },
      { value: "criar_projetos", label: "Criar projetos e soluções criativas" },
      { value: "gerenciar_equipes", label: "Gerenciar equipes e processos" },
      { value: "ensinar_aprender", label: "Ensinar e compartilhar conhecimento" }
    ]
  },
  {
    id: 8,
    category: "futuro",
    question: "Como você se vê daqui a 5 anos?",
    options: [
      { value: "especialista", label: "Especialista em uma área técnica" },
      { value: "empreendedor", label: "Empreendedor(a) com meu próprio negócio" },
      { value: "gestor", label: "Gestor(a) ou líder de equipe" },
      { value: "professor", label: "Professor(a) ou formador(a)" },
      { value: "artista", label: "Artista ou profissional criativo" }
    ]
  },
  {
    id: 9,
    category: "valores",
    question: "Qual valor é mais importante para você no trabalho?",
    options: [
      { value: "impacto_social", label: "Impacto social positivo" },
      { value: "inovacao", label: "Inovação e tecnologia" },
      { value: "estabilidade", label: "Estabilidade e segurança" },
      { value: "crescimento", label: "Crescimento e desenvolvimento" },
      { value: "equilibrio", label: "Equilíbrio entre vida pessoal e profissional" }
    ]
  },
  {
    id: 10,
    category: "aprendizado",
    question: "Como você prefere aprender coisas novas?",
    options: [
      { value: "pratica", label: "Na prática, fazendo e experimentando" },
      { value: "teoria", label: "Estudando teoria e conceitos" },
      { value: "observacao", label: "Observando outros fazerem" },
      { value: "discussao", label: "Discutindo e trocando ideias" },
      { value: "pesquisa", label: "Pesquisando e investigando sozinho(a)" }
    ]
  }
];

export const getQuestionsByCategory = (category: string) => {
  return vocationalQuestions.filter(q => q.category === category);
};

export const getTotalQuestions = () => vocationalQuestions.length;