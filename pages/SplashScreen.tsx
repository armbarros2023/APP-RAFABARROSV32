import React from 'react';
import { ClinicLogo } from '../components/icons/HeroIcons';

const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-primary-dark text-white">
      <div className="animate-pulse">
        <ClinicLogo className="h-40 w-40" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold tracking-wider">
        Equipe Rafael Barros
      </h1>
      <p className="mt-2 text-primary-light opacity-80">Carregando o sistema...</p>
    </div>
  );
};

export default SplashScreen;
