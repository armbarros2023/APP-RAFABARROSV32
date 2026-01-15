
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, ArrowLeftIcon, IdentificationIcon } from '../components/icons/HeroIcons';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulação de envio - futuramente conectar com API real
        try {
            // await authService.forgotPassword(email);
            setTimeout(() => {
                setLoading(false);
                setSubmitted(true);
            }, 1500);
        } catch (err) {
            setLoading(false);
            setError('Ocorreu um erro ao tentar enviar o e-mail. Tente novamente.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-400 via-sky-600 to-blue-800 text-white font-sans">
            <div className="w-full max-w-sm mx-auto p-4">

                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-sky-800/50 rounded-full mb-4">
                        <IdentificationIcon className="w-10 h-10 mx-auto text-white" style={{ strokeWidth: 1 }} />
                    </div>
                    <h1 className="text-2xl font-light tracking-wide uppercase text-white/90">
                        Recuperar Senha
                    </h1>
                    <p className="mt-2 text-sm text-white/70 font-light">
                        Digite seu e-mail para receber as instruções
                    </p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6 bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 shadow-2xl">
                        <div className="relative flex items-center">
                            <EnvelopeIcon className="w-5 h-5 absolute left-3 text-white/60" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Seu e-mail cadastrado"
                                className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/30 rounded-lg focus:outline-none focus:border-white focus:bg-white/10 transition-all placeholder:text-white/50 text-white"
                            />
                        </div>

                        {error && <p className="text-sm text-red-300 text-center bg-red-900/20 p-2 rounded">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 font-semibold rounded-lg bg-sky-500 hover:bg-sky-400 text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'ENVIANDO...' : 'ENVIAR INSTRUÇÕES'}
                        </button>

                        <div className="text-center pt-2">
                            <Link to="/login" className="inline-flex items-center text-sm text-white/70 hover:text-white transition-colors">
                                <ArrowLeftIcon className="w-4 h-4 mr-2" /> Voltar para o Login
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="text-center space-y-6 bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 shadow-2xl animate-fade-in">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                            <EnvelopeIcon className="w-8 h-8 text-green-300" />
                        </div>
                        <h3 className="text-xl font-medium text-white">E-mail Enviado!</h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                            Se o e-mail <strong>{email}</strong> estiver cadastrado, você receberá um link para redefinir sua senha em instantes.
                        </p>
                        <div className="pt-4">
                            <Link
                                to="/login"
                                className="w-full block py-3 font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all border border-white/30"
                            >
                                VOLTAR AO LOGIN
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
