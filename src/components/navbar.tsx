"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, User, Settings, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS } from "@/data/site-data";
import { ShinyText } from "@/components/ui/shiny-text";
import { createClient } from "@/utils/supabase/client";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const lastScrollY = useRef(0);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    // Check auth status
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 20);
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null); // Explicitly clear local state
        setShowUserMenu(false);
        window.location.href = '/'; // Force hard refresh to clear any stuck states
    };

    // Get user display info
    const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
    const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
    const userInitial = userName.charAt(0).toUpperCase();
    const isAdmin = user?.email === 'aaravsai.anugula@gmail.com' || user?.user_metadata?.role === 'admin';

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

                {/* CTA & Mobile Toggle */}
                <div className="flex items-center gap-4">
                    {user ? (
                        /* User Avatar & Dropdown */
                        <div className="relative hidden md:block" ref={userMenuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-300 border border-slate-200"
                            >
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                                    {userAvatar ? (
                                        <Image
                                            src={userAvatar}
                                            alt={userName}
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        userInitial
                                    )}
                                </div>
                                <span className="font-medium text-slate-700 text-sm max-w-[100px] truncate">{userName}</span>
                                <ChevronDown className={cn(
                                    "w-4 h-4 text-slate-500 transition-transform duration-200",
                                    showUserMenu && "rotate-180"
                                )} />
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden"
                                    >
                                        {/* User Info */}
                                        <div className="p-4 border-b-2 border-slate-100 bg-slate-50/50">
                                            <p className="font-black text-slate-900 truncate uppercase tracking-tight">{userName}</p>
                                            <p className="text-xs font-bold text-slate-500 truncate">{user.email}</p>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="p-2 space-y-1">
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    window.location.href = isAdmin ? "/dashboard/admin" : "/dashboard";
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 font-bold hover:bg-slate-100 hover:text-slate-900 hover:border-slate-900 border-2 border-transparent transition-all"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                <span className="text-sm">Dashboard</span>
                                            </button>
                                            <Link
                                                href="/settings"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 font-bold hover:bg-slate-100 hover:text-slate-900 hover:border-slate-900 border-2 border-transparent transition-all"
                                            >
                                                <Settings className="w-4 h-4" />
                                                <span className="text-sm">Settings</span>
                                            </Link>
                                        </div>

                                        {/* Logout */}
                                        <div className="p-2 border-t-2 border-slate-100">
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    handleLogout();
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-500 font-bold hover:bg-rose-50 hover:border-rose-200 border-2 border-transparent transition-all"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span className="text-sm">Sign Out</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        /* Sign In Button */
                        <Link
                            href="/login"
                            className="hidden md:flex items-center gap-2 px-6 py-2 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-lg shadow-slate-900/20 hover:shadow-rose-500/30"
                        >
                            Sign In
                        </Link>
                    )}

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
                            {/* Mobile User Info */}
                            {user && (
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold">
                                        {userAvatar ? (
                                            <Image src={userAvatar} alt={userName} width={48} height={48} className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            userInitial
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{userName}</p>
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                            )}

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

                            {user ? (
                                <>
                                    <Link
                                        href={isAdmin ? "/dashboard/admin" : "/dashboard"}
                                        onClick={() => setIsOpen(false)}
                                        className="text-base font-medium py-2 text-slate-600 border-b border-slate-100"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/settings"
                                        onClick={() => setIsOpen(false)}
                                        className="text-base font-medium py-2 text-slate-600 border-b border-slate-100"
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="text-center py-3 rounded-lg bg-rose-500 text-white font-bold"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="text-center py-3 rounded-lg bg-slate-900 text-white font-bold"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
