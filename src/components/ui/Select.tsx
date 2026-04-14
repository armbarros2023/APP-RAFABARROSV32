
import React from 'react';
import { ChevronDownIcon } from '../icons/HeroIcons';

interface SelectOption {
  value: string | number;
  label: string;
}

// Omit 'placeholder' from HTMLSelectAttributes if it even exists there for select, 
// as we handle it customly. Define our own 'placeholder' prop.
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'placeholder'> {
  label?: string;
  options: SelectOption[];
  wrapperClassName?: string;
  error?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  label,
  id,
  options,
  wrapperClassName = '',
  className = '',
  error,
  placeholder,
  leftIcon,
  ...rest
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={selectId} className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            {leftIcon}
          </span>
        )}
        <select
          id={selectId}
          className={`w-full appearance-none rounded-2xl border bg-white/80 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200 focus:-translate-y-0.5 dark:bg-slate-950/40 dark:text-slate-100 ${leftIcon ? 'pl-12' : ''} ${className} ${error ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200/90 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:focus:border-primary/40 dark:focus:ring-primary/10'}`}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
