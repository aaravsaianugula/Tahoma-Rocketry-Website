"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useInView } from "framer-motion";

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

export function ShinyText({
    text,
    disabled = false,
    speed = 5,
    className,
}: ShinyTextProps) {
    const animationDuration = `${speed}s`;
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-10% 0px -10% 0px" });

    return (
        <div
            ref={ref}
            className={cn(
                "text-[#b5b5b5a4] bg-clip-text inline-block",
                disabled ? "" : (isInView ? "animate-shine" : ""),
                className
            )}
            style={{
                backgroundImage:
                    "linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                animationDuration: animationDuration,
            }}
        >
            {text}
        </div>
    );
}
