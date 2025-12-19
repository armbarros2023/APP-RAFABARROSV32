
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
    <div className={`bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className={`p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center ${titleClassName}`}>
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      <div className={`p-4 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
