import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import studentService from '../services/studentService';
import staffService from '../services/staffService';
import { useAuth } from '../contexts/AuthContext';
import { useBranch } from '../contexts/BranchContext';
import {
  BellIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  DocumentChartBarIcon,
  PlusCircleIcon,
  PresentationChartLineIcon,
  PrinterIcon,
  SparklesIcon,
  UserGroupIcon,
  UsersIcon,
} from '../components/icons/HeroIcons';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  tone: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, tone, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`glass-surface-strong w-full rounded-[28px] border px-5 py-5 text-left transition duration-200 ${onClick ? 'hover:-translate-y-1 hover:shadow-[0_26px_42px_-28px_rgba(15,23,42,0.28)]' : 'cursor-default'} ${tone}`}
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{title}</p>
        <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{subtitle}</p>
      </div>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-primary shadow-sm dark:bg-slate-900/55">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </button>
);

const QuickAction: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon: Icon, title, description, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="glass-surface-strong flex h-full flex-col rounded-[28px] border p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-primary/20"
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-[0_16px_30px_-18px_rgba(15,118,110,0.7)]">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="mt-5 font-display text-2xl text-slate-950 dark:text-white">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
  </button>
);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedBranch, branches } = useBranch();

  const { data: students = [], isError: hasStudentError } = useQuery({
    queryKey: ['students', selectedBranch?.id],
    queryFn: () => studentService.getAll(selectedBranch?.id ? { branchId: selectedBranch.id } : {}),
    enabled: !!user,
  });

  const { data: staff = [], isError: hasStaffError } = useQuery({
    queryKey: ['staff', selectedBranch?.id],
    queryFn: () => staffService.getAll(selectedBranch?.id ? { branchId: selectedBranch.id } : {}),
    enabled: !!user,
  });

  const syncError = (hasStudentError || hasStaffError) ? 'Os indicadores principais ainda nao puderam ser sincronizados com a API.' : '';

  const studentCount = students.length;
  const activeStudentCount = students.filter(s => s.status === 'active').length;
  const staffCount = staff.filter(m => m.status === 'Ativo').length;


  const summaryStats = [
    {
      title: 'Pacientes ativos',
      value: activeStudentCount === null ? '--' : String(activeStudentCount),
      subtitle: 'Volume real sincronizado com a base atual da unidade selecionada.',
      icon: UserGroupIcon,
      tone: 'border-emerald-100/80 dark:border-emerald-500/10',
      path: '/alunos',
    },
    {
      title: 'Equipe ativa',
      value: staffCount === null ? '--' : String(staffCount),
      subtitle: 'Profissionais cadastrados e marcados como ativos no backend.',
      icon: UsersIcon,
      tone: 'border-sky-100/80 dark:border-sky-500/10',
      path: '/equipe',
    },
    {
      title: 'Cadastros sincronizados',
      value: studentCount === null || staffCount === null ? '--' : String(studentCount + staffCount),
      subtitle: 'Pacientes e equipe carregados direto da API nesta visao.',
      icon: CalendarIcon,
      tone: 'border-teal-100/80 dark:border-teal-500/10',
      path: '/dashboard',
    },
    {
      title: 'Filiais ativas',
      value: String(branches.length),
      subtitle: 'Total de unidades disponiveis no contexto atual do sistema.',
      icon: BriefcaseIcon,
      tone: 'border-amber-100/80 dark:border-amber-500/10',
      path: '/usuarios',
    },
  ];

  const todaysFlow = [
    { time: '08:30', patient: 'Ana Beatriz', status: 'Confirmado', service: 'Terapia ocupacional' },
    { time: '10:00', patient: 'Lucas Silva', status: 'Prontuario pendente', service: 'Psicologia infantil' },
    { time: '11:30', patient: 'Marina Costa', status: 'Pagamento validado', service: 'Fonoaudiologia' },
    { time: '14:00', patient: 'Gabriel Souza', status: 'Reavaliacao', service: 'Sessao multiprofissional' },
  ];

  const operationalPulse = [
    { label: 'Ocupacao de agenda', value: '91%', detail: 'A equipe esta com excelente uso da grade desta semana.' },
    { label: 'Repasse terapeutas', value: 'R$ 11,2 mil', detail: 'Processamento mensal pronto para conferencia.' },
    { label: 'NFes para emitir', value: '12', detail: 'Documentos previstos para fechamento financeiro da unidade.' },
  ];

  return (
    <div className="space-y-6">
      <section className="glass-surface-strong relative overflow-hidden rounded-[34px] px-6 py-7 sm:px-8">
        <div className="soft-pattern absolute inset-0 opacity-30" />
        <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary">Painel executivo</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Uma leitura mais madura da operacao da clinica
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              {selectedBranch
                ? `Voce esta visualizando a unidade ${selectedBranch.name}. Este painel prioriza agenda, saude financeira e pendencias de alto impacto.`
                : 'Selecione uma filial para dar contexto mais preciso ao acompanhamento operacional.'}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => navigate('/alunos', { state: { openAddModal: true } })} leftIcon={<PlusCircleIcon className="h-5 w-5" />}>
                Novo aluno
              </Button>
              <Button onClick={() => window.print()} variant="outline" leftIcon={<PrinterIcon className="h-5 w-5" />}>
                Salvar visao em PDF
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[28px] border border-primary/12 bg-gradient-to-br from-primary to-secondary p-5 text-white shadow-[0_24px_44px_-28px_rgba(15,118,110,0.8)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">Direcao do dia</p>
              <p className="mt-3 font-display text-3xl leading-tight">Unificar operacao, agenda e financeiro sem perder fluidez.</p>
              <p className="mt-4 text-sm leading-6 text-white/80">Painel ideal para acompanhar a unidade em poucos minutos.</p>
            </div>
            <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BellIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Alerta suave</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">Bem-vindo, {user?.name}.</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Ha 3 reavaliacoes clinicas e 2 conciliacoes financeiras aguardando fechamento ainda hoje.
              </p>
            </div>
          </div>
        </div>
      </section>

      {syncError && (
        <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
          {syncError}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryStats.map(stat => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            tone={stat.tone}
            onClick={() => navigate(stat.path)}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card
          title="Agenda operacional do dia"
          actions={
            <Button size="sm" variant="ghost" onClick={() => navigate('/agenda-terapeuta')}>
              Ver agenda completa
            </Button>
          }
        >
          <div className="space-y-3">
            {todaysFlow.map(item => (
              <div
                key={`${item.time}-${item.patient}`}
                className="flex flex-col gap-3 rounded-[24px] border border-slate-200/75 bg-white/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/35"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <CalendarIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.patient}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:text-right">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.time}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{item.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Pulso da unidade">
          <div className="space-y-4">
            {operationalPulse.map(item => (
              <div key={item.label} className="rounded-[24px] border border-slate-200/75 bg-white/70 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/35">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.label}</p>
                  <p className="font-display text-2xl text-primary">{item.value}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <QuickAction
          icon={ClipboardDocumentCheckIcon}
          title="Triagem e integracao"
          description="Abra rapidamente o fluxo inicial para novos pacientes e acompanhe o que falta para o cadastro ficar redondo."
          onClick={() => navigate('/integracao')}
        />
        <QuickAction
          icon={PresentationChartLineIcon}
          title="Saude financeira"
          description="Entre no modulo financeiro com uma leitura mais clara de caixa, repasses e previsoes do ciclo atual."
          onClick={() => navigate('/financeiro')}
        />
        <QuickAction
          icon={DocumentChartBarIcon}
          title="Faturamento e notas"
          description="Acesse cobrancas, repasses e emissao fiscal com atalhos que aceleram as rotinas mais repetidas."
          onClick={() => navigate('/emissao-nf')}
        />
      </div>
    </div>
  );
};

const TherapistDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: students = [], isError: hasSyncError } = useQuery({
    queryKey: ['students', 'therapist', user?.id],
    queryFn: () => studentService.getAll({ therapistId: user?.id }),
    enabled: !!user,
  });

  const syncError = hasSyncError ? 'Os indicadores do terapeuta ainda estao usando dados locais ou incompletos.' : '';

  const therapistStats = [
    {
      title: 'Pacientes na carteira',
      value: String(students.length),
      subtitle: 'Total de alunos vinculados a este terapeuta na base atual.',
      icon: CalendarIcon,
      tone: 'border-teal-100/80 dark:border-teal-500/10',
      path: '/alunos',
    },
    {
      title: 'Planos ativos',
      value: String(students.filter(student => student.status === 'active').length),
      subtitle: 'Alunos ativos acompanhados por voce neste momento.',
      icon: UserGroupIcon,
      tone: 'border-sky-100/80 dark:border-sky-500/10',
      path: '/alunos',
    },
    {
      title: 'Contratos configurados',
      value: String(students.filter(student => (student.monthlyValue || 0) > 0).length),
      subtitle: 'Cadastros com plano financeiro preenchido na base sincronizada.',
      icon: DocumentChartBarIcon,
      tone: 'border-amber-100/80 dark:border-amber-500/10',
      path: '/alunos',
    },
  ];

  const todaysHighlights = [
    { title: '09:00 - Lucas Silva', detail: 'Atualizar observacoes da sessao anterior e validar familia.' },
    { title: '11:30 - Maria Clara', detail: 'Atencao especial para reavaliacao de linguagem e interacao.' },
    { title: '15:00 - Pedro Henrique', detail: 'Confirmar materiais para a atividade planejada da tarde.' },
  ];

  return (
    <div className="space-y-6">
      <section className="glass-surface-strong relative overflow-hidden rounded-[34px] px-6 py-7 sm:px-8">
        <div className="soft-pattern absolute inset-0 opacity-30" />
        <div className="relative grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary">Bem-vindo de volta</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {user?.name}, seu painel esta pronto para um dia mais fluido
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Priorizamos agenda, evolucoes pendentes e acessos rapidos para que voce entre no sistema e encontre o que precisa sem excesso visual.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => navigate('/agenda-terapeuta')} leftIcon={<CalendarIcon className="h-5 w-5" />}>
                Abrir agenda
              </Button>
              <Button onClick={() => navigate('/alunos')} variant="outline" leftIcon={<UsersIcon className="h-5 w-5" />}>
                Ver pacientes
              </Button>
            </div>
          </div>

          <div className="rounded-[28px] border border-primary/12 bg-gradient-to-br from-primary to-secondary p-6 text-white shadow-[0_24px_44px_-28px_rgba(15,118,110,0.8)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14">
                <SparklesIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">Foco de hoje</p>
                <p className="mt-1 font-display text-2xl leading-tight">Atendimento consistente, registros em dia e menos atrito na rotina.</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/80">
              O novo painel destaca o que realmente importa no seu turno e reduz a sensacao de improviso visual.
            </p>
          </div>
        </div>
      </section>

      {syncError && (
        <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
          {syncError}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {therapistStats.map(stat => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            tone={stat.tone}
            onClick={() => navigate(stat.path)}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card title="Roteiro prioritario do dia">
          <div className="space-y-3">
            {todaysHighlights.map(item => (
              <div key={item.title} className="rounded-[24px] border border-slate-200/75 bg-white/70 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/35">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Acessos rapidos">
          <div className="grid gap-4 sm:grid-cols-2">
            <QuickAction
              icon={CalendarIcon}
              title="Minha agenda"
              description="Abra compromissos, encaixes e confirmacoes em uma leitura direta."
              onClick={() => navigate('/agenda-terapeuta')}
            />
            <QuickAction
              icon={UserGroupIcon}
              title="Meus alunos"
              description="Acesse perfis, historico recente e evolucoes ainda pendentes."
              onClick={() => navigate('/alunos')}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return user.role === 'ADMIN' ? <AdminDashboard /> : <TherapistDashboard />;
};

export default DashboardPage;
