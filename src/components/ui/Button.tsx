
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-2xl border text-sm font-semibold tracking-tight transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-60';

  const sizeStyles = {
    sm: 'min-h-[38px] px-3.5 py-2',
    md: 'min-h-[44px] px-4.5 py-2.5',
    lg: 'min-h-[52px] px-6 py-3 text-base',
  };

  const variantStyles = {
    primary:
      'border-primary/80 bg-gradient-to-r from-primary to-secondary text-white shadow-[0_18px_30px_-18px_rgba(15,118,110,0.9)] hover:-translate-y-0.5 hover:shadow-[0_24px_36px_-18px_rgba(15,118,110,0.8)]',
    secondary:
      'border-secondary/70 bg-secondary text-white shadow-[0_16px_30px_-20px_rgba(20,184,166,0.85)] hover:-translate-y-0.5 hover:bg-primary',
    danger:
      'border-red-500/70 bg-red-500 text-white shadow-[0_16px_30px_-20px_rgba(239,68,68,0.9)] hover:-translate-y-0.5 hover:bg-red-600',
    outline:
      'border-slate-200/90 bg-white/70 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:border-primary/40 dark:hover:text-primary-light',
    ghost:
      'border-transparent bg-transparent text-slate-600 hover:bg-primary/10 hover:text-primary dark:text-slate-300 dark:hover:bg-primary/15 dark:hover:text-primary-light',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
    
