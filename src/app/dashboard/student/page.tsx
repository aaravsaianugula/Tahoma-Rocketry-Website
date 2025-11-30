"use client";

import { MOCK_USER, EVENTS } from "@/data/site-data";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Calendar, Clock, MapPin, Rocket, Trophy, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function StudentDashboard() {
    const nextLaunch = EVENTS.find(e => e.type === "launch");

    const items = [
        {
            title: "Next Mission Status",
            description: nextLaunch ? (
                <div className="flex flex-col gap-1 mt-2">
                    <span className="text-cyan-400 font-bold">{nextLaunch.title}</span>
                    <span>{new Date(nextLaunch.date).toLocaleDateString()}</span>
                    <span className="text-xs text-slate-500">{nextLaunch.location}</span>
                    <Link href="/events" className="mt-2 inline-flex items-center text-white hover:text-cyan-400 transition-colors">
                        View Mission <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                </div>
            ) : "No upcoming launches.",
            header: (
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 overflow-hidden relative">
                    <Image
                        src="/assets/rocket-launch.jpg"
                        alt="Launch"
                        fill
                        className="object-cover opacity-50 group-hover/bento:scale-110 transition-transform duration-500"
                    />
                </div>
            ),
            icon: <Rocket className="h-4 w-4 text-cyan-500" />,
            className: "md:col-span-2",
        },
        {
            title: "My Stats",
            description: (
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                        <div className="text-2xl font-bold text-white">12</div>
                        <div className="text-xs text-slate-500">Hours Logged</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-purple-400">3</div>
                        <div className="text-xs text-slate-500">Launches</div>
                    </div>
                </div>
            ),
            header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-[#0A0E27] border border-white/5" />,
            icon: <Trophy className="h-4 w-4 text-purple-500" />,
            className: "md:col-span-1",
        },
        {
            title: "Quick Actions",
            description: (
                <div className="flex flex-col gap-2 mt-2">
                    <button className="w-full text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-xs transition-colors">
                        + Log Build Hours
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-xs transition-colors">
                        + Submit Design Proposal
                    </button>
                </div>
            ),
            header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-cyan-900/20 to-purple-900/20" />,
            icon: <Clock className="h-4 w-4 text-green-500" />,
            className: "md:col-span-1",
        },
        {
            title: "Team Updates",
            description: "New engine shipment arrived! L1 Certification workshop this Friday.",
            header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-[#0A0E27] border border-white/5" />,
            icon: <Users className="h-4 w-4 text-yellow-500" />,
            className: "md:col-span-2",
        },
    ];

    return (
        <div className="pt-32 pb-24 bg-[#0A0E27] min-h-screen">
            <div className="container-width">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {MOCK_USER.name.split(' ')[0]}</h1>
                    <p className="text-slate-400">Here's your mission control center.</p>
                </div>

                <BentoGrid>
                    {items.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            icon={item.icon}
                            className={item.className}
                        />
                    ))}
                </BentoGrid>
            </div>
        </div>
    );
}
