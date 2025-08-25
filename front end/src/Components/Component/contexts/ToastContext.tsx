
// ToastContext.js
import React, { createContext, useState, useContext,ReactNode } from 'react';
import GlobalToast from '../Global/GlobalToast';


type ToastType = 'success' | 'danger' | 'warning' | 'info';

type ToastState = {
  isVisible: boolean;
  message: string;
  type: ToastType;
};

interface ToastProviderProps {
  children: ReactNode;
}
type ToastContextType = {
  toast: ToastState;
  showToast: (message: string, type?: ToastType) => void;
  hideToast?: () => void; // Optional hide function
};


const ToastContext = createContext<ToastContextType | undefined>(undefined);



export const ToastProvider = ({ children }:ToastProviderProps) => {
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: '',
    type: 'success' // 'success', 'danger', 'warning', 'info'
  });

  const showToast = (message:string, type :ToastType='success' ) => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <ToastContext.Provider value={{toast, showToast, hideToast }}>
      {children}
      <GlobalToast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
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