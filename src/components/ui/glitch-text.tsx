"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";

interface GlitchTextProps {
    text: string;
    className?: string;
    as?: React.ElementType;
}

export function GlitchText({ text, className }: { text: string; className?: string }) {
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
    const hasAnimated = useRef(false);

    const scramble = () => {
        let pos = 0;

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            const scrambled = text.split("")
                .map((char, index) => {
                    if (index < pos) {
                        return text[index];
                    }
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join("");

            setDisplayText(scrambled);
            pos += 1 / 3;

            if (pos >= text.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
        }, 30);
    };

    useEffect(() => {
        if (isInView && !hasAnimated.current) {
            scramble();
            hasAnimated.current = true;
        }
    }, [isInView]);

    return (
        <span
            ref={ref}
            className={cn("inline-block cursor-default", className)}
            onMouseEnter={scramble}
        >
            {displayText}
        </span>
    );
}
