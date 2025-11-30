"use client";
import { SquaresBackground } from "@/components/ui/squares-background";
import { FadeIn, ShinyText } from "@/components/ui/text-animations";
import { CheckCircle2, ArrowRight, Rocket, Target, Users } from "lucide-react";
import { MissionTimeline } from "@/components/ui/mission-timeline";
import { ABOUT_CONTENT } from "@/data/site-data";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { GlitchText } from "@/components/ui/glitch-text";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden selection:bg-rose-500/30 selection:text-rose-900">
            {/* Light Mode Grid - Blueprint Style */}
            <SquaresBackground
                direction="diagonal"
                speed={0.5}
                borderColor="#E2E8F0"
                hoverFillColor="#F1F5F9"
                className="fixed inset-0 z-0 opacity-60"
            />

            <div className="relative z-10 pt-32 pb-24">
                <div className="container-width">
                    {/* Header */}
                    <div className="text-center mb-24">
                        <FadeIn>
                            <div className="inline-block px-4 py-2 rounded-full bg-rose-100 border-2 border-slate-900 mb-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                                <ShinyText text="ESTABLISHED 2023" speed={3} className="text-slate-900 font-black tracking-widest text-sm" />
                            </div>
                            <h1 className="text-7xl md:text-9xl font-black mb-8 text-slate-900 tracking-tighter uppercase leading-[0.85]">
                                WE BUILD <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">ROCKETS</span>
                            </h1>
                            <p className="text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
                                {ABOUT_CONTENT.mission.description}
                            </p>
                        </FadeIn>
                    </div>

                    {/* Stats Grid - Neo Brutalist */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
                        {ABOUT_CONTENT.stats.map((stat, index) => (
                            <FadeIn key={index} delay={index * 0.1}>
                                <motion.div
                                    whileHover={{ y: -5, boxShadow: "8px 8px 0px 0px rgba(15,23,42,1)" }}
                                    className="bg-white border-2 border-slate-900 p-8 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all"
                                >
                                    <h3 className="text-5xl font-black text-slate-900 mb-2">{stat.value}</h3>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                </motion.div>
                            </FadeIn>
                        ))}
                    </div>

                    {/* Mission & Vision - Split Layout */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                        <FadeIn delay={0.2}>
                            <div className="relative">
                                <div className="absolute -inset-4 bg-amber-200 rounded-3xl rotate-2 border-2 border-slate-900" />
                                <div className="relative bg-white border-2 border-slate-900 rounded-2xl p-10 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                                    <Rocket className="w-12 h-12 text-rose-500 mb-6" />
                                    <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase">Our Mission</h2>
                                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                        To provide students with hands-on engineering experience through the design, construction, and launch of high-power rockets. We bridge the gap between classroom theory and real-world aerospace application.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Model Rocket Launches",
                                            "Community Outreach",
                                            "STEM Education",
                                            "Team Building"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 font-bold text-slate-700">
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.4}>
                            <div className="space-y-8">
                                <div className="bg-white/50 backdrop-blur-sm border-l-4 border-slate-900 p-8 hover:bg-white transition-colors">
                                    <Target className="w-8 h-8 text-slate-900 mb-4" />
                                    <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase">Precision Engineering</h3>
                                    <p className="text-slate-600">Using OpenRocket for simulation and CAD for design, we ensure every flight is calculated and safe.</p>
                                </div>
                                <div className="bg-white/50 backdrop-blur-sm border-l-4 border-slate-900 p-8 hover:bg-white transition-colors">
                                    <Users className="w-8 h-8 text-slate-900 mb-4" />
                                    <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase">Student Led</h3>
                                    <p className="text-slate-600">From funding to fabrication, every aspect of the club is managed by students, for students.</p>
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Timeline */}
                    <div className="mb-32">
                        <h2 className="text-4xl font-black text-slate-900 mb-12 text-center uppercase">Flight History</h2>
                        <MissionTimeline />
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <div className="inline-block relative group">
                            <div className="absolute inset-0 bg-rose-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative bg-white border-2 border-slate-900 p-12 rounded-2xl max-w-4xl mx-auto shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]">
                                <h2 className="text-5xl font-black text-slate-900 mb-6 uppercase">Ready to Launch?</h2>
                                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                                    Join us every Tuesday in Room 119. No prior experience required—just a passion for things that go fast.
                                </p>
                                <div className="flex justify-center gap-6">
                                    <Link href="/contact">
                                        <MagneticButton className="px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 transition-colors shadow-lg">
                                            <div className="flex items-center gap-2">
                                                <GlitchText text="Join The Team" />
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </MagneticButton>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
