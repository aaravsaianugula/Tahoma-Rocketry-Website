"use client";
import { useState } from "react";
import { DotPattern } from "@/components/ui/dot-pattern";
import { FadeIn, ShinyText } from "@/components/ui/text-animations";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { GlitchText } from "@/components/ui/glitch-text";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, Rocket } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { WarpTunnel } from "@/components/ui/warp-tunnel";

import { RadicalFluidBackground } from "@/components/ui/radical-fluid-background";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isWarping, setIsWarping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    // NOTE: Removed auto-redirect useEffect to prevent infinite loops with middleware.
    // Users must manually log in or click dashboard link if already authenticated.

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                // Trigger Warp Effect
                setIsWarping(true);

                // Check if user is admin
                const isAdmin = data.user?.email === 'aaravsai.anugula@gmail.com' ||
                    data.user?.user_metadata?.role === 'admin';

                // Allow a moment for the animation to play
                console.log('Login successful, initiating redirect...');
                setTimeout(() => {
                    // Force a router refresh to update server components with new auth state
                    router.refresh();
                    console.log('Router refreshed. Is Admin?', isAdmin);

                    if (isAdmin) {
                        console.log('Redirecting to ADMIN dashboard');
                        window.location.href = "/dashboard/admin";
                    } else {
                        console.log('Redirecting to USER dashboard');
                        window.location.href = "/dashboard";
                    }
                }, 1000);
            }
        } catch (err) {
            setError("An unexpected error occurred.");
            setLoading(false);
        }
    };

    // Force Logout Function for stuck users
    const handleForceLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        window.location.reload();
        // Redirect to clear cookies API as a backup
        window.location.href = '/api/auth/clear-cookies';
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden flex items-center justify-center selection:bg-amber-200 selection:text-slate-900">
            {/* Radical Background Layer */}
            <div className="fixed inset-0 z-0 opacity-40">
                <RadicalFluidBackground />
            </div>

            {/* Warp Effect Overlay */}
            <AnimatePresence>
                {isWarping && (
                    <>
                        <WarpTunnel />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: 1.5 }}
                            className="fixed inset-0 bg-white z-[101]"
                        />
                    </>
                )}
            </AnimatePresence>

            {/* Grid Pattern */}
            <DotPattern
                width={30}
                height={30}
                cx={1}
                cy={1}
                cr={1}
                className="fixed inset-0 z-0 opacity-30 fill-slate-300"
            />

            <motion.div
                animate={isWarping ? {
                    scale: [1, 0.9, 1.5],
                    opacity: [1, 1, 0],
                    filter: ["blur(0px)", "blur(0px)", "blur(20px)"],
                    x: [0, -5, 5, -5, 5, 0],
                } : { scale: 1, opacity: 1, filter: "blur(0px)", x: 0 }}
                transition={{
                    duration: 1.5,
                    times: [0, 0.2, 1],
                    ease: "easeInOut"
                }}
                className="relative z-10 w-full max-w-md px-4"
            >
                <FadeIn>
                    <div className="bg-white/60 backdrop-blur-xl border-2 border-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden group">
                        {/* Decorative Blob */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-300/30 rounded-full blur-3xl group-hover:bg-amber-300/40 transition-colors duration-1000" />

                        <div className="text-center mb-10 relative">
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="inline-flex items-center justify-center w-20 h-20 bg-slate-900 text-white rounded-2xl mb-6 shadow-xl"
                            >
                                <Rocket className="w-10 h-10" />
                            </motion.div>
                            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                                <ShinyText text="Command Access" speed={3} className="text-slate-900" />
                            </h1>
                            <p className="text-slate-500 font-bold tracking-wide text-sm uppercase">Identify Yourself, Pilot</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6 relative">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-4">Callsign (Email)</label>
                                <div className="relative group/input">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-white border-2 border-slate-200 focus:border-slate-900 focus:ring-0 rounded-2xl p-4 pl-12 font-bold text-slate-900 transition-all outline-none"
                                        placeholder="pilot@tahoma.com"
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-slate-900 transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-4">Access Code</label>
                                <div className="relative group/input">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-white border-2 border-slate-200 focus:border-slate-900 focus:ring-0 rounded-2xl p-4 pl-12 font-bold text-slate-900 transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-slate-900 transition-colors" />
                                </div>
                            </div>

                            {/* Emergency Reset Button for stuck users */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleForceLogout}
                                    className="text-[10px] text-rose-500 font-bold uppercase tracking-widest hover:bg-rose-50 px-2 py-1 rounded transition-colors"
                                >
                                    Force Reset Session
                                </button>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 text-rose-600 bg-rose-50 p-4 rounded-xl border-2 border-rose-200"
                                >
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p className="text-xs font-black uppercase tracking-wide">{error}</p>
                                </motion.div>
                            )}

                            <MagneticButton className="w-full group" disabled={loading || isWarping}>
                                <div className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-widest rounded-xl hover:bg-amber-400 hover:text-slate-900 border-2 border-slate-900 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center gap-3 overflow-hidden relative">
                                    {loading || isWarping ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>{isWarping ? "Warp Drive Active" : "Initiating..."}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="relative z-10">Engage Warp Drive</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                        </>
                                    )}
                                </div>
                            </MagneticButton>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500 font-medium text-sm">
                                No clearance?{" "}
                                <Link href="/signup" className="text-slate-900 font-bold hover:text-amber-500 transition-colors uppercase tracking-wider text-xs">
                                    Request Access Protocol
                                </Link>
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </motion.div>
        </div>
    );
}
