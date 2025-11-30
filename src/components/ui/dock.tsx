"use client";

import { MotionValue, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DockProps {
    className?: string;
    items: {
        icon: React.ReactNode;
        label: string;
        href: string;
    }[];
}

export function Dock({ className, items }: DockProps) {
    const mouseX = useMotionValue(Infinity);

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "mx-auto flex h-16 items-end gap-4 rounded-2xl bg-slate-900/50 px-4 pb-3 backdrop-blur-md border border-white/10",
                className
            )}
        >
            {items.map((item, i) => (
                <DockIcon mouseX={mouseX} key={i} href={item.href} label={item.label}>
                    {item.icon}
                </DockIcon>
            ))}
        </motion.div>
    );
}

function DockIcon({
    mouseX,
    children,
    href,
    label,
}: {
    mouseX: MotionValue;
    children: React.ReactNode;
    href: string;
    label: string;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <Link href={href}>
            <motion.div
                ref={ref}
                style={{ width }}
                className="aspect-square w-10 rounded-full bg-slate-800 flex items-center justify-center relative group"
            >
                <div className="w-full h-full flex items-center justify-center text-white">
                    {children}
                </div>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 w-auto px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
                    {label}
                </span>
            </motion.div>
        </Link>
    );
}
