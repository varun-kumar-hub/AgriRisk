"use client";

import React, { createContext, useContext, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (title: string, message?: string, type?: ToastType) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (title: string, message?: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toastHelpers: ToastContextType = {
    toast: addToast,
    success: (title, msg) => addToast(title, msg, "success"),
    error: (title, msg) => addToast(title, msg, "error"),
    warning: (title, msg) => addToast(title, msg, "warning"),
    info: (title, msg) => addToast(title, msg, "info")
  };

  return (
    <ToastContext.Provider value={toastHelpers}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl p-4 shadow-xl border backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-3 ${
              item.type === "success"
                ? "bg-emerald-950/90 text-white border-emerald-700"
                : item.type === "error"
                ? "bg-red-950/90 text-white border-red-700"
                : item.type === "warning"
                ? "bg-amber-950/90 text-white border-amber-700"
                : "bg-slate-900/90 text-white border-slate-700"
            }`}
          >
            {item.type === "success" && <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />}
            {item.type === "error" && <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />}
            {item.type === "warning" && <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />}
            {item.type === "info" && <Info size={20} className="text-sky-400 shrink-0 mt-0.5" />}

            <div className="flex-1">
              <h4 className="font-bold text-sm">{item.title}</h4>
              {item.message && <p className="text-xs text-slate-300 mt-0.5">{item.message}</p>}
            </div>

            <button
              onClick={() => removeToast(item.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
