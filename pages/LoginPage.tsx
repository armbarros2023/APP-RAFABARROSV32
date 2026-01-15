
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { IdentificationIcon, EnvelopeIcon, LockClosedIcon, CheckIcon, GoogleLogo } from '../components/icons/HeroIcons';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // No AuthContext, o login aceita nome de usuário ou e-mail
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    const success = await loginWithGoogle();
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Erro ao conectar com o Google.');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-400 via-sky-600 to-blue-800 text-white font-sans">
      <div className="w-full max-w-xs mx-auto p-4">

        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-sky-800/50 rounded-full">
            <IdentificationIcon className="w-12 h-12 mx-auto text-white" style={{ strokeWidth: 1 }} />
          </div>
          <h1 className="text-xl font-normal tracking-[0.2em] mt-6 uppercase text-white/90">
            Login de Usuário
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative flex items-center">
            <EnvelopeIcon className="w-5 h-5 absolute left-0 text-white/60" />
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="E-mail ou Usuário"
              className="w-full pl-8 pr-3 py-2 bg-transparent border-b-2 border-white/30 focus:outline-none focus:border-white transition-colors placeholder:text-white/70"
            />
          </div>
          <div className="relative flex items-center">
            <LockClosedIcon className="w-5 h-5 absolute left-0 text-white/60" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Senha"
              className="w-full pl-8 pr-3 py-2 bg-transparent border-b-2 border-white/30 focus:outline-none focus:border-white transition-colors placeholder:text-white/70"
            />
          </div>

          <div className="flex items-center justify-between text-sm font-light text-white/80">
            <label htmlFor="remember-me" className="flex items-center cursor-pointer select-none">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="sr-only peer"
              />
              <div className="w-4 h-4 mr-2 border border-white/50 rounded-sm flex items-center justify-center peer-checked:bg-white/30">
                {rememberMe && <CheckIcon className="w-3 h-3 text-white" />}
              </div>
              <span>Lembrar-me</span>
            </label>
            <Link to="/forgot-password" className="hover:underline">Esqueceu a senha?</Link>
          </div>

          {error && <p className="text-sm text-red-300 text-center">{error}</p>}

          <div className="pt-2 space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold rounded-md bg-sky-900/70 hover:bg-sky-900/90 focus:bg-sky-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-800 focus:ring-white shadow-lg"
            >
              {loading ? 'ENTRANDO...' : 'ENTRAR'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm mt-8 font-light">
          <p className="text-white/80">
            Não tem uma conta?{' '}
            <Link to="/register" className="font-medium text-white hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
