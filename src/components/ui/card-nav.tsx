"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "HOME", href: "/", color: "bg-slate-900" },
    { name: "ABOUT", href: "/about", color: "bg-amber-500" },
    { name: "EVENTS", href: "/events", color: "bg-red-500" },
    { name: "GALLERY", href: "/gallery", color: "bg-blue-600" },
    { name: "JOIN", href: "/contact", color: "bg-slate-900" },
];

export function CardNav() {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2 p-2 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
            {navItems.map((item, index) => (
                <Link key={item.name} href={item.href}>
                    <motion.div
                        className={cn(
                            "relative w-16 h-16 flex items-center justify-center rounded-xl cursor-pointer overflow-hidden",
                            item.color
                        )}
                        onHoverStart={() => setHovered(index)}
                        onHoverEnd={() => setHovered(null)}
                        whileHover={{ width: 100, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <span className="text-white font-black text-xs z-10 mix-blend-difference">
                            {item.name}
                        </span>

                        {/* Hover Effect */}
                        <motion.div
                            className="absolute inset-0 bg-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hovered === index ? 0.2 : 0 }}
                        />
                    </motion.div>
                </Link>
            ))}
        </div>
    );
}
