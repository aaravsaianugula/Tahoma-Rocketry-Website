"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightTextProps {
    text: string;
    className?: string;
    revealColor?: string;
    ghostOpacity?: number;
    spotlightSize?: number;
    mode?: "flashlight" | "focus"; // New prop to switch modes
}

export function SpotlightText({
    text,
    className = "",
    revealColor = "text-slate-900",
    ghostOpacity = 0.1,
    spotlightSize = 120,
    mode = "flashlight"
}: SpotlightTextProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn("relative inline-block overflow-hidden cursor-crosshair select-none", className)}
        >
            {/* Hidden Text (Ghost) */}
            <span
                className={cn("transition-all duration-500", mode === "focus" ? "text-slate-500 blur-sm opacity-40" : "text-slate-900")}
                style={{
                    opacity: mode === "focus" ? 0.4 : ghostOpacity,
                    filter: mode === "focus" ? "blur(4px)" : "blur(2px)"
                }}
            >
                {text}
            </span>

            {/* Revealed Text (Masked) */}
            <motion.div
                className={cn("absolute inset-0 z-10 pointer-events-none whitespace-nowrap", revealColor)}
                style={{
                    maskImage: `radial-gradient(circle ${spotlightSize}px at ${position.x}px ${position.y}px, black, transparent)`,
                    WebkitMaskImage: `radial-gradient(circle ${spotlightSize}px at ${position.x}px ${position.y}px, black, transparent)`,
                }}
                animate={{ opacity }}
                transition={{ duration: 0.2 }}
            >
                {text}
            </motion.div>
        </div>
    );
}
