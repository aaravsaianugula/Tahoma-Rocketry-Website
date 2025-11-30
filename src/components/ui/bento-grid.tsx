"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <motion.div
            whileHover={{ scale: 0.98 }}
            className={cn(
                "row-span-1 rounded-3xl group/bento hover:shadow-2xl transition duration-500 shadow-input dark:shadow-none p-6 bg-white/95 border border-white/50 justify-between flex flex-col space-y-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] will-change-transform backface-hidden",
                className
            )}
        >
            {/* VisionOS Shine */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500" />
            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-200">
                {icon}
                <div className="font-sans font-bold text-slate-900 dark:text-neutral-200 mb-2 mt-2">
                    {title}
                </div>
                <div className="font-sans font-normal text-slate-600 text-xs dark:text-neutral-300">
                    {description}
                </div>
            </div>
        </motion.div>
    );
};
