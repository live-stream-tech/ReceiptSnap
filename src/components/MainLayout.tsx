"use client";
import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { useStore } from "@/store";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

let _toastListeners: ((t: Toast) => void)[] = [];

export function showToast(message: string, type: Toast["type"] = "info") {
  const t: Toast = { id: crypto.randomUUID(), message, type };
  _toastListeners.forEach((fn) => fn(t));
}

function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    const handler = (t: Toast) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 3500);
    };
    _toastListeners.push(handler);
    return () => { _toastListeners = _toastListeners.filter((fn) => fn !== handler); };
  }, []);
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4">
      {toasts.map((t) => (
        <div key={t.id} className={`rounded-2xl px-5 py-3.5 text-sm font-bold text-white shadow-lg animate-fade-up ${
          t.type === "success" ? "bg-emerald-500" : t.type === "error" ? "bg-red-500" : "bg-sky-500"
        }`}>{t.message}</div>
      ))}
    </div>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const loadReceipts = useStore((s) => s.loadReceipts);

  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="bg-orb w-96 h-96 bg-sky-300" style={{ top: "-80px", right: "10%", animationDelay: "0s" }} />
      <div className="bg-orb w-80 h-80 bg-teal-300" style={{ bottom: "10%", left: "20%", animationDelay: "2s" }} />
      <div className="bg-orb w-64 h-64 bg-emerald-200" style={{ top: "40%", right: "5%", animationDelay: "4s" }} />
      <Navigation />
      <ToastContainer />
      <main className="md:ml-64 pt-16 md:pt-0 pb-24 md:pb-8 relative z-10">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
