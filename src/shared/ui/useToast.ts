import { createContext, useContext } from "react";

export type ToastMessageInput = {
  title: string;
  description?: string;
  variant?: "default" | "error";
};

export type ToastContextValue = {
  toast: (message: ToastMessageInput) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
