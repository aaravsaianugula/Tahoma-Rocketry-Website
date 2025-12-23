"use client";

import { cn } from "@/lib/utils";

interface AppleGlassProps {
    children: React.ReactNode;
    className?: string;
    intensity?: "low" | "medium" | "high" | "ultra";
}

export function AppleGlass({ children, className, intensity = "medium" }: AppleGlassProps) {
    const blurMap = {
        low: "backdrop-blur-lg backdrop-saturate-150 bg-white/40 dark:bg-black/40 border-white/20 dark:border-white/10",
        medium: "backdrop-blur-2xl backdrop-saturate-180 bg-white/60 dark:bg-black/60 border-white/30 dark:border-white/10",
        high: "backdrop-blur-3xl backdrop-saturate-200 bg-white/70 dark:bg-black/70 border-white/40 dark:border-white/20",
        ultra: "backdrop-blur-[50px] backdrop-saturate-[180%] bg-white/80 dark:bg-black/80 border-white/40 dark:border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.10)]",
    };

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-3xl border shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] transition-all duration-500 hover:shadow-[0_16px_64px_0_rgba(31,38,135,0.15)] hover:border-white/40 hover:bg-white/15 dark:hover:bg-white/5 group",
                blurMap[intensity],
                className
            )}
        >
            {/* VisionOS "Specularity" - Top Shine */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-500" />

            {/* VisionOS "Depth" - Inner Shadow */}
            <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] pointer-events-none" />

            {/* Subtle Noise for Texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
