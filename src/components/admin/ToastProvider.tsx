"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

type ToastItem = { id: number; type: "success" | "error"; message: string };
type ToastApi = { success: (message: string) => void; error: (message: string) => void };

const ToastContext = createContext<ToastApi | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast phải được gọi bên trong ToastProvider");
  return ctx;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((type: ToastItem["type"], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  const api: ToastApi = {
    success: (message) => push("success", message),
    error: (message) => push("error", message),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[999] flex w-full max-w-xs flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-2 rounded-md border px-3 py-2.5 text-sm shadow-sm ${
              t.type === "success"
                ? "border-accent/30 bg-white text-ink"
                : "border-red-200 bg-white text-ink"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" />
            ) : (
              <XCircle size={16} className="mt-0.5 shrink-0 text-red-600" />
            )}
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))}
              className="shrink-0 text-muted hover:text-ink"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
