"use client";
import { useState, useEffect } from "react";
import { RadicalFluidBackground } from "@/components/ui/radical-fluid-background";
import { ParallaxCard } from "@/components/ui/parallax-card";
import { Marquee } from "@/components/ui/marquee";
import { FadeIn, ShinyText } from "@/components/ui/text-animations";
import { Loader2, AlertCircle, Play, Rocket, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await fetch('/api/gallery');
                if (response.ok) {
                    const data = await response.json();
                    setItems(data);
                }
            } catch (error) {
                console.error('Failed to fetch gallery:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    const imageItems = items.filter(item => item.type === 'image');
    const videoItems = items.filter(item => item.type === 'video');

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans selection:bg-amber-200 selection:text-slate-900 overflow-x-hidden">
            {/* 1. Background: Radical Fluidity (The smoothest flow) */}
            <div className="fixed inset-0 z-0 opacity-80">
                <RadicalFluidBackground />
            </div>

            <div className="relative z-10">
                {/* 2. Kinetic Hero - Continuous Marquee Flow */}
                <div className="pt-24 pb-12 border-b border-slate-900/10">
                    <div className="mb-8">
                        <Marquee className="py-4 bg-slate-900 text-[#FDFBF7]" repeat={4} pauseOnHover={true}>
                            <span className="text-4xl md:text-6xl font-black uppercase tracking-tighter mx-8">Mission Archive</span>
                            <span className="text-4xl md:text-6xl font-black uppercase tracking-tighter mx-8 text-amber-400">//</span>
                            <span className="text-4xl md:text-6xl font-black uppercase tracking-tighter mx-8">Visual Telemetry</span>
                            <span className="text-4xl md:text-6xl font-black uppercase tracking-tighter mx-8 text-amber-400">//</span>
                            <span className="text-4xl md:text-6xl font-black uppercase tracking-tighter mx-8">Classified Footage</span>
                            <span className="text-4xl md:text-6xl font-black uppercase tracking-tighter mx-8 text-amber-400">//</span>
                        </Marquee>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <FadeIn>
                            <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-900/20 bg-white/50 backdrop-blur-sm mb-6">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-600">Live Database</span>
                                    </div>
                                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] text-slate-900">
                                        Kinetic <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500">
                                            Flow
                                        </span>
                                    </h1>
                                </div>
                                <div className="max-w-sm text-right">
                                    <p className="text-lg font-medium text-slate-600 leading-relaxed">
                                        A continuous stream of mission data and visual records. Experience the momentum of the Tahoma Rocketry Club.
                                    </p>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>

                {loading ? (
                    <div className="h-[40vh] flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 animate-spin text-slate-900 mb-4" />
                        <p className="font-mono text-slate-500 uppercase tracking-widest text-sm">Streaming Assets...</p>
                    </div>
                ) : (
                    <div className="pb-32 space-y-24">
                        {/* 3. Hero Video - Clean Editorial Container */}
                        {videoItems.length > 0 && (
                            <div className="w-full max-w-[98vw] mx-auto mt-12">
                                {videoItems.map((item) => (
                                    <FadeIn key={item.id} delay={0.2}>
                                        <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl group">
                                            <video
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                className="w-full h-full object-cover"
                                            >
                                                <source src={item.url} type="video/mp4" />
                                            </video>

                                            {/* Editorial Overlay */}
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />

                                            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                                <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Live Feed</span>
                                            </div>

                                            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-2">
                                                    {item.title}
                                                </h2>
                                                <p className="text-white/80 font-mono text-sm uppercase tracking-widest">
                                                    {item.category || 'RAW_FOOTAGE'} // {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        )}

                        {/* 4. Image Gallery - Parallax Grid with Marquee Divider */}
                        {imageItems.length > 0 && (
                            <div>
                                <div className="py-12 border-y border-slate-900/5 bg-white/30 backdrop-blur-sm mb-16">
                                    <Marquee reverse={true} className="text-slate-200" repeat={8}>
                                        <span className="text-8xl font-black uppercase tracking-tighter mx-4 opacity-50">Captured Moments</span>
                                        <span className="text-8xl font-black uppercase tracking-tighter mx-4 opacity-50 text-amber-200">*</span>
                                    </Marquee>
                                </div>

                                <div className="px-4 md:px-8 max-w-[1920px] mx-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                        {imageItems.map((item, index) => (
                                            <FadeIn key={item.id} delay={index * 0.1} className={cn(
                                                // Editorial Stagger
                                                index % 2 === 1 ? "md:translate-y-24" : ""
                                            )}>
                                                <ParallaxCard className="h-full group bg-white">
                                                    <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-slate-100">
                                                        <img
                                                            src={item.url}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-500" />
                                                    </div>
                                                    <div className="flex justify-between items-start border-t-2 border-slate-900 pt-4">
                                                        <div>
                                                            <h4 className="text-2xl font-bold text-slate-900 uppercase leading-none mb-1">
                                                                {item.title}
                                                            </h4>
                                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                                {item.category || 'PHOTOGRAPHY'}
                                                            </p>
                                                        </div>
                                                        <div className="w-8 h-8 rounded-full border border-slate-900 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                                                            <ArrowRight className="w-4 h-4 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                                        </div>
                                                    </div>
                                                </ParallaxCard>
                                            </FadeIn>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Global Empty State */}
                        {items.length === 0 && (
                            <div className="py-32 border border-slate-200 bg-white text-center max-w-2xl mx-auto">
                                <AlertCircle className="w-12 h-12 mx-auto mb-6 text-slate-300" />
                                <p className="font-bold text-slate-400 text-xl uppercase tracking-widest">No Visual Records</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
