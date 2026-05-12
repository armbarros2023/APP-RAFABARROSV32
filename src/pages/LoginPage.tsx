import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/branding/BrandLogo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import {
  EnvelopeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from '../components/icons/HeroIcons';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
      return;
    }

    setError('Nao foi possivel autenticar com essas credenciais. Confira e tente novamente.');
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_18%,rgba(45,212,191,0.18),transparent_22%),radial-gradient(circle_at_86%_78%,rgba(14,165,233,0.14),transparent_24%),linear-gradient(135deg,#fbfffe_0%,#effaf6_52%,#e8f4f2_100%)] dark:bg-[radial-gradient(circle_at_16%_18%,rgba(20,184,166,0.16),transparent_22%),radial-gradient(circle_at_84%_78%,rgba(14,165,233,0.12),transparent_24%),linear-gradient(135deg,#031513_0%,#08211e_52%,#041412_100%)]" />

      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative hidden min-h-[620px] overflow-hidden rounded-[34px] border border-white/60 bg-slate-950 px-8 py-9 text-white shadow-[0_36px_90px_-46px_rgba(2,8,23,0.9)] lg:flex lg:flex-col lg:justify-between">
          <div className="soft-pattern absolute inset-0 opacity-10" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-secondary/30 blur-3xl" />
          <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-secondary-light">Equipe Rafael Barros</p>
            <BrandLogo className="mt-5 h-24 w-auto max-w-[300px]" />
            <h1 className="mt-8 max-w-md font-display text-4xl font-semibold leading-tight tracking-tight">
              Entrada segura para a rotina da clinica.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
              Uma area de trabalho objetiva para agenda, alunos, financeiro e operacao da equipe.
            </p>
          </div>

          <div className="relative grid gap-3">
            {['Agenda', 'Pacientes', 'Financeiro'].map(item => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/7 px-4 py-3">
                <span className="text-sm font-semibold text-white">{item}</span>
                <span className="h-2 w-2 rounded-full bg-secondary-light shadow-[0_0_20px_rgba(94,234,212,0.9)]" />
              </div>
            ))}
          </div>
        </section>

        <section className="glass-surface-strong relative mx-auto flex w-full max-w-[500px] flex-col justify-center overflow-hidden rounded-[32px] px-6 py-7 sm:px-8 sm:py-9">
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-secondary/10 blur-3xl" />
          <div className="relative">
            <div className="mb-7 lg:hidden">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary">Plataforma Clinica</p>
              <BrandLogo className="mt-3 h-18 w-auto max-w-[220px]" />
            </div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/12 bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary">
              <ShieldCheckIcon className="h-4 w-4" />
              Acesso restrito
            </div>

            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Acesse sua conta
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
              Entre para acompanhar a operacao da equipe com seguranca.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <Input
                id="email"
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<EnvelopeIcon className="h-5 w-5" />}
                placeholder="seu.email@equiperafaelbarros.com"
                autoComplete="username"
                required
              />

              <Input
                id="password"
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<LockClosedIcon className="h-5 w-5" />}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
              />

              <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
                <label htmlFor="remember-me" className="inline-flex items-center gap-3">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(prev => !prev)}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/30"
                  />
                  <span>Manter conectado</span>
                </label>
                <Link to="/forgot-password" className="font-semibold text-primary transition hover:text-primary-dark">
                  Esqueci minha senha
                </Link>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
                rightIcon={<LockClosedIcon className="h-5 w-5" />}
              >
                {loading ? 'Entrando...' : 'Acessar plataforma'}
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>Novo acesso?</span>
              <Link to="/register" className="font-semibold text-primary transition hover:text-primary-dark">
                Criar cadastro inicial
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
