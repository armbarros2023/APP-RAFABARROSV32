
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  wrapperClassName?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  wrapperClassName = '',
  className = '',
  error,
  leftIcon,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:-translate-y-0.5 dark:bg-slate-950/40 dark:text-slate-100 dark:placeholder:text-slate-500 ${leftIcon ? 'pl-12' : ''} ${className} ${error ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200/90 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:focus:border-primary/40 dark:focus:ring-primary/10'}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
