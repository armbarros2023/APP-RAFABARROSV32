
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/navigation/Sidebar';
import { NavItemType } from './types';
import { useAuth } from './contexts/AuthContext';
import SplashScreen from './pages/SplashScreen';
import {
  HomeIcon,
  BriefcaseIcon,
  UsersIcon,
  UserGroupIcon,
  CalendarIcon,
  PresentationChartLineIcon,
  FolderPlusIcon,
  DocumentChartBarIcon,
  IdentificationIcon,
  ClipboardDocumentCheckIcon
} from './components/icons/HeroIcons';

// Lazy Loading das Páginas (Melhora drástica na performance inicial)
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

const navItems: NavItemType[] = [
  { path: '/dashboard', label: 'Painel Principal', icon: HomeIcon },
  {
    label: 'Cadastro',
    icon: FolderPlusIcon,
    children: [
      { path: '/equipe', label: 'Cadastro de Terapeuta', icon: UsersIcon },
      { path: '/alunos', label: 'Cadastro de Alunos', icon: UserGroupIcon },
      { path: '/integracao', label: 'Triagem / Integração', icon: ClipboardDocumentCheckIcon },
      { path: '/usuarios', label: 'Usuários e Filiais', icon: IdentificationIcon },
    ]
  },
  {
    label: 'Agenda',
    icon: CalendarIcon,
    children: [
      { path: '/agenda-terapeuta', label: 'Agenda de Sessões', icon: CalendarIcon },
    ]
  },
  {
    label: 'Gestão Financeira',
    icon: BriefcaseIcon,
    children: [
      { path: '/financeiro', label: 'Fluxo de Caixa', icon: PresentationChartLineIcon },
      { path: '/faturamento-alunos', label: 'Faturamento de Alunos', icon: DocumentChartBarIcon },
      { path: '/pagamento-terapeuta', label: 'Pagamento Terapeutas', icon: UsersIcon },
      { path: '/emissao-nf', label: 'Emissão de Notas Fiscais', icon: DocumentChartBarIcon },
    ]
  },
];

// Componente de Loading Simples para o Suspense
const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
    <div className="flex flex-col items-center animate-pulse">
      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
      <p className="text-sm text-slate-500 dark:text-slate-400">Carregando módulo...</p>
    </div>
  </div>
);

const ProtectedRoutes: React.FC = () => (
  <div className="flex h-screen bg-slate-100">
    <Sidebar navItems={navItems} />
    {/* Added print: classes to ensure full width and no scroll bars during print */}
    <main className="flex-1 p-6 overflow-y-auto print:p-0 print:overflow-visible">
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
    </main>
  </div>
);

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100 dark:bg-slate-900">
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
        <Route
          path="/*"
          element={
            user ? (
              <ProtectedRoutes />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  const [isSplashing, setIsSplashing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashing(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

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
