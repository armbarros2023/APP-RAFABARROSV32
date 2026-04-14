
import { GoogleGenAI } from "@google/genai";

// ⚠️ VULNERABILIDADE DE SEGURANÇA CRÍTICA!
// A API Key está exposta no código do cliente (bundle JavaScript).
// Qualquer usuário pode extrair esta chave e usá-la indevidamente.
// 
// TODO URGENTE: Migrar chamadas de IA para o backend:
// 1. Criar endpoint no backend (ex: POST /api/ai/generate-summary)
// 2. Mover a API Key para variáveis de ambiente do servidor
// 3. Implementar rate limiting no backend
// 4. Validar autenticação antes de processar requisições
//
// Esta implementação é APENAS para protótipo/demonstração!

// Tenta obter a chave de diferentes fontes de ambiente (Vite, CRA, ou fallback vazio)
const getApiKey = () => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return '';
};

const API_KEY = getApiKey();

// Inicializa condicionalmente para evitar crash na inicialização
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const generateStudentSummary = async (
  studentName: string,
  age: number | string,
  recentLogs: { date: string; description: string }[]
): Promise<string> => {
  if (!API_KEY || !ai) {
    return "⚠️ Chave de API não configurada ou inválida. Por favor, configure a variável de ambiente VITE_API_KEY ou API_KEY.";
  }

  const logsText = recentLogs
    .map((log) => `- ${new Date(log.date).toLocaleDateString()}: ${log.description}`)
    .join('\n');

  const prompt = `
    Você é um supervisor clínico especialista em desenvolvimento infantil e terapias integradas.
    Analise os seguintes registros de sessões recentes do aluno: ${studentName} (Idade: ${age}).
    
    Registros:
    ${logsText}
    
    Por favor, gere um "Relatório de Progresso Resumido" profissional em texto simples (use apenas quebras de linha e hífens para tópicos, evite negrito com asteriscos).
    Inclua:
    1. Principais avanços observados.
    2. Áreas que ainda necessitam de atenção.
    3. Sugestão rápida de foco para as próximas sessões.
    
    Use um tom profissional, empático e clínico. Responda em Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar o resumo.";
  } catch (error) {
    console.error("Erro ao chamar Gemini API (Resumo):", error);
    return "Ocorreu um erro ao tentar comunicar com o assistente de IA. Verifique sua conexão e chave de API.";
  }
};

export const suggestActivities = async (
  studentName: string,
  age: number | string,
  recentLogs: { date: string; description: string }[]
): Promise<string> => {
  if (!API_KEY || !ai) {
    return "⚠️ Chave de API não configurada.";
  }

  const logsText = recentLogs
    .map((log) => `- ${new Date(log.date).toLocaleDateString()}: ${log.description}`)
    .join('\n');

  const prompt = `
        Você é um terapeuta especialista em desenvolvimento infantil. O aluno ${studentName} (${age} anos) tem o seguinte histórico recente de sessões:
        
        ${logsText}
        
        Com base nisso, sugira 3 atividades terapêuticas detalhadas e criativas para as próximas sessões para estimular o desenvolvimento contínuo.
        Responda em formato de texto estruturado com tópicos (use hífens ou números, evite formatação Markdown complexa como negrito com asteriscos para garantir legibilidade em texto simples).
        
        Para cada atividade, inclua:
        - Nome da Atividade
        - Objetivo Terapêutico (conectado ao histórico)
        - Materiais sugeridos
        - Breve descrição da execução
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Sem sugestões.";
  } catch (error) {
    console.error("Erro ao chamar Gemini API (Sugestões):", error);
    return "Erro ao gerar sugestões.";
  }
}
