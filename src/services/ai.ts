import apiClient from './apiClient';

type RecentLog = {
  date: string;
  description: string;
};

type AiTextResponse = {
  text?: string;
  error?: string;
};

const requestAiText = async (
  endpoint: string,
  payload: { studentName: string; age: number | string; recentLogs: RecentLog[] }
) => {
  const response = await apiClient.post<AiTextResponse>(endpoint, payload);
  return response.data.text || response.data.error || 'Nao foi possivel gerar a resposta.';
};

export const generateStudentSummary = async (
  studentName: string,
  age: number | string,
  recentLogs: RecentLog[]
): Promise<string> => {
  try {
    return await requestAiText('/ai/student-summary', {
      studentName,
      age,
      recentLogs,
    });
  } catch (error) {
    console.error('Erro ao gerar resumo com IA:', error);
    return 'Ocorreu um erro ao tentar comunicar com o assistente de IA.';
  }
};

export const suggestActivities = async (
  studentName: string,
  age: number | string,
  recentLogs: RecentLog[]
): Promise<string> => {
  try {
    return await requestAiText('/ai/activity-suggestions', {
      studentName,
      age,
      recentLogs,
    });
  } catch (error) {
    console.error('Erro ao gerar sugestoes com IA:', error);
    return 'Erro ao gerar sugestoes.';
  }
};
