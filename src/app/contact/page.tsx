"use client";
import { siteConfig } from "@/data/site-data";
import { Mail, MapPin, Send, ArrowRight, Globe, Radio } from "lucide-react";
import { useState } from "react";
import { RadicalFluidBackground } from "@/components/ui/radical-fluid-background";
import { FadeIn } from "@/components/ui/text-animations";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { TextPressure } from "@/components/ui/text-pressure";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden selection:bg-rose-200 selection:text-rose-900 font-sans text-slate-900">
            {/* 1. Background: Radical Fluidity */}
            <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
                <RadicalFluidBackground />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* 2. Kinetic Hero Section */}
                <div className="flex-1 flex flex-col lg:flex-row items-center justify-center container-width pt-32 pb-12 gap-16 lg:gap-24">

                    {/* Left: Interactive Typography */}
                    <div className="flex-1 w-full max-w-2xl relative">
                        <FadeIn>
                            <div className="mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-900/10 bg-white/50 backdrop-blur-sm mb-6">
                                    <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-600">Open Frequency</span>
                                </div>

                                <div className="h-[25vh] w-full relative z-20">
                                    <TextPressure
                                        text="CONTACT"
                                        flex={true}
                                        alpha={false}
                                        stroke={false}
                                        width={true}
                                        weight={true}
                                        italic={true}
                                        textColor="#0f172a"
                                        minFontSize={48}
                                    />
                                </div>

                                <p className="text-xl md:text-2xl font-medium text-slate-600 leading-relaxed mt-8 max-w-lg">
                                    Initiate communication with the Tahoma Rocketry Club. We are standing by for transmission.
                                </p>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Right: Floating Glass Form */}
                    <div className="flex-1 w-full max-w-xl">
                        <FadeIn delay={0.2}>
                            <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 md:p-12 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/20 to-transparent opacity-50 pointer-events-none" />

                                {submitted ? (
                                    <div className="h-[400px] flex flex-col items-center justify-center text-center relative z-10">
                                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                            <Send className="w-10 h-10 transform translate-x-1 translate-y-1" />
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 uppercase mb-2 tracking-tight">Signal Received</h3>
                                        <p className="text-slate-600 font-medium text-lg">Our team will decode your message shortly.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Callsign</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-white/60 border-0 focus:ring-2 focus:ring-rose-400 rounded-2xl p-5 font-bold text-slate-900 placeholder:text-slate-300 transition-all shadow-sm hover:bg-white/80"
                                                placeholder="Enter Name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Frequency</label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full bg-white/60 border-0 focus:ring-2 focus:ring-rose-400 rounded-2xl p-5 font-bold text-slate-900 placeholder:text-slate-300 transition-all shadow-sm hover:bg-white/80"
                                                placeholder="Enter Email"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Transmission</label>
                                            <textarea
                                                required
                                                rows={4}
                                                className="w-full bg-white/60 border-0 focus:ring-2 focus:ring-rose-400 rounded-2xl p-5 font-bold text-slate-900 placeholder:text-slate-300 transition-all shadow-sm hover:bg-white/80 resize-none"
                                                placeholder="Enter Message..."
                                            />
                                        </div>

                                        <MagneticButton className="w-full group/btn">
                                            <div className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-rose-500 transition-colors shadow-xl flex items-center justify-center gap-3">
                                                <span>Transmit</span>
                                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                            </div>
                                        </MagneticButton>
                                    </form>
                                )}
                            </div>
                        </FadeIn>
                    </div>
                </div>

                {/* 3. Kinetic Footer - Marquee Info */}
                <div className="py-8 border-t border-slate-900/5 bg-white/30 backdrop-blur-sm">
                    <Marquee className="text-slate-400" pauseOnHover={true} repeat={4}>
                        <div className="flex items-center gap-16 mx-8">
                            <div className="flex items-center gap-4">
                                <MapPin className="w-5 h-5 text-rose-500" />
                                <span className="text-xl font-bold uppercase tracking-tight text-slate-900">Tahoma High School // Room 119</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail className="w-5 h-5 text-amber-500" />
                                <span className="text-xl font-bold uppercase tracking-tight text-slate-900">{siteConfig.contact.email}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Globe className="w-5 h-5 text-cyan-500" />
                                <span className="text-xl font-bold uppercase tracking-tight text-slate-900">Maple Valley, WA</span>
                            </div>
                        </div>
                    </Marquee>
                </div>
            </div>
        </div>
    );
}
