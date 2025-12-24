"use client";
import { useState } from "react";
import { DotPattern } from "@/components/ui/dot-pattern";
import { FadeIn, ShinyText } from "@/components/ui/text-animations";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { GlitchText } from "@/components/ui/glitch-text";
import Link from "next/link";
import { Lock, Mail, ArrowRight, UserPlus, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { RadicalFluidBackground } from "@/components/ui/radical-fluid-background";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const supabase = createClient();

    // REMOVED: Auto-redirect useEffect to prevent infinite loops.

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                    // Redirect to the account verified page after email confirmation
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=/account-verified`,
                },
            });

            if (error) {
                setError(error.message);
            } else {
                // Redirect user after successful signup
                router.replace("/dashboard/student");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden flex items-center justify-center selection:bg-purple-200 selection:text-purple-900">
            {/* Radical Background Layer */}
            <div className="fixed inset-0 z-0 opacity-40">
                <RadicalFluidBackground />
            </div>

            {/* Dynamic Background - Secure Mesh */}
            <DotPattern
                width={30}
                height={30}
                cx={1}
                cy={1}
                cr={1}
                className="fixed inset-0 z-0 opacity-30 fill-slate-300"
            />

            <div className="relative z-10 w-full max-w-md px-4">
                <FadeIn>
                    <div className="bg-white/60 backdrop-blur-xl border-2 border-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden">

                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 border-2 border-slate-900 rounded-2xl mb-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                                <UserPlus className="w-8 h-8 text-slate-900" />
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-2">
                                <ShinyText text="New Recruit" speed={3} className="text-slate-900" />
                            </h1>
                            <p className="text-slate-500 font-bold uppercase tracking-wide text-xs">Create your profile to begin training.</p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-6">
                            {error && (
                                <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-4 rounded-xl border-2 border-rose-200">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <span className="text-xs font-black uppercase tracking-wide">{error}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-4">Full Name</label>
                                <div className="relative group/input">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white border-2 border-slate-200 focus:border-slate-900 focus:ring-0 rounded-2xl p-4 pl-12 font-bold text-slate-900 transition-all outline-none"
                                        placeholder="John Glenn"
                                        required
                                    />
                                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-slate-900 transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-4">Email</label>
                                <div className="relative group/input">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white border-2 border-slate-200 focus:border-slate-900 focus:ring-0 rounded-2xl p-4 pl-12 font-bold text-slate-900 transition-all outline-none"
                                        placeholder="pilot@tahoma.com"
                                        required
                                    />
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-slate-900 transition-colors" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-4">Password</label>
                                <div className="relative group/input">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white border-2 border-slate-200 focus:border-slate-900 focus:ring-0 rounded-2xl p-4 pl-12 font-bold text-slate-900 transition-all outline-none"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-slate-900 transition-colors" />
                                </div>
                            </div>

                            <MagneticButton
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-widest rounded-xl hover:bg-purple-400 hover:text-slate-900 border-2 border-slate-900 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <GlitchText text="Create Account" />
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </MagneticButton>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500 font-medium text-sm">
                                Already a member?{" "}
                                <Link href="/login" className="text-slate-900 font-bold underline decoration-2 decoration-purple-400 hover:decoration-slate-900 transition-all">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
