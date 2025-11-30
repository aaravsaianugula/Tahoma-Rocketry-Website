"use client";

import { cn } from "@/lib/utils";

interface FluidGlassProps {
    children: React.ReactNode;
    className?: string;
    intensity?: "low" | "medium" | "high";
}

export function FluidGlass({ children, className, intensity = "medium" }: FluidGlassProps) {
    const blurMap = {
        low: "backdrop-blur-sm",
        medium: "backdrop-blur-md",
        high: "backdrop-blur-xl",
    };

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/40 bg-white/80 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]",
                blurMap[intensity],
                className
            )}
        >
            {/* Fluid Noise Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Iridescent Sheen */}
            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 animate-shine pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
