

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BriefcaseIcon, UsersIcon, UserGroupIcon, CalendarIcon, CurrencyDollarIcon, PlusCircleIcon, PrinterIcon } from '../components/icons/HeroIcons';
import { useAuth } from '../contexts/AuthContext';
import { useBranch } from '../contexts/BranchContext';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { selectedBranch } = useBranch();

    // Mock data for summary - In a real app, this would be fetched and filtered based on selectedBranch.id
    const summaryStats = [
        { title: 'Receita do Mês', value: 'R$ 15.250,00', icon: BriefcaseIcon, color: 'text-green-500' },
        { title: 'Alunos Ativos', value: '45', icon: UserGroupIcon, color: 'text-sky-500', path: '/alunos' },
        { title: 'Sessões Agendadas (Hoje)', value: '12', icon: CalendarIcon, color: 'text-purple-500', path: '/agenda-terapeuta' },
        { title: 'Faturas Pendentes', value: 'R$ 3.800,00', icon: CurrencyDollarIcon, color: 'text-red-500', path: '/faturamento-alunos' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Painel Principal</h2>
                    {selectedBranch && <p className="text-lg text-slate-600 dark:text-slate-300">Exibindo dados da: <span className="font-bold text-primary dark:text-primary-light">{selectedBranch.name}</span></p>}
                </div>
                <div className="flex items-center space-x-2 print:hidden">
                    <Button onClick={() => window.print()} variant="outline" leftIcon={<PrinterIcon className="w-5 h-5" />}>
                        Imprimir
                    </Button>
                    <Button onClick={() => navigate('/alunos', { state: { openAddModal: true } })} leftIcon={<PlusCircleIcon className="w-5 h-5" />}>
                        Adicionar Aluno
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryStats.map((stat, index) => {
                    const CardContent = (
                        <Card key={index} className="transform hover:scale-105 transition-transform duration-200">
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-full bg-opacity-20 dark:bg-opacity-30 ${stat.icon === BriefcaseIcon ? 'bg-green-100 dark:bg-green-500/30' : stat.icon === UserGroupIcon ? 'bg-sky-100 dark:bg-sky-500/30' : stat.icon === CalendarIcon ? 'bg-purple-100 dark:bg-purple-500/30' : 'bg-red-100 dark:bg-red-500/30'}`}>
                                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
                                    <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    );
                    return stat.path ? (
                        <div key={index} onClick={() => navigate(stat.path!)} className="cursor-pointer">
                            {CardContent}
                        </div>
                    ) : (
                        CardContent
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Próximas Sessões" className="lg:col-span-2">
                    <ul className="space-y-3">
                        <li className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md shadow-sm text-slate-800 dark:text-slate-200">Ana Silva - 10:00 - Terapia Ocupacional</li>
                        <li className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md shadow-sm text-slate-800 dark:text-slate-200">Carlos Souza - 11:30 - Fonoaudiologia</li>
                        <li className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md shadow-sm text-slate-800 dark:text-slate-200">Beatriz Lima - 14:00 - Psicologia</li>
                    </ul>
                    <div className="mt-4 text-right">
                        <a href="#/agenda-terapeuta" className="text-sm text-primary hover:underline dark:text-primary-light">Ver agenda completa</a>
                    </div>
                </Card>
                <Card title="Avisos Importantes">
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <li>Reunião de equipe na próxima sexta-feira às 17h.</li>
                        <li>Atualização do sistema financeiro programada para domingo.</li>
                        <li>Novo protocolo de higiene disponível na intranet.</li>
                        <li>Bem-vindo(a), {user?.name}!</li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};

const TherapistDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="bg-green-100 dark:bg-green-900/20 -m-6 p-6 min-h-full space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-start space-y-4 md:space-y-0">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Bem-vindo(a), {user?.name}!</h2>
                    <p className="text-slate-700 dark:text-slate-300 mt-1">Seu painel para um dia produtivo e focado no desenvolvimento.</p>
                </div>
                <Button onClick={() => window.print()} variant="outline" className="bg-white dark:bg-slate-700 print:hidden" leftIcon={<PrinterIcon className="w-5 h-5" />}>
                    Imprimir
                </Button>
            </div>

            <Card className="!p-0 overflow-hidden">
                <div className="relative">
                    <img
                        src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="Equipe colaborando em um ambiente profissional"
                        className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                        <h3 className="text-2xl font-bold text-white">Juntos, transformamos vidas.</h3>
                        <p className="text-white/90 mt-1">O seu trabalho faz toda a diferença.</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Acesso Rápido" className="md:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div onClick={() => navigate('/agenda-terapeuta')} className="group p-4 bg-white dark:bg-slate-700/50 rounded-lg text-center cursor-pointer hover:bg-primary-light hover:bg-opacity-20 dark:hover:bg-primary-light/20 transition-all duration-200">
                            <CalendarIcon className="h-12 w-12 text-primary dark:text-primary-light mx-auto" />
                            <h4 className="mt-2 text-lg font-semibold text-slate-700 dark:text-slate-200">Minha Agenda</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Veja seus compromissos e planeje seu dia.</p>
                        </div>
                        <div onClick={() => navigate('/alunos')} className="group p-4 bg-white dark:bg-slate-700/50 rounded-lg text-center cursor-pointer hover:bg-primary-light hover:bg-opacity-20 dark:hover:bg-primary-light/20 transition-all duration-200">
                            <UserGroupIcon className="h-12 w-12 text-primary dark:text-primary-light mx-auto" />
                            <h4 className="mt-2 text-lg font-semibold text-slate-700 dark:text-slate-200">Meus Alunos</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Acesse perfis e acompanhe o progresso.</p>
                        </div>
                    </div>
                </Card>

                <Card title="Avisos Importantes">
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <li>Reunião de equipe na próxima sexta-feira às 17h.</li>
                        <li>Novo protocolo de higiene disponível na intranet.</li>
                    </ul>
                </Card>
            </div>

        </div>
    );
}

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return null; // Or a loading spinner
    }

    return user.role === 'ADMIN' ? <AdminDashboard /> : <TherapistDashboard />;
};

export default DashboardPage;