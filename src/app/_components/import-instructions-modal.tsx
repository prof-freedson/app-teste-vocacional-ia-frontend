"use client";

import { useState } from "react";
import { X, FileText, Download, Upload, AlertCircle, CheckCircle } from "lucide-react";

interface ImportInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportInstructionsModal({ isOpen, onClose }: ImportInstructionsModalProps) {
  const [activeTab, setActiveTab] = useState<'format' | 'example' | 'steps'>('format');

  if (!isOpen) return null;

  const exampleData = {
    courses: [
      {
        nome: "Excel Avançado",
        area: "Informática",
        descricao: "Curso completo de Excel com fórmulas avançadas e análise de dados",
        nivel: "avancado",
        modalidade: "presencial",
        duracao: "40 horas"
      },
      {
        nome: "Barbeiro Profissional",
        area: "Beleza e Estética",
        descricao: "Técnicas profissionais de corte e acabamento",
        nivel: "basico",
        modalidade: "presencial",
        duracao: "60 horas"
      }
    ],
    overwrite: false
  };

  const downloadExample = () => {
    const dataStr = JSON.stringify(exampleData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'exemplo_importacao_cursos.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-0 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Instruções para Importação de Cursos
              </h3>
              <p className="text-sm text-gray-500">
                Como importar cursos em massa para o sistema
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('format')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'format'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Formato do Arquivo
            </button>
            <button
              onClick={() => setActiveTab('example')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'example'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Exemplo Prático
            </button>
            <button
              onClick={() => setActiveTab('steps')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'steps'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Passo a Passo
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'format' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Formato Obrigatório</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      O arquivo deve ser um JSON válido com a estrutura específica abaixo.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Estrutura do JSON</h4>
                <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-800">
{`{
  "courses": [
    {
      "nome": "string (obrigatório)",
      "area": "string (obrigatório)", 
      "descricao": "string (opcional)",
      "nivel": "basico | intermediario | avancado (opcional)",
      "modalidade": "presencial | online | hibrido (opcional)",
      "duracao": "string (opcional)"
    }
  ],
  "overwrite": false
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Campos Detalhados</h4>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                        Obrigatório
                      </span>
                      <code className="text-sm font-mono text-gray-900">nome</code>
                    </div>
                    <p className="text-sm text-gray-600">Nome do curso (mínimo 1 caractere)</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                        Obrigatório
                      </span>
                      <code className="text-sm font-mono text-gray-900">area</code>
                    </div>
                    <p className="text-sm text-gray-600">Área do curso (ex: "Informática", "Beleza e Estética", "Design")</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                        Opcional
                      </span>
                      <code className="text-sm font-mono text-gray-900">nivel</code>
                    </div>
                    <p className="text-sm text-gray-600">Nível do curso: "basico", "intermediario" ou "avancado" (padrão: "basico")</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                        Opcional
                      </span>
                      <code className="text-sm font-mono text-gray-900">modalidade</code>
                    </div>
                    <p className="text-sm text-gray-600">Modalidade: "presencial", "online" ou "hibrido" (padrão: "presencial")</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'example' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-900">Exemplo de Arquivo JSON</h4>
                <button
                  onClick={downloadExample}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Exemplo
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-800">
                  {JSON.stringify(exampleData, null, 2)}
                </pre>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-green-900">Dica Importante</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Use o botão "Baixar Exemplo" para obter um arquivo modelo que você pode editar com seus próprios cursos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-900">Como Importar Cursos</h4>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div className="ml-4">
                    <h5 className="text-sm font-medium text-gray-900">Prepare o arquivo JSON</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Crie um arquivo JSON seguindo a estrutura mostrada na aba "Formato do Arquivo" ou baixe o exemplo da aba "Exemplo Prático".
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div className="ml-4">
                    <h5 className="text-sm font-medium text-gray-900">Valide o formato</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Certifique-se de que o JSON está válido e contém todos os campos obrigatórios (nome e area).
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div className="ml-4">
                    <h5 className="text-sm font-medium text-gray-900">Clique em "Importar Cursos"</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Na página administrativa, clique no botão "Importar Cursos" que será adicionado ao lado do botão "Exportar".
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div className="ml-4">
                    <h5 className="text-sm font-medium text-gray-900">Selecione o arquivo</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Escolha o arquivo JSON que você preparou e confirme a importação.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    ✓
                  </div>
                  <div className="ml-4">
                    <h5 className="text-sm font-medium text-gray-900">Pronto!</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Os cursos serão importados e aparecerão na lista. Você receberá uma confirmação com o número de cursos importados.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-900">Atenção</h4>
                    <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                      <li>• Por padrão, os novos cursos são adicionados aos existentes</li>
                      <li>• Use "overwrite": true apenas se quiser substituir todos os cursos</li>
                      <li>• Campos não preenchidos receberão valores padrão</li>
                      <li>• Todos os cursos importados ficam ativos por padrão</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}