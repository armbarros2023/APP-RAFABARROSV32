import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BrandLogo from '../components/branding/BrandLogo';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { UserPlusIcon } from '../components/icons/HeroIcons';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setError('');
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Não foi possível registrar.');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_26%),linear-gradient(180deg,#fbfffe_0%,#eef9f5_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_22%),linear-gradient(180deg,#031513_0%,#08211e_100%)]" />
      <div className="w-full max-w-lg">
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <BrandLogo className="h-20 w-auto max-w-[260px]" />
          <div>
            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-primary">Novo acesso</p>
            <h1 className="mt-2 font-display text-3xl text-slate-950 dark:text-white">Criar conta da equipe</h1>
          </div>
        </div>
        <Card title="Criar Nova Conta" className="mx-auto max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome Completo"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
             <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Senha"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="-mt-2 text-xs text-slate-500 dark:text-slate-400">
              Use pelo menos 8 caracteres, com letra maiúscula, minúscula e número.
            </p>
            <Input
              label="Confirmar Senha"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              rightIcon={<UserPlusIcon className="w-5 h-5" />}
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-300">
                Já tem uma conta?{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                    Faça login
                </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
