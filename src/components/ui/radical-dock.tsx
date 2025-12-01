"use client";
import { cn } from "@/lib/utils";
import {
    AnimatePresence,
    MotionValue,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

export const RadicalDock = ({
    items,
    className,
    orientation = "horizontal",
}: {
    items: { title: string; icon: React.ReactNode; href: string }[];
    className?: string;
    orientation?: "horizontal" | "vertical";
}) => {
    let mouseX = useMotionValue(Infinity);
    let mouseY = useMotionValue(Infinity);

    const isVertical = orientation === "vertical";

    return (
        <motion.div
            onMouseMove={(e) => {
                mouseX.set(e.pageX);
                mouseY.set(e.pageY);
            }}
            onMouseLeave={() => {
                mouseX.set(Infinity);
                mouseY.set(Infinity);
            }}
            className={cn(
                "mx-auto flex gap-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl transition-all duration-500",
                isVertical
                    ? "flex-col w-16 h-auto items-center py-4 px-3"
                    : "h-16 items-end px-4 pb-3",
                className
            )}
        >
            {items.map((item) => (
                <IconContainer
                    mouseX={mouseX}
                    mouseY={mouseY}
                    key={item.title}
                    {...item}
                    orientation={orientation}
                />
            ))}
        </motion.div>
    );
};

function IconContainer({
    mouseX,
    mouseY,
    title,
    icon,
    href,
    orientation,
}: {
    mouseX: MotionValue;
    mouseY: MotionValue;
    title: string;
    icon: React.ReactNode;
    href: string;
    orientation: "horizontal" | "vertical";
}) {
    let ref = useRef<HTMLDivElement>(null);
    const isVertical = orientation === "vertical";

    let distance = useTransform(isVertical ? mouseY : mouseX, (val) => {
        let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0 };

        if (isVertical) {
            // For vertical, we care about Y distance + scrollY since pageY includes scroll
            // Actually pageY is document relative, getBoundingClientRect is viewport relative.
            // We need to adjust.
            // Let's use simple distance from center of element.
            // But mouseX/Y from parent are page coordinates.
            // Let's assume the parent passes page coordinates.
            // bounds.y + window.scrollY is the page Y position.
            const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
            const centerY = bounds.y + scrollY + bounds.height / 2;
            return val - centerY;
        } else {
            const scrollX = typeof window !== 'undefined' ? window.scrollX : 0;
            const centerX = bounds.x + scrollX + bounds.width / 2;
            return val - centerX;
        }
    });

    let sizeSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    let size = useSpring(sizeSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <Link href={href}>
            <motion.div
                ref={ref}
                style={isVertical ? { width: size, height: size } : { width: size }}
                className={cn(
                    "aspect-square rounded-full bg-slate-200/50 hover:bg-amber-300/80 flex items-center justify-center relative group transition-colors",
                    isVertical ? "w-10" : "h-10" // Base size fallback
                )}
            >
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, x: isVertical ? 20 : "-50%", y: isVertical ? "-50%" : 10, scale: 0.8 }}
                        whileHover={{ opacity: 1, x: isVertical ? 10 : "-50%", y: isVertical ? "-50%" : -20, scale: 1.1 }}
                        exit={{ opacity: 0, x: isVertical ? 20 : "-50%", y: isVertical ? "-50%" : 10, scale: 0.8 }}
                        className={cn(
                            "absolute px-4 py-2 whitespace-pre rounded-xl bg-slate-900 border-2 border-rose-500 text-white text-sm font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(251,113,133,1)] hidden group-hover:block z-50",
                            isVertical
                                ? "left-full top-1/2 -translate-y-1/2 ml-4"
                                : "-top-12 left-1/2 -translate-x-1/2"
                        )}
                    >
                        {title}
                    </motion.div>
                </AnimatePresence>
                <div className="h-5 w-5 text-slate-700 group-hover:text-slate-900 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
            </motion.div>
        </Link>
    );
}
