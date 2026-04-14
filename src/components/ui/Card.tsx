
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '', bodyClassName = '', actions }) => {
  return (
    <div className={`glass-surface-strong overflow-hidden rounded-[28px] text-slate-800 dark:text-slate-100 ${className}`}>
      {title && (
        <div className={`flex items-center justify-between border-b border-slate-200/80 px-5 py-4 dark:border-slate-800 ${titleClassName}`}>
          <h3 className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{title}</h3>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      <div className={`p-5 sm:p-6 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
