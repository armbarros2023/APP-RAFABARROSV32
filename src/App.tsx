import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/navigation/Sidebar';
import { NavItemType } from './types';
import { useAuth } from './contexts/AuthContext';
import { useBranch } from './contexts/BranchContext';
import SplashScreen from './pages/SplashScreen';
import {
  Bars3Icon,
  BellIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  DocumentChartBarIcon,
  FolderPlusIcon,
  HomeIcon,
  IdentificationIcon,
  PresentationChartLineIcon,
  UserGroupIcon,
  UsersIcon,
} from './components/icons/HeroIcons';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const FinancialManagementPage = lazy(() => import('./pages/FinancialManagementPage'));
const TeamManagementPage = lazy(() => import('./pages/TeamManagementPage'));
const TherapistAgendaPage = lazy(() => import('./pages/TherapistAgendaPage'));
const ClientBillingPage = lazy(() => import('./pages/ClientBillingPage'));
const TherapistPaymentPage = lazy(() => import('./pages/TherapistPaymentPage'));
const ExternalActivitiesPage = lazy(() => import('./pages/ExternalActivitiesPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const PatientManagementPage = lazy(() => import('./pages/PatientManagementPage'));
const PatientDetailPage = lazy(() => import('./pages/PatientDetailPage'));
const ServiceNfePage = lazy(() => import('./pages/ServiceNfePage'));
const UserManagementPage = lazy(() => import('./pages/UserManagementPage'));
const NewClientIntegrationPage = lazy(() => import('./pages/NewClientIntegrationPage'));
const SystemManualPage = lazy(() => import('./pages/SystemManualPage'));

const SPLASH_SEEN_KEY = 'equipe_rafael_barros_splash_seen';

const shouldShowSplash = () => {
  try {
    return window.sessionStorage.getItem(SPLASH_SEEN_KEY) !== 'true';
  } catch {
    return true;
  }
};

const markSplashSeen = () => {
  try {
    window.sessionStorage.setItem(SPLASH_SEEN_KEY, 'true');
  } catch {
    // Session storage can be unavailable in stricter browser contexts.
  }
};

const navItems: NavItemType[] = [
  { path: '/dashboard', label: 'Painel Principal', icon: HomeIcon },
  {
    label: 'Cadastro',
    icon: FolderPlusIcon,
    children: [
      { path: '/equipe', label: 'Cadastro de Terapeuta', icon: UsersIcon },
      { path: '/alunos', label: 'Cadastro de Alunos', icon: UserGroupIcon },
      { path: '/integracao', label: 'Triagem / Integracao', icon: ClipboardDocumentCheckIcon },
      { path: '/usuarios', label: 'Usuarios e Filiais', icon: IdentificationIcon },
    ],
  },
  {
    label: 'Agenda',
    icon: CalendarIcon,
    children: [{ path: '/agenda-terapeuta', label: 'Agenda de Sessoes', icon: CalendarIcon }],
  },
  {
    label: 'Gestao Financeira',
    icon: BriefcaseIcon,
    children: [
      { path: '/financeiro', label: 'Fluxo de Caixa', icon: PresentationChartLineIcon },
      { path: '/faturamento-alunos', label: 'Faturamento de Alunos', icon: DocumentChartBarIcon },
      { path: '/pagamento-terapeuta', label: 'Pagamento Terapeutas', icon: UsersIcon },
      { path: '/emissao-nf', label: 'Emissao de Notas Fiscais', icon: DocumentChartBarIcon },
    ],
  },
];

const pageMeta = [
  {
    matcher: (pathname: string) => pathname.startsWith('/dashboard'),
    eyebrow: 'Visao estrategica',
    title: 'Painel principal da clinica',
    description: 'Acompanhe agenda, desempenho financeiro e pontos de atencao em uma leitura mais clara e profissional.',
  },
  {
    matcher: (pathname: string) => pathname.startsWith('/alunos'),
    eyebrow: 'Jornada do paciente',
    title: 'Gestao de alunos e prontuarios',
    description: 'Centralize cadastros, acompanhamento e dados clinicos com mais contexto visual.',
  },
  {
    matcher: (pathname: string) => pathname.startsWith('/agenda-terapeuta'),
    eyebrow: 'Ritmo assistencial',
    title: 'Agenda e sessoes',
    description: 'Organize a rotina terapeutica com foco em clareza, confirmacoes e proximos atendimentos.',
  },
  {
    matcher: (pathname: string) => pathname.startsWith('/financeiro'),
    eyebrow: 'Saude financeira',
    title: 'Fluxo de caixa e operacao',
    description: 'Veja receitas, despesas e previsoes em uma interface mais madura e confiavel.',
  },
  {
    matcher: (pathname: string) => pathname.startsWith('/usuarios'),
    eyebrow: 'Governanca',
    title: 'Usuarios, acessos e filiais',
    description: 'Gerencie quem entra, quem opera e como cada unidade e organizada.',
  },
  {
    matcher: (pathname: string) => pathname.startsWith('/manual'),
    eyebrow: 'Referencia interna',
    title: 'Manual do sistema',
    description: 'Consulte fluxos, orientacoes e detalhes tecnicos em um espaco dedicado.',
  },
];

const PageLoader = () => (
  <div className="flex min-h-[320px] w-full items-center justify-center">
    <div className="glass-surface flex flex-col items-center gap-4 rounded-[32px] px-8 py-10 text-center">
      <div className="relative">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary opacity-20 blur-md" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-[3px] border-primary/25 border-t-primary" />
        </div>
      </div>
      <div>
        <p className="font-display text-xl text-slate-900 dark:text-slate-50">Preparando ambiente clinico</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Estamos carregando os modulos da plataforma.</p>
      </div>
    </div>
  </div>
);

const AppShellHeader: React.FC<{ onOpenSidebar: () => void }> = ({ onOpenSidebar }) => {
  const { user } = useAuth();
  const { selectedBranch } = useBranch();
  const location = useLocation();

  const meta = useMemo(() => {
    return (
      pageMeta.find(item => item.matcher(location.pathname)) ?? {
        eyebrow: 'Operacao integrada',
        title: 'Plataforma Equipe Rafael Barros',
        description: 'Uma base visual mais clara para tornar a rotina da clinica mais fluida.',
      }
    );
  }, [location.pathname]);

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
      }).format(new Date()),
    []
  );

  return (
    <header className="sticky top-4 z-20">
      <div className="glass-surface-strong relative overflow-hidden rounded-[30px] px-4 py-4 sm:px-6 sm:py-5">
        <div className="soft-pattern absolute inset-0 opacity-30" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <button
              onClick={onOpenSidebar}
              className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/90 bg-white/70 text-slate-700 shadow-sm transition hover:border-primary/30 hover:text-primary lg:hidden dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200"
              aria-label="Abrir menu"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">{meta.eyebrow}</p>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-[2.3rem]">
                {meta.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">{meta.description}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white/75 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/45">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Hoje</p>
              <p className="mt-2 text-sm font-semibold capitalize text-slate-900 dark:text-slate-100">{formattedDate}</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/75 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/45">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Perfil</p>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {user?.role === 'ADMIN' ? 'Administrador' : 'Terapeuta'}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-primary to-secondary px-4 py-3 text-white shadow-[0_18px_30px_-22px_rgba(15,118,110,0.85)] dark:border-slate-800">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">Unidade</p>
                  <p className="mt-2 text-sm font-semibold">{selectedBranch?.name || 'Selecione uma filial'}</p>
                </div>
                <BellIcon className="h-5 w-5 text-white/85" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const ProtectedRoutes: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen">
      <Sidebar navItems={navItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-h-screen lg:pl-[324px]">
        <main className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6">
            <AppShellHeader onOpenSidebar={() => setSidebarOpen(true)} />
            <div className="fade-enter print:p-0 print:shadow-none">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/alunos" element={<PatientManagementPage />} />
                  <Route path="/alunos/:studentId" element={<PatientDetailPage />} />
                  <Route path="/usuarios" element={<UserManagementPage />} />
                  <Route path="/financeiro" element={<FinancialManagementPage />} />
                  <Route path="/equipe" element={<TeamManagementPage />} />
                  <Route path="/agenda-terapeuta" element={<TherapistAgendaPage />} />
                  <Route path="/integracao" element={<NewClientIntegrationPage />} />
                  <Route path="/faturamento-alunos" element={<ClientBillingPage />} />
                  <Route path="/pagamento-terapeuta" element={<TherapistPaymentPage />} />
                  <Route path="/atividades-externas" element={<ExternalActivitiesPage />} />
                  <Route path="/emissao-nf" element={<ServiceNfePage />} />
                  <Route path="/manual" element={<SystemManualPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <PageLoader />
      </div>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/*" element={user ? <ProtectedRoutes /> : <Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  const [isSplashing, setIsSplashing] = useState(shouldShowSplash);

  useEffect(() => {
    if (!isSplashing) return;

    const timer = window.setTimeout(() => {
      markSplashSeen();
      setIsSplashing(false);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [isSplashing]);

  if (isSplashing) {
    return <SplashScreen />;
  }

  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
