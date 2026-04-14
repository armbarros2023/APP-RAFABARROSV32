import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/branding/BrandLogo';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import {
  CalendarIcon,
  DocumentChartBarIcon,
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
    <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_26%),linear-gradient(180deg,#fbfffe_0%,#eef9f5_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_22%),linear-gradient(180deg,#031513_0%,#08211e_100%)]" />

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-stretch gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-surface relative hidden overflow-hidden rounded-[36px] px-8 py-10 lg:flex lg:flex-col lg:justify-between">
          <div className="soft-pattern absolute inset-0 opacity-35" />
          <div className="relative">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Clinico Premium</p>
              <BrandLogo className="mt-4 h-28 w-auto max-w-[340px]" />
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Gestao fluida para uma operacao mais segura e moderna
              </h1>
            </div>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              A plataforma da Equipe Rafael Barros foi pensada para unir agenda, pacientes, financeiro e acompanhamento clinico em uma experiencia mais clara, elegante e confiavel.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                <CalendarIcon className="h-6 w-6 text-primary" />
                <h2 className="mt-5 font-display text-xl text-slate-950 dark:text-white">Agenda em foco</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Visual mais rapido para enxergar rotina, encaixes e compromissos do dia.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                <DocumentChartBarIcon className="h-6 w-6 text-primary" />
                <h2 className="mt-5 font-display text-xl text-slate-950 dark:text-white">Leitura executiva</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Cards, paineis e indicadores com hierarquia melhor para decisao rapida.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/60 bg-white/75 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                <ShieldCheckIcon className="h-6 w-6 text-primary" />
                <h2 className="mt-5 font-display text-xl text-slate-950 dark:text-white">Acesso confiavel</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Entrada mais limpa e mais profissional para a equipe toda trabalhar com mais seguranca.
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-10 flex items-center justify-between rounded-[28px] border border-primary/12 bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">Ambiente de operacao</p>
              <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                Um shell mais claro para reduzir atrito e elevar a percepcao de produto.
              </p>
            </div>
            <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm dark:bg-slate-900/70">
              Equipe ativa
            </div>
          </div>
        </section>

        <section className="glass-surface-strong relative mx-auto flex w-full max-w-xl flex-col justify-center overflow-hidden rounded-[36px] px-6 py-8 sm:px-8 sm:py-10">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />
          <div className="relative">
            <div className="mb-8 lg:hidden">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary">Plataforma Clinica</p>
              <BrandLogo className="mt-3 h-20 w-auto max-w-[240px]" />
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary">Acesso da equipe</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Entre e retome a operacao da clinica
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
              Use suas credenciais para acessar agenda, pacientes, financeiro e acompanhamentos no ambiente premium da plataforma.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                  <span>Manter sessao ativa neste dispositivo</span>
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

            <div className="mt-6 rounded-[28px] border border-slate-200/80 bg-slate-50/80 px-5 py-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900/35 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-slate-100">Primeiro acesso ou novo colaborador?</p>
              <p className="mt-1">
                Se voce ainda nao tem uma conta,{' '}
                <Link to="/register" className="font-semibold text-primary transition hover:text-primary-dark">
                  solicite ou crie seu cadastro aqui
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
