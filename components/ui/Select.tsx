
import React from 'react';

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
}

const Select: React.FC<SelectProps> = ({ label, id, options, wrapperClassName = '', className = '', error, placeholder, ...rest }) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={selectId} className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-1 py-2 bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-0 sm:text-sm text-slate-800 dark:text-slate-200 transition-colors ${className} ${error ? 'border-red-500 focus:border-red-500' : 'focus:border-primary dark:focus:border-primary-light'}`}
        {...rest} // Spread the rest of the props; placeholder is not included
      >
        {/* Render the placeholder option as per original logic if placeholder prop is provided */}
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
