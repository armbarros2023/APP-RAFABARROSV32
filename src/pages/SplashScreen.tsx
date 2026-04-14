import React from 'react';
import BrandLogo from '../components/branding/BrandLogo';

const SplashScreen: React.FC = () => {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.24),transparent_22%),linear-gradient(180deg,#06211e_0%,#0b2b28_42%,#071918_100%)] text-white">
      <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute -right-14 bottom-10 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
      <div className="glass-surface flex flex-col items-center rounded-[36px] px-10 py-12 text-center text-white shadow-[0_30px_90px_-30px_rgba(2,8,23,0.9)]">
        <div className="flex animate-float-slow items-center justify-center rounded-[28px] border border-white/10 bg-white/10 px-6 py-5">
          <BrandLogo className="h-24 w-auto max-w-[280px]" />
        </div>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.34em] text-secondary-light">Plataforma Clinica</p>
        <p className="mt-3 max-w-xs text-sm text-white/72">Preparando um ambiente mais claro, elegante e rapido para a operacao da clinica.</p>
        <div className="mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-secondary-light via-white to-accent" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
