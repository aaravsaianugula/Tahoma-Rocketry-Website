"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { FadeIn, ShinyText } from "@/components/ui/text-animations";
import { RadicalFluidBackground } from "@/components/ui/radical-fluid-background";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const supabase = createClient();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
            });

            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: "Reset link sent! Check your inbox." });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "An unexpected error occurred." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden flex items-center justify-center selection:bg-amber-200 selection:text-slate-900">
            {/* Radical Background Layer */}
            <div className="fixed inset-0 z-0 opacity-40">
                <RadicalFluidBackground />
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                <FadeIn>
                    <div className="bg-white/60 backdrop-blur-xl border-2 border-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden">

                        <div className="mb-8">
                            <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold uppercase tracking-widest text-xs transition-colors mb-6">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                                <ShinyText text="Reset Access" speed={3} className="text-slate-900" />
                            </h1>
                            <p className="text-slate-500 font-bold uppercase tracking-wide text-xs">Enter your email to restore clearance.</p>
                        </div>

                        <form onSubmit={handleReset} className="space-y-6">
                            {message && (
                                <div className={`flex items-center gap-3 p-4 rounded-xl border-2 ${message.type === 'success'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : 'bg-rose-50 border-rose-200 text-rose-700'
                                    }`}>
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <span className="text-xs font-black uppercase tracking-wide">{message.text}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-4">Email Address</label>
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

                            <MagneticButton
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-widest rounded-xl hover:bg-amber-400 hover:text-slate-900 border-2 border-slate-900 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Send Reset Link</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </MagneticButton>
                        </form>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
