"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// Pro Radical Transitions (Enter-Only for Speed & Robustness)
const TRANSITIONS = ["luminous", "gridlock", "supersonic", "geometric"];

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [currentTransition, setCurrentTransition] = useState("luminous");

    useEffect(() => {
        // Immediate scroll reset
        window.scrollTo(0, 0);

        // Deterministic Transition Selection
        const hash = pathname.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const index = hash % TRANSITIONS.length;
        setCurrentTransition(TRANSITIONS[index]);

        // Show transition overlay
        setIsVisible(true);

        // Force Unmount Timer
        // Reduced to 600ms for snappier feel
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 600);

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <div className="relative w-full min-h-screen bg-white">
            {/* Content Layer - Always visible, never blocked */}
            <div className="opacity-100 relative z-0">
                {children}
            </div>

            {/* Transition Overlay Layer */}
            <AnimatePresence>
                {isVisible && (
                    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
                        <TransitionSelector variant={currentTransition} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TransitionSelector({ variant }: { variant: string }) {
    switch (variant) {
        case "luminous": return <LuminousTransition />;
        case "gridlock": return <GridlockTransition />;
        case "supersonic": return <SupersonicTransition />;
        case "geometric": return <GeometricTransition />;
        default: return <LuminousTransition />;
    }
}

// --- Pro Enter-Only Transition Components ---
// All transitions MUST:
// 1. Start Opaque (Cover the screen)
// 2. Animate to Transparent/Hidden
// 3. Be pointer-events-none (handled by container)

function LuminousTransition() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 bg-white flex items-center justify-center overflow-hidden"
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 2, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-[100vmax] h-[100vmax] bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.2)_0%,transparent_70%)] blur-3xl"
            />
        </motion.div>
    );
}

function GridlockTransition() {
    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
        >
            {/* Grid Background - Fades out */}
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "linear" }}
                className="absolute inset-0 bg-white"
            >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:60px_60px]" />
            </motion.div>

            {/* Swipe Effect */}
            <motion.div
                initial={{ height: "100%" }}
                animate={{ height: "0%" }}
                exit={{ height: "0%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute w-full bg-slate-900/5 backdrop-blur-sm top-0"
            />
        </motion.div>
    );
}

function SupersonicTransition() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute inset-0 bg-white flex items-center justify-center overflow-hidden"
        >
            <motion.div
                initial={{ scale: 0, borderWidth: "0px", opacity: 0.8 }}
                animate={{ scale: 4, borderWidth: "50px", opacity: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="absolute w-[40vw] h-[40vw] rounded-full border-cyan-400/50"
            />
        </motion.div>
    );
}

function GeometricTransition() {
    return (
        <motion.div
            initial={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
            animate={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
            exit={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-slate-900 flex items-center justify-center"
        >
            <div className="absolute inset-0 bg-white transform -skew-x-12 translate-x-1/2" />
        </motion.div>
    );
}
