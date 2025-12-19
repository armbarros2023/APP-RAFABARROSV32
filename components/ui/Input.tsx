
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  wrapperClassName?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, id, wrapperClassName = '', className = '', error, ...props }) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-1 py-2 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-0 sm:text-sm text-slate-800 dark:text-slate-200 transition-colors ${className} ${error ? 'border-red-500 focus:border-red-500' : 'focus:border-primary dark:focus:border-primary-light'}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
