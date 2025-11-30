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

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isWarping, setIsWarping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                // Trigger Warp Effect
                setIsWarping(true);
                setTimeout(() => {
                    router.push("/dashboard/admin");
                    router.refresh();
                }, 2000); // Wait for animation
            }
        } catch (err) {
            setError("An unexpected error occurred.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden flex items-center justify-center selection:bg-cyan-200 selection:text-cyan-900">
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

            {/* Dynamic Background - Secure Mesh */}
            <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={1}
                className="fixed inset-0 z-0 opacity-50 fill-slate-300"
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
                    <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        {/* Decorative Gradient Blob */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl group-hover:bg-cyan-400/30 transition-colors duration-1000" />

                        <div className="text-center mb-10 relative">
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="inline-flex items-center justify-center w-20 h-20 bg-slate-900 text-white rounded-2xl mb-6 shadow-xl"
                            >
                                <Rocket className="w-10 h-10" />
                            </motion.div>
                            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                                <ShinyText text="Command Access" speed={3} />
                            </h1>
                            <p className="text-slate-500 font-medium tracking-wide text-sm uppercase">Identify Yourself, Pilot</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6 relative">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Callsign (Email)</label>
                                <div className="relative group/input">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-slate-50/50 border-2 border-slate-100 focus:border-cyan-400 focus:bg-white rounded-2xl p-4 pl-12 font-bold text-slate-900 transition-all outline-none"
                                        placeholder="pilot@tahoma.com"
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/input:text-cyan-500 transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Access Code</label>
                                <div className="relative group/input">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-slate-50/50 border-2 border-slate-100 focus:border-cyan-400 focus:bg-white rounded-2xl p-4 pl-12 font-bold text-slate-900 transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/input:text-cyan-500 transition-colors" />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 text-rose-500 bg-rose-50/50 p-4 rounded-xl border border-rose-100"
                                >
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p className="text-xs font-bold uppercase tracking-wide">{error}</p>
                                </motion.div>
                            )}

                            <MagneticButton className="w-full group" disabled={loading || isWarping}>
                                <div className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-widest rounded-xl hover:bg-cyan-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-3 overflow-hidden relative">
                                    {/* Button Background Animation */}
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

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
                            <p className="text-slate-400 font-medium text-sm">
                                No clearance?{" "}
                                <Link href="/signup" className="text-slate-900 font-bold hover:text-cyan-500 transition-colors uppercase tracking-wider text-xs">
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
