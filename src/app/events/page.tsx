"use client";
import { useState, useEffect } from "react";
import { RetroGrid } from "@/components/ui/retro-grid";
import { FadeIn } from "@/components/ui/text-animations";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { Calendar, Clock, MapPin, Rocket, Terminal, Activity, Radio, Ticket, Check, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export default function EventsPage() {
    const [filter, setFilter] = useState<"all" | "launch" | "fundraiser" | "meeting">("all");
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [userRsvps, setUserRsvps] = useState<Record<string, string>>({}); // eventId -> rsvpId
    const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);
    const supabase = createClient();

    const router = useRouter();
    const { toast, success, error: toastError } = useToast();

    const fetchUserRsvps = async () => {
        if (!user) return;
        try {
            const response = await fetch('/api/rsvps');
            if (response.ok) {
                const data = await response.json();
                // Map event_id to rsvp id for quick lookup - use email for matching
                const rsvpMap: Record<string, string> = {};
                data.forEach((rsvp: any) => {
                    if (rsvp.email === user.email) {
                        rsvpMap[rsvp.event_id] = rsvp.id;
                    }
                });
                setUserRsvps(rsvpMap);
            }
        } catch (error) {
            console.error('Failed to fetch RSVPs:', error);
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/events');
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                }
            } catch (error) {
                console.error('Failed to fetch events:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchEvents();
        fetchUser();
    }, []);

    // Fetch RSVPs when user is loaded
    useEffect(() => {
        if (user) {
            fetchUserRsvps();
        }
    }, [user]);

    const handleRSVP = async (eventId: string) => {
        if (!user) {
            router.push('/login');
            return;
        }

        setRsvpLoading(eventId);

        // Check if already RSVP'd - if so, un-RSVP
        const existingRsvpId = userRsvps[eventId];

        try {
            if (existingRsvpId) {
                // Un-RSVP
                const response = await fetch(`/api/rsvps?id=${existingRsvpId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    success("RSVP cancelled.");
                    setUserRsvps(prev => {
                        const next = { ...prev };
                        delete next[eventId];
                        return next;
                    });
                } else {
                    const data = await response.json();
                    toastError(`Failed to cancel RSVP: ${data.error || "Unknown error"}`);
                }
            } else {
                // Create RSVP
                const response = await fetch('/api/rsvps', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ event_id: eventId }),
                });

                if (response.ok) {
                    const data = await response.json();
                    success("RSVP Confirmed! We'll see you there.");
                    setUserRsvps(prev => ({ ...prev, [eventId]: data.id }));
                } else {
                    const data = await response.json();
                    console.error("RSVP Failed:", data);
                    if (data.error === "You have already RSVP'd to this event") {
                        toastError("You have already RSVP'd to this event.");
                    } else {
                        toastError(`Failed to RSVP: ${data.error || "Unknown error"}`);
                    }
                }
            }
        } catch (error) {
            console.error("RSVP Error:", error);
            toastError("An error occurred while processing your RSVP.");
        } finally {
            setRsvpLoading(null);
        }
    };

    // Group events by title and pick the next upcoming one
    const uniqueEvents = events
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .reduce((acc: any[], current) => {
            const exists = acc.find(item => item.title === current.title);
            if (!exists) {
                acc.push(current);
            }
            return acc;
        }, []);

    const filteredEvents = uniqueEvents.filter(e => filter === "all" || e.type === filter);

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-slate-900 relative overflow-hidden selection:bg-rose-200 selection:text-rose-900 font-mono z-0">
            {/* Force light theme override for this page */}
            <style jsx global>{`
                :root {
                    --foreground: 15 23 42;
                    --background: 253 251 247;
                }
            `}</style>
            {/* Background: Retro Flight Grid */}
            <RetroGrid className="opacity-60" />

            {/* Floating Header Marquee */}
            <div className="fixed top-24 left-0 right-0 z-20 bg-white/80 backdrop-blur-md border-y-2 border-slate-900 transform -rotate-1 shadow-lg">
                <Marquee className="text-slate-900 font-bold text-xs tracking-[0.3em] py-2 uppercase" repeat={5}>
                    <span className="mx-8 flex items-center gap-2"><Radio className="w-3 h-3 animate-pulse text-rose-500" /> LIVE FEED ACTIVE</span>
                    <span className="mx-8">///</span>
                    <span className="mx-8">FLIGHT MANIFEST: UPDATED</span>
                    <span className="mx-8">///</span>
                    <span className="mx-8">WEATHER: GO</span>
                    <span className="mx-8">///</span>
                    <span className="mx-8">RANGE STATUS: HOT</span>
                </Marquee>
            </div>

            <div className="relative z-10 pt-48 pb-24">
                <div className="container-width">
                    {/* Hero Section */}
                    <div className="text-center mb-24">
                        <FadeIn priority={true}>
                            <div className="inline-flex items-center gap-2 px-4 py-1 rounded border-2 border-slate-900 bg-rose-100 mb-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                                <Activity className="w-4 h-4 text-rose-600 animate-pulse" />
                                <span className="text-rose-800 text-xs font-black tracking-widest uppercase">
                                    System Online
                                </span>
                            </div>
                            <h1 className="text-6xl md:text-9xl font-black mb-8 text-slate-900 tracking-tighter uppercase leading-[0.85]">
                                LAUNCH <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-600">MANIFEST</span>
                            </h1>
                        </FadeIn>
                    </div>

                    {/* Holographic Manifest Grid */}
                    <div className="max-w-7xl mx-auto">
                        {/* Filter Controls */}
                        <div className="flex flex-wrap gap-4 mb-12 justify-center">
                            {["all", "launch", "fundraiser", "meeting"].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilter(type as any)}
                                    className={cn(
                                        "px-6 py-3 text-xs font-black uppercase tracking-widest border-2 transition-all rounded-lg shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center gap-2",
                                        filter === type
                                            ? "bg-slate-900 text-white border-slate-900"
                                            : "bg-white text-slate-900 border-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    {type === 'all' && <Terminal className="w-3 h-3" />}
                                    {type === 'launch' && <Rocket className="w-3 h-3" />}
                                    {type}
                                </button>
                            ))}
                        </div>

                        {/* Events Grid */}
                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-900 border-t-transparent"></div>
                                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest">Loading Manifest Data...</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap justify-center gap-6">
                                {filteredEvents.map((event, index) => (
                                    <FadeIn key={event.id} delay={index * 0.05} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md">
                                        <div className="group relative h-full">
                                            {/* Holographic Card Effect */}
                                            <div className="absolute -inset-2 bg-gradient-to-r from-rose-400 to-orange-400 rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500" />

                                            <div className="relative h-full bg-white border-2 border-slate-900 rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all duration-300 flex flex-col">
                                                {/* Header */}
                                                <div className="flex justify-between items-start mb-4 border-b-2 border-slate-100 pb-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-5xl font-black text-slate-900/10 absolute top-4 right-4 select-none">
                                                            {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                                        </span>
                                                        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-1">
                                                            {event.type}
                                                        </span>
                                                        <h3 className="text-xl font-black text-slate-900 uppercase leading-tight group-hover:text-rose-600 transition-colors z-10">
                                                            {event.title}
                                                        </h3>
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="space-y-3 mb-6 flex-grow z-10">
                                                    <p className="text-slate-600 text-sm font-medium leading-relaxed">
                                                        {event.shortDescription}
                                                    </p>

                                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        {new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                        {event.time}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
                                                        <MapPin className="w-4 h-4 text-slate-400" />
                                                        {event.location}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleRSVP(event.id)}
                                                    disabled={rsvpLoading === event.id}
                                                    className={cn(
                                                        "w-full mt-4 py-3 font-black uppercase tracking-widest text-xs rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative z-20",
                                                        userRsvps[event.id]
                                                            ? "bg-emerald-500 text-white hover:bg-rose-600"
                                                            : "bg-slate-900 text-white hover:bg-rose-600"
                                                    )}
                                                >
                                                    {rsvpLoading === event.id ? (
                                                        <span className="animate-pulse">Processing...</span>
                                                    ) : userRsvps[event.id] ? (
                                                        <>
                                                            <Check className="w-4 h-4" />
                                                            RSVP'd - Click to Cancel
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Ticket className="w-4 h-4" />
                                                            {user ? "RSVP Now" : "Sign In to RSVP"}
                                                        </>
                                                    )}
                                                </button>

                                                {/* Status Indicator */}
                                                <div className="mt-auto pt-4 border-t-2 border-slate-100 flex justify-between items-center z-10">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        ID: {event.id.split('-')[1] || 'UNK'}
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                                        </span>
                                                        <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
                                                            Active
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
