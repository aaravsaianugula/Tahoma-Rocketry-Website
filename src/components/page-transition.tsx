"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// Pro Radical Transitions (Enter-Only for Speed & Robustness)
const TRANSITIONS = [
    "generative", // Procedurally generated every time
    "glitch-tear",
    "tunnel-warp",
    "pixel-shutter",
    "curtain-wipe",
    "luminous",
    "supersonic"
];

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [currentTransition, setCurrentTransition] = useState("generative");
    const [seed, setSeed] = useState(0); // Force re-render for generative

    useEffect(() => {
        // Immediate scroll reset
        window.scrollTo(0, 0);

        // True Random Selection
        const randomIndex = Math.floor(Math.random() * TRANSITIONS.length);
        setCurrentTransition(TRANSITIONS[randomIndex]);
        setSeed(Math.random());

        // Show transition overlay
        setIsVisible(true);

        // Force Unmount Timer
        // Slightly longer for complex animations
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <div className="relative w-full min-h-screen bg-white">
            {/* Content Layer - Always visible, never blocked */}
            <div className="opacity-100 relative z-0">
                {children}
            </div>

            {/* Transition Overlay Layer */}
            <AnimatePresence mode="wait">
                {isVisible && (
                    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
                        <TransitionSelector variant={currentTransition} seed={seed} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TransitionSelector({ variant, seed }: { variant: string, seed: number }) {
    switch (variant) {
        case "generative": return <GenerativeTransition seed={seed} />;
        case "glitch-tear": return <GlitchTearTransition />;
        case "tunnel-warp": return <TunnelWarpTransition />;
        case "pixel-shutter": return <PixelShutterTransition />;
        case "curtain-wipe": return <CurtainWipeTransition />;
        case "luminous": return <LuminousTransition />;
        case "supersonic": return <SupersonicTransition />;
        default: return <GenerativeTransition seed={seed} />;
    }
}

// --- Pro Enter-Only Transition Components ---

function GenerativeTransition({ seed }: { seed: number }) {
    // Procedural Generation Logic
    const colors = ["#f43f5e", "#f59e0b", "#06b6d4", "#0f172a"]; // Rose, Amber, Cyan, Slate
    const shapes = ["circle", "rect"];
    const motions = ["scale", "rotate", "slide"];

    // Deterministic pseudo-random based on seed for this render
    const pseudoRandom = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000;
        return x - Math.floor(x);
    };

    const color = colors[Math.floor(pseudoRandom(1) * colors.length)];
    const shape = shapes[Math.floor(pseudoRandom(2) * shapes.length)];
    const motionType = motions[Math.floor(pseudoRandom(3) * motions.length)];
    const direction = pseudoRandom(4) > 0.5 ? 1 : -1;

    const variants = {
        initial: {
            opacity: 1,
            scale: motionType === "scale" ? 0 : 1,
            rotate: motionType === "rotate" ? 180 * direction : 0,
            x: motionType === "slide" ? 100 * direction + "%" : 0,
        },
        animate: {
            opacity: 0,
            scale: motionType === "scale" ? 2 : 1,
            rotate: 0,
            x: 0,
        }
    };

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="absolute inset-0 flex items-center justify-center bg-white overflow-hidden"
        >
            <motion.div
                initial={variants.initial}
                animate={variants.animate}
                transition={{ duration: 0.6, ease: "backOut" }}
                className="absolute"
                style={{
                    width: "100vmax",
                    height: "100vmax",
                    backgroundColor: color,
                    borderRadius: shape === "circle" ? "50%" : "0%",
                }}
            />
        </motion.div>
    );
}

function GlitchTearTransition() {
    const slices = 10;
    return (
        <div className="absolute inset-0 flex flex-col overflow-hidden bg-white">
            {Array.from({ length: slices }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ x: i % 2 === 0 ? "100%" : "-100%" }}
                    animate={{ x: "0%" }}
                    exit={{ x: i % 2 === 0 ? "-100%" : "100%" }} // Not used in enter-only but good for reference
                    transition={{ duration: 0.4, delay: i * 0.05, ease: "circOut" }}
                    className="flex-1 w-full bg-slate-900 relative"
                    style={{
                        backgroundColor: i % 3 === 0 ? "#f43f5e" : (i % 3 === 1 ? "#06b6d4" : "#0f172a")
                    }}
                />
            ))}
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.1, delay: 0.6 }}
                className="absolute inset-0 bg-white z-50"
            />
        </div>
    );
}

function TunnelWarpTransition() {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0, border: "2px solid #06b6d4" }}
                    animate={{ scale: 20, opacity: [0, 1, 0], borderWidth: ["2px", "50px", "0px"] }}
                    transition={{ duration: 1, delay: i * 0.1, ease: "easeIn" }}
                    className="absolute w-[10vw] h-[10vw] rounded-full"
                />
            ))}
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute inset-0 bg-white"
            />
        </div>
    );
}

function PixelShutterTransition() {
    const blocks = Array.from({ length: 100 }); // 10x10 grid
    return (
        <div className="absolute inset-0 flex flex-wrap">
            {blocks.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 0, scale: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: Math.random() * 0.3,
                        ease: "easeIn"
                    }}
                    className="w-[10vw] h-[10vh] bg-slate-900 border-[0.5px] border-slate-800"
                />
            ))}
        </div>
    );
}

function CurtainWipeTransition() {
    return (
        <div className="absolute inset-0 flex">
            <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-1/2 h-full bg-rose-500 origin-left"
            />
            <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-1/2 h-full bg-amber-400 origin-right"
            />
        </div>
    );
}

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
