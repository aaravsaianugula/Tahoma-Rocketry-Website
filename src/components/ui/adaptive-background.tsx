"use client";

import { useScroll, useTransform, motion } from "framer-motion";

export function AdaptiveBackground() {
    const { scrollYProgress } = useScroll();

    const backgroundGradient = useTransform(
        scrollYProgress,
        [0, 0.25, 0.5, 0.75, 1],
        [
            "linear-gradient(to bottom right, #FDFBF7, #FEF3C7)", // Cream -> Pastel Gold
            "linear-gradient(to bottom right, #FEF3C7, #FFE4E6)", // Pastel Gold -> Pastel Rose
            "linear-gradient(to bottom right, #FFE4E6, #E0F2FE)", // Pastel Rose -> Pastel Blue
            "linear-gradient(to bottom right, #E0F2FE, #FEF3C7)", // Pastel Blue -> Pastel Gold
            "linear-gradient(to bottom right, #FEF3C7, #FDFBF7)", // Pastel Gold -> Cream
        ]
    );

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden">
            {/* Base Gradient Layer (Scroll Adaptive) */}
            <motion.div
                className="absolute inset-0 opacity-80"
                style={{ background: backgroundGradient }}
            />

            {/* Breathing Orbs Layer (Continuous Motion) */}
            <motion.div
                className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-amber-200/30 blur-[100px]"
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-rose-200/20 blur-[120px]"
                animate={{
                    x: [0, -100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />
            <motion.div
                className="absolute top-[40%] left-[30%] w-[50vw] h-[50vw] rounded-full bg-blue-200/20 blur-[90px]"
                animate={{
                    x: [0, 50, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5,
                }}
            />
        </div>
    );
}
