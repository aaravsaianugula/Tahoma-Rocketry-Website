"use client";
import { LEADERSHIP } from "@/data/site-data";
import Image from "next/image";
import { BauhausAnimation } from "@/components/ui/bauhaus-animation";
import { DecryptionReveal } from "@/components/ui/decryption-reveal";
import { ParallaxCard } from "@/components/ui/parallax-card";
import { FadeIn } from "@/components/ui/text-animations";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { VelocityScroll } from "@/components/ui/velocity-scroll";
import { Mail, Linkedin, Shield, Cpu, Zap, ArrowUpRight } from "lucide-react";
import { motion, useScroll } from "framer-motion";
import { useRef } from "react";

export default function LeadershipPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="min-h-screen bg-white relative overflow-hidden selection:bg-slate-900 selection:text-white" ref={containerRef}>
            {/* Background: Bauhaus Animation (Unique, Airy, Geometric) */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <BauhausAnimation />
            </div>

            <div className="relative z-10 pt-32 pb-40">
                <div className="container-width">
                    {/* Header Section - Cutout Typography */}
                    <div className="mb-40 relative">
                        <FadeIn>
                            <div className="flex flex-col items-start">
                                <div className="inline-flex items-center gap-2 px-4 py-1 border border-slate-900 rounded-full mb-8 bg-white">
                                    <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse" />
                                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-900">System: Online</span>
                                </div>

                                <h1 className="text-[12vw] font-black leading-[0.8] tracking-tighter text-slate-900 uppercase mix-blend-multiply mb-12">
                                    Command <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-500 to-slate-900 animate-gradient-x">Structure</span>
                                </h1>

                                <div className="w-full h-px bg-slate-200 mb-12" />

                                <div className="flex flex-col md:flex-row justify-between items-end w-full gap-8">
                                    <p className="max-w-xl text-xl text-slate-600 font-medium leading-relaxed">
                                        Orchestrating the mission. Defining the trajectory. <br />
                                        <span className="text-slate-900 font-bold">We turn chaos into flight.</span>
                                    </p>

                                    <div className="text-right">
                                        <div className="text-sm font-mono text-slate-400 mb-2">STATUS CHECK</div>
                                        <div className="text-4xl md:text-6xl font-black tracking-tighter">
                                            <DecryptionReveal
                                                text="VISION STRATEGY EXECUTION"
                                                className="text-slate-900"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Broken Grid Layout */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        {LEADERSHIP.map((leader, index) => (
                            <motion.div
                                key={leader.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={index % 2 === 0 ? "lg:translate-y-12" : ""} // Staggered grid
                            >
                                <ParallaxCard className="h-full">
                                    <div className="flex flex-col h-full">
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="bg-slate-100 p-2 rounded-lg">
                                                <Shield className="w-6 h-6 text-slate-900" />
                                            </div>
                                            <div className="text-xs font-mono font-bold text-slate-400">
                                                ID: {Math.random().toString(36).substr(2, 4).toUpperCase()}
                                            </div>
                                        </div>

                                        {/* Image */}
                                        <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden transition-all duration-500">
                                            <Image
                                                src={leader.imageUrl}
                                                alt={leader.name}
                                                fill
                                                className={`object-cover ${leader.imagePosition || "object-center"}`}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/10 to-transparent" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-grow">
                                            <h3 className="text-3xl font-black text-slate-900 uppercase leading-none mb-2">{leader.name}</h3>
                                            <div className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                                                {leader.role}
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                                {leader.bio}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-6 border-t border-slate-100 flex gap-4">
                                            <MagneticButton className="flex-1 py-3 bg-white border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white rounded-xl transition-colors flex items-center justify-center gap-2 font-bold uppercase text-xs tracking-widest group">
                                                Contact <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                                            </MagneticButton>
                                        </div>
                                    </div>
                                </ParallaxCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
