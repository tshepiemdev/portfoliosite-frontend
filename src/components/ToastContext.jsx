import { createContext, useContext, useState } from "react";
import LargeToast from "./LargeToast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (status, title, message, duration = 3000) => {
    setToast({ status, title, message, duration });
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <LargeToast
          status={toast.status}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
