"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function MagneticButton({ children, className, onClick, ...props }: MagneticButtonProps) {
    const ref = useRef<any>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current!.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.button
            {...(props as any)}
            style={{ position: "relative" }}
            ref={ref}
            onMouseMove={handleMouseMove as any}
            onMouseLeave={reset}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={cn("inline-block cursor-pointer", className)}
            onClick={onClick}
        >
            {children}
        </motion.button>
    );
}
