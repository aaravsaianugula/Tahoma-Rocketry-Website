"use client";

import React, { useState, useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HoverRevealItem {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
}

interface HoverRevealProps {
    items: HoverRevealItem[];
    className?: string;
}

export function HoverReveal({ items, className }: HoverRevealProps) {
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 100, damping: 15 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const handleMouseMove = (e: MouseEvent) => {
        x.set(e.clientX);
        y.set(e.clientY);
    };

    return (
        <div
            className={cn("relative w-full", className)}
            onMouseMove={handleMouseMove}
        >
            {/* List Items */}
            <div className="flex flex-col">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className="group relative flex items-center justify-between py-8 border-b-2 border-slate-900 cursor-none hover:bg-slate-900 hover:text-white transition-colors px-4"
                        onMouseEnter={() => {
                            setActiveImage(item.imageUrl);
                            setActiveIndex(index);
                        }}
                        onMouseLeave={() => {
                            setActiveImage(null);
                            setActiveIndex(null);
                        }}
                    >
                        <span className="text-4xl md:text-6xl font-black uppercase tracking-tighter z-10 relative">
                            {item.title}
                        </span>
                        <span className="text-xl font-mono z-10 relative">
                            {item.subtitle}
                        </span>
                    </div>
                ))}
            </div>

            {/* Floating Image */}
            <motion.div
                style={{
                    x: xSpring,
                    y: ySpring,
                    top: 0,
                    left: 0,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                className="fixed pointer-events-none z-50 w-[300px] h-[400px] overflow-hidden border-4 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] hidden md:block"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: activeImage ? 1 : 0,
                    scale: activeImage ? 1 : 0.5,
                    rotate: activeIndex !== null ? (activeIndex % 2 === 0 ? 5 : -5) : 0
                }}
            >
                {activeImage && (
                    <Image
                        src={activeImage}
                        alt="Reveal"
                        fill
                        className="object-cover"
                    />
                )}
            </motion.div>
        </div>
    );
}
