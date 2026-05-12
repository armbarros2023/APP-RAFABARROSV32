import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/navigation/Sidebar';
import Button from './components/ui/Button';
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
  PlusCircleIcon,
  PresentationChartLineIcon,
  PrinterIcon,
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
    eyebrow: 'Painel',
    title: 'Visao geral',
  },
  {
    matcher: (pathname: string) => pathname.startsWith('/alunos'),
    eyebrow: 'Pacientes',
    title: 'Alunos e prontuarios',
  },
  {
    matcher: (pathname: string) => pathname.startsWith('/agenda-terapeuta'),
    eyebrow: 'Agenda',
    title: 'Sessoes',
  },
  {
    matcher: (pathname: string) => pathname.startsWith('/financeiro'),
    eyebrow: 'Financeiro',
    title: 'Fluxo de caixa',
  },
  {
    matcher: (pathname: string) => pathname.startsWith('/usuarios'),
    eyebrow: 'Acessos',
    title: 'Usuarios e filiais',
  },
  {
    matcher: (pathname: string) => pathname.startsWith('/manual'),
    eyebrow: 'Referencia',
    title: 'Manual do sistema',
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
        <p className="font-display text-xl text-slate-900 dark:text-slate-50">Carregando</p>
      </div>
    </div>
  </div>
);

const AppShellHeader: React.FC<{ onOpenSidebar: () => void }> = ({ onOpenSidebar }) => {
  const { user } = useAuth();
  const { selectedBranch } = useBranch();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminDashboard = user?.role === 'ADMIN' && location.pathname.startsWith('/dashboard');

  const meta = useMemo(() => {
    return (
      pageMeta.find(item => item.matcher(location.pathname)) ?? {
        eyebrow: 'Clinica',
        title: 'Plataforma Equipe Rafael Barros',
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
      <div className="glass-surface-strong relative overflow-hidden rounded-[28px] px-4 py-3 sm:px-5 sm:py-4">
        <div className="soft-pattern absolute inset-0 opacity-20" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <button
              onClick={onOpenSidebar}
              className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/90 bg-white/70 text-slate-700 shadow-sm transition hover:border-primary/30 hover:text-primary lg:hidden dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200"
              aria-label="Abrir menu"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">{meta.eyebrow}</p>
              <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                {meta.title}
              </h1>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white/75 px-4 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/45">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Hoje</p>
              <p className="mt-1 text-sm font-semibold capitalize text-slate-900 dark:text-slate-100">{formattedDate}</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/75 px-4 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/45">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Perfil</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {user?.role === 'ADMIN' ? 'Administrador' : 'Terapeuta'}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-primary to-secondary px-4 py-2.5 text-white shadow-[0_18px_30px_-22px_rgba(15,118,110,0.85)] dark:border-slate-800">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Unidade</p>
                  <p className="mt-1 text-sm font-semibold">{selectedBranch?.name || 'Sem filial'}</p>
                </div>
                <BellIcon className="h-5 w-5 text-white/85" />
              </div>
            </div>
          </div>

          {isAdminDashboard && (
            <div className="flex flex-wrap items-center gap-2 lg:w-full lg:justify-end xl:w-auto">
              <Button
                size="sm"
                onClick={() => navigate('/alunos', { state: { openAddModal: true } })}
                leftIcon={<PlusCircleIcon className="h-4 w-4" />}
              >
                Novo aluno
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.print()}
                leftIcon={<PrinterIcon className="h-4 w-4" />}
              >
                Salvar PDF
              </Button>
              <button
                type="button"
                onClick={() => navigate('/agenda-terapeuta')}
                className="inline-flex min-h-[38px] items-center gap-2 rounded-2xl border border-amber-200/80 bg-amber-50 px-3.5 py-2 text-sm font-semibold text-amber-700 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200"
              >
                <BellIcon className="h-4 w-4" />
                Pendencias
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs text-white">5</span>
              </button>
            </div>
          )}
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
