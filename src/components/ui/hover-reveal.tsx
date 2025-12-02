"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
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
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            <div className="flex flex-col">
                {items.map((item) => (
                    <RevealItem
                        key={item.id}
                        item={item}
                        onInView={(imageUrl) => setActiveImage(imageUrl)}
                    />
                ))}
            </div>

            {/* Fixed Image Display */}
            <motion.div
                className="fixed top-1/2 right-[10%] -translate-y-1/2 z-50 w-[300px] h-[400px] overflow-hidden border-4 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] hidden lg:block pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: activeImage ? 1 : 0,
                    scale: activeImage ? 1 : 0.8,
                    rotate: activeImage ? 5 : 0
                }}
                transition={{ duration: 0.3 }}
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

function RevealItem({ item, onInView }: { item: HoverRevealItem, onInView: (url: string) => void }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

    useEffect(() => {
        if (isInView) {
            onInView(item.imageUrl);
        }
    }, [isInView, item.imageUrl, onInView]);

    return (
        <motion.div
            ref={ref}
            className={cn(
                "group relative flex items-center justify-between py-12 border-b-2 border-slate-900 transition-colors px-4",
                isInView ? "bg-slate-900 text-white" : "text-slate-900"
            )}
        >
            <span className="text-4xl md:text-6xl font-black uppercase tracking-tighter z-10 relative">
                {item.title}
            </span>
            <span className="text-xl font-mono z-10 relative">
                {item.subtitle}
            </span>
        </motion.div>
    );
}
