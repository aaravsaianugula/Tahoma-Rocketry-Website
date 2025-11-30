"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Rocket, PenTool, Wrench, ShieldCheck, Flame } from "lucide-react";

interface TimelineEntry {
    title: string;
    content: React.ReactNode;
    icon: React.ReactNode;
}

export const MissionTimeline = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"],
    });

    const data: TimelineEntry[] = [
        {
            title: "Idea & Brainstorming",
            content: (
                <p className="text-slate-600 text-lg font-medium font-mono">
                    // PHASE 01: CONCEPTUALIZATION <br />
                    Every mission starts with a question: "How high?" "How fast?" "What payload?"
                    We gather in Room 119 to define our mission parameters and sketch initial concepts on the whiteboard.
                </p>
            ),
            icon: <PenTool className="w-6 h-6 text-slate-900" />,
        },
        {
            title: "Design & Simulation",
            content: (
                <p className="text-slate-600 text-lg font-medium font-mono">
                    // PHASE 02: SIMULATION <br />
                    We don't guess; we simulate. Using OpenRocket, we model stability margins,
                    thrust-to-weight ratios, and descent rates to ensure a safe and successful flight profile.
                </p>
            ),
            icon: <Rocket className="w-6 h-6 text-slate-900" />,
        },
        {
            title: "Building & Assembly",
            content: (
                <p className="text-slate-600 text-lg font-medium font-mono">
                    // PHASE 03: FABRICATION <br />
                    Carbon fiber, fiberglass, and epoxy. We manufacture our airframes and 3D print
                    custom avionics bays. This is where engineering meets craftsmanship.
                </p>
            ),
            icon: <Wrench className="w-6 h-6 text-slate-900" />,
        },
        {
            title: "Testing & Safety",
            content: (
                <p className="text-slate-600 text-lg font-medium font-mono">
                    // PHASE 04: VALIDATION <br />
                    Safety is paramount. We conduct ground tests for ejection charges,
                    verify avionics continuity, and perform structural stress tests before heading to the pad.
                </p>
            ),
            icon: <ShieldCheck className="w-6 h-6 text-slate-900" />,
        },
        {
            title: "Launch Day",
            content: (
                <p className="text-slate-600 text-lg font-medium font-mono">
                    // PHASE 05: EXECUTION <br />
                    The moment of truth. We head to the 60 Acres Park, set up the rail,
                    and press the button. 3... 2... 1... Liftoff!
                </p>
            ),
            icon: <Flame className="w-6 h-6 text-slate-900" />,
        },
    ];

    return (
        <div className="w-full font-sans md:px-10 relative overflow-visible" ref={containerRef}>
            {/* Blueprint Grid Background for Timeline Area */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10 relative z-10">
                <h2 className="text-3xl md:text-5xl mb-4 text-slate-900 font-black uppercase tracking-tight max-w-4xl">
                    Mission Lifecycle
                </h2>
                <p className="text-slate-500 text-lg max-w-sm font-bold uppercase tracking-widest font-mono">
                    // PROJECT_PIPELINE_V2.0
                </p>
            </div>

            <div className="relative max-w-7xl mx-auto pb-20">
                {/* Central Dashed Line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 border-l-2 border-dashed border-slate-300" />

                {/* Animated Progress Line */}
                <motion.div
                    style={{
                        height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
                    }}
                    className="absolute left-8 md:left-1/2 top-0 w-1 -translate-x-1/2 bg-gradient-to-b from-slate-900 via-amber-500 to-rose-500 origin-top"
                />

                {data.map((item, index) => (
                    <div key={index} className={`flex flex-col md:flex-row gap-8 md:gap-24 mb-24 relative pl-24 md:pl-0 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                        {/* Content Side */}
                        <div className="flex-1 md:w-1/2 p-6 bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-300 group">
                            <h3 className="text-2xl font-black text-slate-900 uppercase mb-4 flex items-center gap-2">
                                <span className="text-amber-500">0{index + 1}.</span> {item.title}
                            </h3>
                            {item.content}
                        </div>

                        {/* Center Node */}
                        <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-slate-900 rounded-full flex items-center justify-center z-20 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                            {item.icon}
                        </div>

                        {/* Empty Side for Balance */}
                        <div className="hidden md:block flex-1 md:w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
};
