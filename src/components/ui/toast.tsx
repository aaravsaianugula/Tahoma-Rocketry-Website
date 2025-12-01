"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000); // Auto dismiss after 5s
    }, [removeToast]);

    const success = useCallback((message: string) => addToast(message, "success"), [addToast]);
    const error = useCallback((message: string) => addToast(message, "error"), [addToast]);
    const info = useCallback((message: string) => addToast(message, "info"), [addToast]);

    return (
        <ToastContext.Provider value={{ toast: addToast, success, error, info }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <GlassToast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function GlassToast({ message, type, onClose }: Toast & { onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            layout
            className={cn(
                "pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] min-w-[300px] max-w-md",
                type === "success" && "bg-emerald-50/60 border-emerald-100 text-emerald-900",
                type === "error" && "bg-rose-50/60 border-rose-100 text-rose-900",
                type === "info" && "bg-slate-50/60 border-slate-100 text-slate-900"
            )}
        >
            <div className={cn(
                "p-2 rounded-full shrink-0",
                type === "success" && "bg-emerald-100 text-emerald-600",
                type === "error" && "bg-rose-100 text-rose-600",
                type === "info" && "bg-slate-100 text-slate-600"
            )}>
                {type === "success" && <CheckCircle className="w-5 h-5" />}
                {type === "error" && <AlertCircle className="w-5 h-5" />}
                {type === "info" && <Info className="w-5 h-5" />}
            </div>

            <p className="font-bold text-sm tracking-wide flex-1">{message}</p>

            <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-black/5 transition-colors text-slate-400 hover:text-slate-600"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
