"use client";
import { motion, AnimatePresence } from "framer-motion";
import { RadicalFluidBackground } from "@/components/ui/radical-fluid-background";
import { X, Shield, FileText } from "lucide-react";
import { useEffect } from "react";

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    type: "privacy" | "terms";
}

export function LegalModal({ isOpen, onClose, title, type }: LegalModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const content = type === "privacy" ? (
        <div className="space-y-6 text-slate-600">
            <p><strong>CLASSIFIED PROTOCOL: DATA_PRIVACY_V1</strong></p>
            <p>
                The Tahoma Rocketry Club ("Command") is committed to protecting the digital footprint of all personnel ("Users").
                This secure channel outlines our protocols for data interception and storage.
            </p>
            <h3 className="text-xl font-bold text-slate-900 uppercase">1. Intel Collection</h3>
            <p>
                We collect minimal telemetry data:
                <br />- Callsigns (Names)
                <br />- Frequencies (Email Addresses)
                <br />- Transmission Logs (Messages)
            </p>
            <h3 className="text-xl font-bold text-slate-900 uppercase">2. Data Encryption</h3>
            <p>
                All sensitive data is encrypted at rest within our secure database mainframe (Supabase).
                Access is restricted to authorized High Command personnel only.
            </p>
            <h3 className="text-xl font-bold text-slate-900 uppercase">3. Third-Party Intercepts</h3>
            <p>
                We do not share intel with unauthorized third-party entities. Your data remains classified.
            </p>
        </div>
    ) : (
        <div className="space-y-6 text-slate-600">
            <p><strong>OPERATIONAL DIRECTIVE: TERMS_OF_SERVICE</strong></p>
            <p>
                By accessing this digital terminal, you agree to comply with the following operational directives.
            </p>
            <h3 className="text-xl font-bold text-slate-900 uppercase">1. Authorization</h3>
            <p>
                Access to the "Mission Archive" and "Command Dashboard" is a privilege.
                Unauthorized attempts to breach secure sectors will result in immediate termination of access.
            </p>
            <h3 className="text-xl font-bold text-slate-900 uppercase">2. Code of Conduct</h3>
            <p>
                All personnel must adhere to the highest standards of integrity.
                Disruptive transmissions or sabotage of digital assets is strictly prohibited.
            </p>
            <h3 className="text-xl font-bold text-slate-900 uppercase">3. Liability</h3>
            <p>
                The Tahoma Rocketry Club is not liable for any digital disorientation caused by our radical visual effects.
            </p>
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
                >
                    {/* Background Overlay */}
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-xl" onClick={onClose} />

                    {/* Radical Background Layer */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <RadicalFluidBackground />
                    </div>

                    {/* Modal Container */}
                    <motion.div
                        initial={{ y: 100, scale: 0.95, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 100, scale: 0.95, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-2xl max-h-[80vh] bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 md:p-8 border-b border-slate-900/5 flex items-center justify-between bg-white/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center">
                                    {type === "privacy" ? <Shield className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">{title}</h2>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Classified Document</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                            {content}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-900/5 bg-slate-50/50 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 bg-slate-900 text-white font-bold uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-colors"
                            >
                                Acknowledge
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
