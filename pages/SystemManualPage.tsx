
import React from 'react';
import Button from '../components/ui/Button';
import { 
    PrinterIcon, 
    IdentificationIcon, 
    PresentationChartLineIcon, 
    UserGroupIcon, 
    SparklesIcon, 
    CalendarIcon, 
    DocumentChartBarIcon, 
    ClinicLogo,
    ServerStackIcon,
    TableCellsIcon,
    CodeBracketSquareIcon
} from '../components/icons/HeroIcons';

const SystemManualPage: React.FC = () => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            {/* Header / Actions - Hidden on Print */}
            <div className="flex justify-between items-center print:hidden">
                <div>
                    <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Manual do Sistema & Especificação Técnica</h2>
                    <p className="text-slate-500 text-sm">Documentação para usuários e desenvolvedores backend.</p>
                </div>
                <Button onClick={handlePrint} leftIcon={<PrinterIcon className="w-5 h-5"/>}>
                    Imprimir / Salvar PDF
                </Button>
            </div>

            {/* Manual Content Wrapper */}
            <div className="bg-white dark:bg-slate-900 shadow-xl rounded-xl overflow-hidden print:shadow-none print:w-full print:absolute print:top-0 print:left-0 print:dark:text-black print:text-black">
                
                {/* Cover Page */}
                <div className="bg-gradient-to-br from-sky-700 to-slate-900 text-white p-16 text-center flex flex-col items-center justify-center min-h-[60vh] print:min-h-screen print:break-after-page">
                    <div className="p-4 bg-white rounded-full mb-6">
                        <ClinicLogo className="w-24 h-24 text-sky-700" />
                    </div>
                    <h1 className="text-5xl font-bold mb-4">Manual do Sistema</h1>
                    <h2 className="text-2xl font-light mb-8 opacity-90">Equipe Rafael Barros V31.0</h2>
                    <div className="mt-8 border-t border-white/30 pt-8 max-w-lg mx-auto">
                        <p className="font-semibold text-lg">Documentação Funcional & Técnica</p>
                        <p className="text-sm opacity-80 mt-2">Este documento contém o guia de uso do sistema e as especificações de dados para a equipe de desenvolvimento backend (migração).</p>
                    </div>
                    <div className="mt-auto opacity-80 pt-12">
                        <p className="text-sm">Gerado em {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Table of Contents */}
                <div className="p-10 md:p-16 bg-slate-50 dark:bg-slate-800/50 print:bg-white border-b border-slate-200 dark:border-slate-700 print:break-after-page">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 uppercase tracking-wider">Índice</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700 dark:text-slate-300">
                        <li className="flex items-center space-x-2">
                            <span className="font-bold text-sky-600">01.</span>
                            <span>Visão Geral e Acesso</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <span className="font-bold text-sky-600">02.</span>
                            <span>Gestão de Alunos e Prontuários</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <span className="font-bold text-sky-600">03.</span>
                            <span>Agenda e Sessões</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <span className="font-bold text-sky-600">04.</span>
                            <span>Módulo Financeiro</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <span className="font-bold text-sky-600">05.</span>
                            <span>Inteligência Artificial (Gemini)</span>
                        </li>
                        <li className="flex items-center space-x-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-300">
                            <span className="font-bold text-purple-600">06.</span>
                            <span className="font-semibold">Especificação Técnica (Backend)</span>
                        </li>
                    </ul>
                </div>

                <div className="p-10 md:p-16 space-y-16 dark:text-slate-200 print:text-black">
                    
                    {/* 1. Visão Geral */}
                    <section>
                        <div className="flex items-center space-x-3 border-b-2 border-sky-600 pb-2 mb-6">
                            <IdentificationIcon className="w-8 h-8 text-sky-600" />
                            <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-400">1. Visão Geral e Acesso</h2>
                        </div>
                        <p className="mb-4 text-lg text-slate-600 dark:text-slate-300">
                            O sistema <strong>Equipe Rafael Barros</strong> é uma plataforma web SPA (Single Page Application) desenvolvida em React para gestão clínica multidisciplinar. Atualmente, opera em modo "Client-Side", utilizando o navegador para armazenar dados temporariamente.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                <h4 className="font-bold mb-2 flex items-center"><PresentationChartLineIcon className="w-5 h-5 mr-2 text-sky-500"/> Dashboard</h4>
                                <p className="text-sm">Centraliza indicadores de desempenho (KPIs), atalhos e avisos. A visão é adaptada conforme o perfil (Admin ou Terapeuta).</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                <h4 className="font-bold mb-2 flex items-center"><IdentificationIcon className="w-5 h-5 mr-2 text-sky-500"/> Perfis de Acesso</h4>
                                <ul className="text-sm list-disc list-inside">
                                    <li><strong>Admin:</strong> Acesso total a financeiro, configurações e todos os alunos.</li>
                                    <li><strong>Terapeuta:</strong> Acesso restrito aos seus alunos e sua agenda.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 2. Gestão de Alunos */}
                    <section className="print:break-before-page">
                        <div className="flex items-center space-x-3 border-b-2 border-sky-600 pb-2 mb-6">
                            <UserGroupIcon className="w-8 h-8 text-sky-600" />
                            <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-400">2. Gestão de Alunos</h2>
                        </div>
                        <p className="mb-4 text-slate-600 dark:text-slate-300">
                            Módulo responsável pelo ciclo de vida do paciente na clínica, desde o cadastro até a alta.
                        </p>
                        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800 dark:text-white">Funcionalidades Principais:</h3>
                        <ul className="list-disc list-inside space-y-2 ml-4 text-slate-600 dark:text-slate-300">
                            <li><strong>CRUD Completo:</strong> Criação, leitura, atualização e exclusão de perfis de alunos.</li>
                            <li><strong>Prontuário Digital:</strong> Registro de evolução diária (logs de atividade) por terapeuta.</li>
                            <li><strong>Anexos (Mídia):</strong> Upload simulado de fotos, vídeos e documentos PDF.</li>
                            <li><strong>Dados Financeiros:</strong> Definição de contrato (sessões/mês, valor, responsável financeiro) que alimenta o módulo financeiro automaticamente.</li>
                        </ul>
                    </section>

                    {/* 3. Agenda */}
                    <section>
                         <div className="flex items-center space-x-3 border-b-2 border-sky-600 pb-2 mb-6">
                            <CalendarIcon className="w-8 h-8 text-sky-600" />
                            <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-400">3. Agenda e Sessões</h2>
                        </div>
                        <p className="mb-4 text-slate-600 dark:text-slate-300">
                            Utiliza o componente <code>FullCalendar</code> para gestão visual de horários.
                        </p>
                        <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-lg border-l-4 border-sky-500">
                            <h4 className="font-bold text-sky-800 dark:text-sky-300">Lógica de Status</h4>
                            <ul className="mt-2 space-y-1 text-sm text-sky-700 dark:text-sky-200">
                                <li>🔵 <strong>Agendado:</strong> Sessão confirmada futura.</li>
                                <li>🟢 <strong>Concluído:</strong> Sessão realizada (permite gerar cobrança).</li>
                                <li>🔴 <strong>Cancelado:</strong> Exibe motivo e autor do cancelamento.</li>
                                <li>🟠 <strong>Pendente:</strong> Aguardando aceite do terapeuta (convite).</li>
                            </ul>
                        </div>
                    </section>

                    {/* 4. Financeiro */}
                    <section className="print:break-before-page">
                         <div className="flex items-center space-x-3 border-b-2 border-sky-600 pb-2 mb-6">
                            <DocumentChartBarIcon className="w-8 h-8 text-sky-600" />
                            <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-400">4. Módulo Financeiro</h2>
                        </div>
                        <p className="mb-4 text-slate-600 dark:text-slate-300">
                            O sistema possui um motor financeiro simplificado para clínicas.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white">Fluxo de Caixa</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Registro de entradas e saídas categorizadas (Receita Atendimento, Custo Fixo, etc). Calcula lucro líquido baseado em taxas cadastradas.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white">Faturamento de Alunos</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Gera faturas baseadas no plano do aluno. Permite a emissão de <strong>Recibos em PDF</strong> instantaneamente após a baixa do pagamento.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white">Pagamento de Terapeutas</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Calcula comissões ou valores fixos baseados no número de sessões "Concluídas" no mês.</p>
                            </div>
                        </div>
                    </section>

                    {/* 5. IA */}
                    <section>
                         <div className="flex items-center space-x-3 border-b-2 border-sky-600 pb-2 mb-6">
                            <SparklesIcon className="w-8 h-8 text-sky-600" />
                            <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-400">5. Inteligência Artificial (Gemini)</h2>
                        </div>
                        <p className="mb-4 text-slate-600 dark:text-slate-300">
                            Integração com a API Google Gemini via SDK <code>@google/genai</code>.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-purple-200 dark:border-purple-800 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10">
                                <h4 className="font-bold text-purple-700 dark:text-purple-400">Resumo de Progresso</h4>
                                <p className="text-sm mt-1">Lê os últimos 10 logs de evolução do aluno e gera um texto clínico resumindo avanços e pontos de atenção.</p>
                            </div>
                            <div className="border border-purple-200 dark:border-purple-800 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10">
                                <h4 className="font-bold text-purple-700 dark:text-purple-400">Sugestão de Atividades</h4>
                                <p className="text-sm mt-1">Com base na idade e histórico recente, a IA sugere 3 atividades lúdicas terapêuticas personalizadas.</p>
                            </div>
                        </div>
                    </section>

                    {/* ========================================================================= */}
                    {/* SEÇÃO TÉCNICA PARA BACKEND */}
                    {/* ========================================================================= */}
                    
                    <section className="print:break-before-page border-t-4 border-slate-800 pt-8 mt-12">
                        <div className="flex items-center space-x-3 mb-6 bg-slate-800 text-white p-4 rounded-lg">
                            <ServerStackIcon className="w-8 h-8" />
                            <div>
                                <h2 className="text-2xl font-bold">Guia de Transição para Backend</h2>
                                <p className="text-slate-300 text-sm">Especificações para a equipe de desenvolvimento (Teste & Migração).</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Estrutura de Dados */}
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                                    <TableCellsIcon className="w-6 h-6 mr-2 text-slate-500" />
                                    1. Entidades de Dados (Schema Sugerido)
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-4">
                                    Atualmente, os dados são persistidos em <code>localStorage</code> como strings JSON. Para o backend, recomenda-se um banco de dados relacional (PostgreSQL) ou NoSQL (MongoDB/Firebase) seguindo estas estruturas:
                                </p>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm text-left text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        <thead className="bg-slate-100 dark:bg-slate-800 uppercase font-bold">
                                            <tr>
                                                <th className="px-4 py-2">Entidade / Chave LocalStorage</th>
                                                <th className="px-4 py-2">Campos Críticos</th>
                                                <th className="px-4 py-2">Relacionamentos</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                            <tr>
                                                <td className="px-4 py-2 font-mono text-xs">equipe_rafael_barros_students</td>
                                                <td className="px-4 py-2">id, name, dateOfBirth, status, monthlyValue, sessionsPerMonth</td>
                                                <td className="px-4 py-2">BelongsTo: Branch, Therapist</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 font-mono text-xs">equipe_rafael_barros_team</td>
                                                <td className="px-4 py-2">id, name, role, email, status, specialty</td>
                                                <td className="px-4 py-2">BelongsTo: Branch</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 font-mono text-xs">equipe_rafael_barros_users_db</td>
                                                <td className="px-4 py-2">id, email, password_hash (atualmente plain), role</td>
                                                <td className="px-4 py-2">OneToOne: StaffMember (opcional)</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 font-mono text-xs">Agendamentos (Mockado no Código)</td>
                                                <td className="px-4 py-2">id, dateTime, status, service, notes</td>
                                                <td className="px-4 py-2">BelongsTo: Student, Therapist, Branch</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Endpoints Necessários */}
                            <div className="print:break-inside-avoid">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                                    <CodeBracketSquareIcon className="w-6 h-6 mr-2 text-slate-500" />
                                    2. Endpoints de API Necessários
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-4">
                                    A aplicação espera interagir com uma API RESTful. Abaixo estão os endpoints que devem substituir a lógica local atual:
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <li className="bg-slate-50 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                                        <span className="font-bold text-sky-600">AUTH</span><br/>
                                        POST /auth/login<br/>
                                        POST /auth/register<br/>
                                        POST /auth/refresh-token
                                    </li>
                                    <li className="bg-slate-50 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                                        <span className="font-bold text-green-600">ALUNOS</span><br/>
                                        GET /students (filtros: branchId, therapistId)<br/>
                                        POST /students<br/>
                                        GET /students/:id/activity-logs (Histórico)
                                    </li>
                                    <li className="bg-slate-50 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                                        <span className="font-bold text-purple-600">AGENDA</span><br/>
                                        GET /appointments?start=date&end=date<br/>
                                        POST /appointments<br/>
                                        PATCH /appointments/:id/status (cancel/complete)
                                    </li>
                                    <li className="bg-slate-50 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                                        <span className="font-bold text-amber-600">FINANCEIRO</span><br/>
                                        GET /invoices (Faturas)<br/>
                                        POST /invoices/:id/pay (Baixa)<br/>
                                        GET /transactions (Fluxo de Caixa)
                                    </li>
                                </ul>
                            </div>

                            {/* Regras de Negócio Críticas */}
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800 print:break-inside-avoid">
                                <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-500 mb-2">3. Regras de Negócio para Implementação</h3>
                                <ul className="list-disc list-inside space-y-2 text-sm text-yellow-900 dark:text-yellow-200">
                                    <li><strong>Multi-Tenancy (Filiais):</strong> Todo registro (Aluno, Transação, Agendamento) DEVE ter um <code>branchId</code>. O backend deve filtrar todas as consultas pelo branch ativo do usuário admin.</li>
                                    <li><strong>Segurança de Dados:</strong> Terapeutas só podem ver alunos vinculados a eles (campo <code>therapistId</code>) no backend.</li>
                                    <li><strong>Upload de Mídia:</strong> Atualmente usamos <code>URL.createObjectURL</code> para simular. O backend precisa de um serviço de Storage (S3/Firebase Storage) para retornar URLs reais.</li>
                                    <li><strong>Integração IA:</strong> A chave de API do Gemini deve ficar no servidor (backend) e não no frontend (como está agora via <code>process.env</code> exposto) para segurança. Crie um endpoint <code>POST /ai/generate-report</code> que chama o Google GenAI.</li>
                                </ul>
                            </div>

                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SystemManualPage;
