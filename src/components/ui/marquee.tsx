"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
    children: React.ReactNode;
    className?: string;
    reverse?: boolean;
    pauseOnHover?: boolean;
    repeat?: number;
}

export function Marquee({
    children,
    className,
    reverse = false,
    pauseOnHover = false,
    repeat = 4,
}: MarqueeProps) {
    return (
        <div className={cn("group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]", className)}>
            {Array(repeat)
                .fill(0)
                .map((_, i) => (
                    <motion.div
                        key={i}
                        className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
                            "animate-marquee": !reverse,
                            "animate-marquee-reverse": reverse,
                            "group-hover:[animation-play-state:paused]": pauseOnHover,
                        })}
                        animate={{
                            x: reverse ? ["0%", "100%"] : ["0%", "-100%"],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{
                            // We use framer motion for the animation to ensure smoothness
                            // But we can also use CSS animation if preferred. 
                            // For now, let's stick to Framer Motion for consistency.
                            minWidth: "100%",
                        }}
                    >
                        {children}
                    </motion.div>
                ))}
        </div>
    );
}
