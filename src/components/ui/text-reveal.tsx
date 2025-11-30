"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

export function TextReveal({ text, className, delay = 0, as: Component = "div" }: TextRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

    const variants = {
        hidden: { y: "100%" },
        visible: { y: 0 },
    };

    return (
        <Component ref={ref} className={cn("overflow-hidden block leading-tight", className)}>
            <motion.span
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={variants}
                transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for "editorial" feel
                    delay: delay,
                }}
                className="block"
            >
                {text}
            </motion.span>
        </Component>
    );
}
