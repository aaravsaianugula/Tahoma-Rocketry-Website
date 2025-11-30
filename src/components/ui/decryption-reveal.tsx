"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";

interface DecryptionRevealProps {
    text: string;
    className?: string;
    revealColor?: string;
}

export function DecryptionReveal({ text, className, revealColor = "text-slate-900" }: DecryptionRevealProps) {
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-reveal on mount
    useEffect(() => {
        let pos = 0;
        // Initial scramble
        const scrambleInterval = setInterval(() => {
            const scrambled = text.split("")
                .map((char, index) => {
                    if (index < pos) return text[index];
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join("");
            setDisplayText(scrambled);
        }, 30);

        // Start revealing after 500ms
        const revealTimeout = setTimeout(() => {
            clearInterval(scrambleInterval);
            
            intervalRef.current = setInterval(() => {
                const scrambled = text.split("")
                    .map((char, index) => {
                        if (index < pos) return text[index];
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("");
                setDisplayText(scrambled);
                pos += 1 / 2; // Speed of reveal
                if (pos >= text.length) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            }, 30);
        }, 500);

        return () => {
            clearInterval(scrambleInterval);
            clearTimeout(revealTimeout);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [text]);

    const handleMouseEnter = () => {
        // Optional: Re-scramble and reveal on hover? 
    };

    return (
        <motion.span
            className={cn("inline-block font-mono", className, revealColor)}
        >
            {displayText}
        </motion.span>
    );
}
