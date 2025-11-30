"use client";

import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import React, { useRef } from "react";

interface VelocityScrollProps {
    children: React.ReactNode;
    className?: string;
    skewFactor?: number;
}

export function VelocityScroll({ children, className, skewFactor = 5 }: VelocityScrollProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    const skew = useTransform(smoothVelocity, [-1000, 1000], [-skewFactor, skewFactor]);

    return (
        <motion.div
            ref={contentRef}
            className={className}
            style={{ skewY: skew }}
        >
            {children}
        </motion.div>
    );
}
