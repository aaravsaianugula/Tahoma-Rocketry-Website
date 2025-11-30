"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS } from "@/data/site-data";
import { ShinyText } from "@/components/ui/shiny-text";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Determine if scrolled for background style
            setScrolled(currentScrollY > 20);

            // Determine direction for visibility
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsVisible(false); // Scrolling DOWN -> Hide
            } else {
                setIsVisible(true); // Scrolling UP -> Show
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (pathname.startsWith("/dashboard")) return null;

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-[100] transition-all duration-500",
                scrolled ? "py-2" : "py-5",
                isVisible ? "translate-y-0" : "-translate-y-full"
            )}
        >
            <div className={cn(
                "absolute inset-0 transition-all duration-500 pointer-events-none",
                scrolled ? "opacity-100" : "opacity-0"
            )}>
                <div className="absolute inset-0 backdrop-blur-2xl backdrop-saturate-150 bg-white/10 border-b border-white/20 shadow-sm" />
                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>
            <div className="container-width flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 shadow-md transition-transform group-hover:scale-105 duration-300 bg-white">
                        <Image
                            src="/assets/Logo.png"
                            alt="TRC Logo"
                            fill
                            className="object-cover scale-110"
                        />
                    </div>
                    <ShinyText
                        text="TRC"
                        speed={3}
                        className="font-black italic text-3xl tracking-tighter text-slate-900 group-hover:text-rose-500 transition-colors"
                    />
                </Link>

                {/* Desktop Nav - REMOVED as per user feedback "don't need this" */}

                {/* CTA & Mobile Toggle */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="hidden md:flex items-center gap-2 px-6 py-2 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-lg shadow-slate-900/20 hover:shadow-rose-500/30"
                    >
                        Sign In
                    </Link>

                    <button
                        className="md:hidden text-slate-900"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-xl border-b border-white/50 overflow-hidden"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "text-base font-medium py-2 border-b border-slate-100",
                                        pathname === item.href ? "text-blue-600" : "text-slate-600"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Link
                                href="/dashboard/student"
                                onClick={() => setIsOpen(false)}
                                className="text-base font-medium py-2 text-slate-500"
                            >
                                Student Dashboard
                            </Link>
                            <Link
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="text-center py-3 rounded-lg bg-slate-900 text-white font-bold"
                            >
                                Join Mission
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
