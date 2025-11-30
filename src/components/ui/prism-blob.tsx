"use client";
import { motion } from "framer-motion";

export function PrismBlob() {
    return (
        <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full z-0 pointer-events-none mix-blend-multiply filter blur-[80px] opacity-40"
            style={{
                background: "conic-gradient(from 0deg, #fde68a, #fecdd3, #bae6fd, #fde68a)",
            }}
            animate={{
                rotate: 360,
                scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            }}
        />
    );
}
