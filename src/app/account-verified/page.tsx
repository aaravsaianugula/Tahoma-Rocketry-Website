"use client";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { FadeIn, ShinyText } from "@/components/ui/text-animations";
import { RadicalFluidBackground } from "@/components/ui/radical-fluid-background";
import { MagneticButton } from "@/components/ui/magnetic-button";

export default function AccountVerifiedPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden flex items-center justify-center selection:bg-emerald-200 selection:text-emerald-900">
            {/* Radical Background Layer */}
            <div className="fixed inset-0 z-0 opacity-40">
                <RadicalFluidBackground />
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                <FadeIn>
                    <div className="bg-white/60 backdrop-blur-xl border-2 border-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] text-center relative overflow-hidden">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 border-2 border-slate-900 rounded-full mb-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                            <CheckCircle className="w-10 h-10 text-emerald-600" />
                        </div>

                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">
                            <ShinyText text="Clearance Granted" speed={3} className="text-slate-900" />
                        </h1>

                        <p className="text-slate-600 font-medium mb-8">
                            Your email has been successfully verified. You are now authorized to access the dashboard.
                        </p>

                        <Link href="/login">
                            <MagneticButton className="w-full group">
                                <div className="w-full py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 hover:text-white border-2 border-slate-900 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center gap-2">
                                    <span>Proceed to Login</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </MagneticButton>
                        </Link>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
