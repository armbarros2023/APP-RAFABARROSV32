
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckIcon, LockClosedIcon } from '../components/icons/HeroIcons';

// Icon for Error (X mark)
const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ExclamationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  );

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center w-full max-w-sm overflow-hidden bg-white dark:bg-slate-800 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 animate-fade-in ${
              toast.type === 'success' ? 'border-green-500' : toast.type === 'error' ? 'border-red-500' : 'border-blue-500'
            }`}
            role="alert"
          >
            <div className="p-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    toast.type === 'success' ? 'bg-green-100 text-green-500' : toast.type === 'error' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'
                }`}>
                    {toast.type === 'success' && <CheckIcon className="w-5 h-5" />}
                    {toast.type === 'error' && <XMarkIcon className="w-5 h-5" />}
                    {toast.type === 'info' && <ExclamationIcon className="w-5 h-5" />}
                </div>
            </div>
            <div className="px-2 py-3 -mx-3">
              <div className="mx-3">
                <span className={`font-semibold ${
                     toast.type === 'success' ? 'text-green-500' : toast.type === 'error' ? 'text-red-500' : 'text-blue-500'
                }`}>
                    {toast.type === 'success' ? 'Sucesso' : toast.type === 'error' ? 'Erro' : 'Informação'}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-300">{toast.message}</p>
              </div>
            </div>
             <button onClick={() => removeToast(toast.id)} className="p-2 ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <XMarkIcon className="w-4 h-4" />
             </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
