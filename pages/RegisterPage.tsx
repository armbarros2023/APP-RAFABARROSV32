import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { ClinicLogo, UserPlusIcon } from '../components/icons/HeroIcons';

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
    const success = await register(name, email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Não foi possível registrar. O e-mail pode já estar em uso.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md mx-auto p-4">
        <div className="flex justify-center mb-6">
            <ClinicLogo className="h-20 w-20 text-primary" />
        </div>
        <Card title="Criar Nova Conta">
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
            <p className="text-sm text-slate-600">
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
