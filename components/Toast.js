import React, { useState, useEffect, createContext, useContext } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-6 py-3 rounded-lg shadow-2xl transition-all duration-300 animate-slide-in ${
              t.type === 'error' 
                ? 'bg-red-900/90 border border-red-500 text-white' 
                : 'bg-emerald-950/95 border border-gold text-gold'
            }`}
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <div className="flex items-center gap-2">
              {t.type === 'error' ? (
                <i className="fas fa-exclamation-circle text-red-500" />
              ) : (
                <i className="fas fa-check-circle text-gold" />
              )}
              <span className="font-medium">{t.message}</span>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
