import { GoogleGenAI } from '@google/genai';
import { Request, Response } from 'express';
import { z } from 'zod';
import { env } from '../config/env';

const recentLogSchema = z.object({
    date: z.string(),
    description: z.string().min(1).max(2000),
});

const aiContextSchema = z.object({
    studentName: z.string().min(1).max(120),
    age: z.union([z.string(), z.number()]),
    recentLogs: z.array(recentLogSchema).max(20),
});

const getAiClient = () => {
    if (!env.GEMINI_API_KEY) return null;
    return new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
};

const formatLogs = (recentLogs: z.infer<typeof recentLogSchema>[]) =>
    recentLogs
        .map((log) => `- ${new Date(log.date).toLocaleDateString('pt-BR')}: ${log.description}`)
        .join('\n');

const generateText = async (prompt: string) => {
    const ai = getAiClient();
    if (!ai) {
        return {
            status: 503,
            body: { error: 'Assistente de IA indisponivel. Configure GEMINI_API_KEY no servidor.' },
        };
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return {
        status: 200,
        body: { text: response.text || 'Nao foi possivel gerar a resposta.' },
    };
};

export const generateStudentSummary = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = aiContextSchema.parse(req.body);
        const prompt = `
Voce e um supervisor clinico especialista em desenvolvimento infantil e terapias integradas.
Analise os seguintes registros de sessoes recentes do aluno: ${data.studentName} (Idade: ${data.age}).

Registros:
${formatLogs(data.recentLogs)}

Gere um Relatorio de Progresso Resumido profissional em texto simples.
Inclua:
1. Principais avancos observados.
2. Areas que ainda necessitam de atencao.
3. Sugestao rapida de foco para as proximas sessoes.

Use um tom profissional, empatico e clinico. Responda em Portugues do Brasil.
`;

        const result = await generateText(prompt);
        res.status(result.status).json(result.body);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('AI summary error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const suggestActivities = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = aiContextSchema.parse(req.body);
        const prompt = `
Voce e um terapeuta especialista em desenvolvimento infantil. O aluno ${data.studentName} (${data.age} anos) tem o seguinte historico recente de sessoes:

${formatLogs(data.recentLogs)}

Com base nisso, sugira 3 atividades terapeuticas detalhadas e criativas para as proximas sessoes para estimular o desenvolvimento continuo.
Responda em texto estruturado com topicos simples.

Para cada atividade, inclua:
- Nome da atividade
- Objetivo terapeutico conectado ao historico
- Materiais sugeridos
- Breve descricao da execucao
`;

        const result = await generateText(prompt);
        res.status(result.status).json(result.body);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
            return;
        }
        console.error('AI activities error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
