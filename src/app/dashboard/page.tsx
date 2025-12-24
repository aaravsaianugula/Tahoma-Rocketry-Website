"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar, Clock, MapPin, Rocket, LogOut, ArrowRight, Ticket, User,
    Home, Flame, Target, Star, Trophy, Zap, Radio, Gauge, Navigation,
    ChevronRight, ExternalLink, Shield, Plus, Check, Loader2, Settings
} from "lucide-react";
import { FluidGlass } from "@/components/ui/fluid-glass";
import { AppleGlass } from "@/components/ui/apple-glass";
import { ShinyText } from "@/components/ui/shiny-text";
import { GlitchText } from "@/components/ui/glitch-text";
import { cn } from "@/lib/utils";

// Avatar color presets (same as settings page)
const AVATAR_COLORS = [
    { from: 'from-rose-500', to: 'to-orange-500' },
    { from: 'from-blue-500', to: 'to-cyan-500' },
    { from: 'from-purple-500', to: 'to-pink-500' },
    { from: 'from-emerald-500', to: 'to-teal-500' },
    { from: 'from-amber-500', to: 'to-yellow-500' },
    { from: 'from-slate-700', to: 'to-slate-900' },
    { from: 'from-pink-500', to: 'to-rose-500' },
    { from: 'from-indigo-500', to: 'to-violet-500' },
];

// Animated counter component
const AnimatedCounter = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = value / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{count}</span>;
};

// Countdown timer component
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const diff = target - now;

            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((diff % (1000 * 60)) / 1000)
                });
            }
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="flex gap-3">
            {[
                { value: timeLeft.days, label: 'DAYS' },
                { value: timeLeft.hours, label: 'HRS' },
                { value: timeLeft.minutes, label: 'MIN' },
                { value: timeLeft.seconds, label: 'SEC' }
            ].map((item, i) => (
                <div key={i} className="text-center">
                    <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center border-2 border-amber-400 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)]">
                        <span className="text-2xl font-black text-white tabular-nums">{String(item.value).padStart(2, '0')}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-2 block">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

// Pilot rank badge
const PilotRank = ({ eventsAttended }: { eventsAttended: number }) => {
    const getRank = (count: number) => {
        if (count >= 20) return { name: 'COMMANDER', color: 'bg-amber-400 text-slate-900', icon: Shield };
        if (count >= 10) return { name: 'CAPTAIN', color: 'bg-rose-400 text-white', icon: Star };
        if (count >= 5) return { name: 'PILOT', color: 'bg-blue-400 text-white', icon: Rocket };
        if (count >= 1) return { name: 'CADET', color: 'bg-emerald-400 text-white', icon: Target };
        return { name: 'RECRUIT', color: 'bg-slate-300 text-slate-700', icon: User };
    };

    const rank = getRank(eventsAttended);
    const Icon = rank.icon;

    return (
        <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-md",
            rank.color
        )}>
            <Icon className="w-4 h-4" />
            {rank.name}
        </div>
    );
};

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<any[]>([]);
    const [userRsvps, setUserRsvps] = useState<any[]>([]);
    const [activeSection, setActiveSection] = useState<'overview' | 'missions' | 'profile'>('overview');
    const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const fetchRsvps = async (userEmail: string) => {
        const rsvpsRes = await fetch('/api/rsvps');
        if (rsvpsRes.ok) {
            const rsvpsData = await rsvpsRes.json();
            const myRsvps = (rsvpsData || []).filter((r: any) => r.email === userEmail);
            setUserRsvps(myRsvps);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check auth
                const { data: { user } } = await supabase.auth.getUser();
                console.log('Dashboard Client Check User:', user ? user.email : 'No User');

                if (!user) {
                    console.log('Dashboard Client: No session found.');
                    setLoading(false);
                    return;
                }

                // SANITIZER (Server-Side Fix):
                // Check if the user has a "poisoned" profile (huge Base64 string in avatar_url)
                // This is the root cause of the 165-cookie explosion.
                const metadata = user.user_metadata || {};
                if (metadata.avatar_url && metadata.avatar_url.length > 500) {
                    console.warn("DASHBOARD: Critical metadata corruption detected. Sanitizing profile...");

                    // Show a toast or some indicator (using console for now, maybe add UI state later)
                    // We must wait for this to finish before reloading.
                    await supabase.auth.updateUser({
                        data: { avatar_url: null }
                    });

                    // Force a reload to clear the cookies associated with the huge data
                    window.location.reload();
                    return;
                }

                setUser(user);

                // Fetch events
                const eventsRes = await fetch('/api/events');
                if (eventsRes.ok) {
                    const eventsData = await eventsRes.json();
                    setEvents(eventsData);
                }

                // Fetch user's RSVPs
                if (user?.email) {
                    await fetchRsvps(user.email);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    // Quick RSVP from dashboard
    const handleQuickRSVP = async (eventId: string) => {
        if (!user) return;

        setRsvpLoading(eventId);
        try {
            const existingRsvp = userRsvps.find(r => r.event_id === eventId);

            if (existingRsvp) {
                // Cancel RSVP
                const res = await fetch(`/api/rsvps?id=${existingRsvp.id}`, { method: 'DELETE' });
                if (res.ok) {
                    await fetchRsvps(user.email);
                }
            } else {
                // Create RSVP
                const res = await fetch('/api/rsvps', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ event_id: eventId })
                });
                if (res.ok) {
                    await fetchRsvps(user.email);
                }
            }
        } catch (error) {
            console.error('RSVP error:', error);
        } finally {
            setRsvpLoading(null);
        }
    };

    // Check if user has RSVP'd to an event
    const hasRsvp = (eventId: string) => userRsvps.some(r => r.event_id === eventId);

    // Get upcoming events user has RSVP'd to
    const rsvpEventIds = userRsvps.map(r => r.event_id);
    const myUpcomingEvents = events
        .filter(e => rsvpEventIds.includes(e.id))
        .filter(e => new Date(e.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    // Next launch
    const nextLaunch = events
        .filter(e => e.type === 'launch' && new Date(e.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    // All upcoming events
    const upcomingEvents = events
        .filter(e => new Date(e.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 6);

    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Pilot';
    const pilotTitle = user?.user_metadata?.pilot_title || 'Rocket Enthusiast';
    const avatarColorIndex = user?.user_metadata?.avatar_color || 0;
    const avatarColor = AVATAR_COLORS[avatarColorIndex] || AVATAR_COLORS[0];
    const avatarUrl = user?.user_metadata?.avatar_url;

    const [showRecovery, setShowRecovery] = useState(false);

    useEffect(() => {
        // Safety timeout to detect hanging (e.g. 494 Header Too Large errors)
        const timer = setTimeout(() => {
            if (loading) {
                setShowRecovery(true);
            }
        }, 8000); // 8 seconds timeout

        return () => clearTimeout(timer);
    }, [loading]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center z-10 p-8 max-w-md"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 mx-auto mb-6"
                    >
                        <Rocket className="w-full h-full text-rose-400" />
                    </motion.div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest mb-6">Initializing Mission Control...</p>

                    {showRecovery && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-rose-50 border-2 border-rose-200 p-6 rounded-2xl"
                        >
                            <div className="flex justify-center mb-3">
                                <Shield className="w-8 h-8 text-rose-500" />
                            </div>
                            <h3 className="text-slate-900 font-black uppercase mb-2">Connection Stalled</h3>
                            <p className="text-slate-600 text-sm mb-4">
                                We're having trouble connecting to the secure channel. This usually happens when session data gets clogged.
                            </p>
                            <div className="bg-amber-100 text-amber-800 p-3 rounded-lg mb-4 text-xs font-bold border border-amber-200">
                                ⚠ SYSTEM SELF-REPAIRING: Please wait 10 seconds on this screen without clicking anything. We are fixing your profile data.
                            </div>
                            <button
                                onClick={() => window.location.href = '/api/auth/clear-cookies'}
                                className="w-full py-3 bg-rose-500 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-rose-600 shadow-lg hover:shadow-none transition-all"
                            >
                                Force Reset Connection
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent relative overflow-hidden selection:bg-amber-200 selection:text-slate-900">
            {/* Subtle grid pattern */}
            <div className="fixed inset-0 pointer-events-none z-0 transition-opacity">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="flex min-h-screen relative z-10">
                {/* Sidebar */}
                <motion.aside
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-80 bg-white/60 backdrop-blur-xl border-r-2 border-slate-900/10 p-6 flex flex-col sticky top-0 h-screen"
                >
                    {/* Logo */}
                    <div className="flex items-center gap-4 mb-10">
                        <div className="relative">
                            <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900">
                                <Rocket className="w-7 h-7 text-slate-900" />
                            </div>
                        </div>
                        <div>
                            <h4 className="font-black text-slate-900 uppercase tracking-tight text-lg">MISSION</h4>
                            <p className="text-xs text-rose-500 font-bold tracking-widest">CONTROL</p>
                        </div>
                    </div>

                    {/* Pilot Card */}
                    <FluidGlass className="p-5 rounded-2xl border-2 border-slate-200 mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={cn(
                                "w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-black text-xl overflow-hidden shadow-lg",
                                !avatarUrl && avatarColor.from,
                                !avatarUrl && avatarColor.to
                            )}>
                                {avatarUrl ? (
                                    <Image
                                        src={avatarUrl}
                                        alt={userName}
                                        width={56}
                                        height={56}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    userName.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-slate-900 truncate">{userName}</p>
                                <p className="text-xs text-slate-500 truncate">{pilotTitle}</p>
                            </div>
                        </div>
                        <PilotRank eventsAttended={userRsvps.length} />
                    </FluidGlass>

                    {/* Navigation */}
                    <nav className="space-y-2 flex-1">
                        {[
                            { id: 'overview', label: 'Command Center', icon: Gauge },
                            { id: 'missions', label: 'My Missions', icon: Target },
                            { id: 'profile', label: 'Pilot Profile', icon: User },
                        ].map((item) => (
                            <motion.button
                                key={item.id}
                                onClick={() => setActiveSection(item.id as any)}
                                whileHover={{ x: 4 }}
                                className={cn(
                                    "w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all border-2 border-transparent",
                                    activeSection === item.id
                                        ? "bg-slate-900 text-white shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] border-slate-900"
                                        : "text-slate-500 hover:bg-white hover:border-slate-200 hover:text-slate-900 hover:shadow-sm"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </motion.button>
                        ))}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="space-y-2">
                        <Link
                            href="/settings"
                            className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-sm transition-all"
                        >
                            <Settings className="w-5 h-5" />
                            Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 font-bold text-sm transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </motion.aside>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {activeSection === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* Welcome Header */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">
                                            Welcome back, <ShinyText text={userName} speed={3} className="text-rose-500" />
                                        </h1>
                                        <p className="text-slate-500 font-medium mt-1">Here's your mission status for today</p>
                                    </div>
                                    <Link
                                        href="/events"
                                        className="px-6 py-3 bg-amber-400 border-2 border-slate-900 rounded-xl font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                                    >
                                        <GlitchText text="Browse Events" />
                                    </Link>
                                </div>

                                {/* Next Launch Countdown */}
                                {nextLaunch && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative overflow-hidden rounded-3xl border-2 border-slate-900 bg-white p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl" />
                                        <div className="relative z-10">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-amber-400 rounded-full mb-4">
                                                <Rocket className="w-4 h-4" />
                                                <span className="text-xs font-black uppercase tracking-widest">Next Launch</span>
                                            </div>
                                            <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">{nextLaunch.title}</h2>
                                            <p className="text-slate-500 mb-6 flex items-center gap-4 font-medium">
                                                <span className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(nextLaunch.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                                </span>
                                                {nextLaunch.location && (
                                                    <span className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        {nextLaunch.location}
                                                    </span>
                                                )}
                                            </p>
                                            <CountdownTimer targetDate={nextLaunch.date} />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        {
                                            label: 'MISSIONS REGISTERED',
                                            value: userRsvps.length,
                                            icon: Ticket,
                                            color: 'bg-emerald-400',
                                            border: 'border-emerald-500'
                                        },
                                        {
                                            label: 'UPCOMING EVENTS',
                                            value: upcomingEvents.length,
                                            icon: Calendar,
                                            color: 'bg-blue-400',
                                            border: 'border-blue-500'
                                        },
                                        {
                                            label: 'PILOT LEVEL',
                                            value: Math.min(Math.floor(userRsvps.length / 2) + 1, 10),
                                            icon: Zap,
                                            color: 'bg-amber-400',
                                            border: 'border-amber-500'
                                        },
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            whileHover={{ y: -4 }}
                                        >
                                            <AppleGlass intensity="low" className={cn("p-6 rounded-2xl border-2 bg-white", stat.border)}>
                                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md", stat.color)}>
                                                    <stat.icon className="w-6 h-6 text-white" />
                                                </div>
                                                <p className="text-4xl font-black text-slate-900 mb-1">
                                                    <AnimatedCounter value={stat.value} />
                                                </p>
                                                <p className="text-xs font-bold text-slate-500 font-medium uppercase tracking-widest">{stat.label}</p>
                                            </AppleGlass>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Upcoming Events */}
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Upcoming Missions</h2>
                                        <Link
                                            href="/events"
                                            className="text-rose-500 hover:text-rose-400 font-bold text-sm flex items-center gap-2 transition-colors"
                                        >
                                            View All <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {upcomingEvents.slice(0, 4).map((event, i) => (
                                            <motion.div
                                                key={event.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                whileHover={{ x: 4 }}
                                            >
                                                <FluidGlass className="p-5 rounded-xl border-2 border-slate-200 hover:border-rose-300 transition-all cursor-pointer">
                                                    <div className="flex items-start gap-4">
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md",
                                                            event.type === 'launch' ? 'bg-rose-400 text-white' :
                                                                event.type === 'meeting' ? 'bg-blue-400 text-white' :
                                                                    'bg-amber-400 text-slate-900'
                                                        )}>
                                                            {event.type === 'launch' ? <Rocket className="w-6 h-6" /> :
                                                                event.type === 'meeting' ? <Target className="w-6 h-6" /> :
                                                                    <Star className="w-6 h-6" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-slate-900 dark:text-white truncate">{event.title}</h3>
                                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                                </span>
                                                                {event.time && (
                                                                    <span className="flex items-center gap-1">
                                                                        <Clock className="w-3 h-3" />
                                                                        {event.time}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {/* Quick RSVP Button */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleQuickRSVP(event.id);
                                                            }}
                                                            disabled={rsvpLoading === event.id}
                                                            className={cn(
                                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 border-2",
                                                                hasRsvp(event.id)
                                                                    ? "bg-emerald-100 text-emerald-600 border-emerald-300"
                                                                    : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-rose-100 hover:text-rose-500 hover:border-rose-300"
                                                            )}
                                                        >
                                                            {rsvpLoading === event.id ? (
                                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                            ) : hasRsvp(event.id) ? (
                                                                <Check className="w-5 h-5" />
                                                            ) : (
                                                                <Plus className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </FluidGlass>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {upcomingEvents.length === 0 && (
                                        <AppleGlass className="text-center py-12 rounded-2xl border-2 border-slate-200">
                                            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-500 font-medium">No upcoming missions scheduled</p>
                                        </AppleGlass>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'missions' && (
                            <motion.div
                                key="missions"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">My Missions</h1>
                                    <p className="text-slate-500 font-medium">Events you've registered for</p>
                                </div>

                                {myUpcomingEvents.length > 0 ? (
                                    <div className="space-y-4">
                                        {myUpcomingEvents.map((event, i) => (
                                            <motion.div
                                                key={event.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <FluidGlass className="p-6 rounded-2xl border-2 border-slate-200">
                                                    <div className="flex items-center gap-6">
                                                        <div className={cn(
                                                            "w-16 h-16 rounded-xl flex items-center justify-center shadow-lg",
                                                            event.type === 'launch' ? 'bg-rose-400 text-white' :
                                                                event.type === 'meeting' ? 'bg-blue-400 text-white' :
                                                                    'bg-amber-400 text-slate-900'
                                                        )}>
                                                            {event.type === 'launch' ? <Rocket className="w-8 h-8" /> :
                                                                event.type === 'meeting' ? <Target className="w-8 h-8" /> :
                                                                    <Star className="w-8 h-8" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-black text-xl text-slate-900 dark:text-white mb-1">{event.title}</h3>
                                                            <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                                                                <span className="flex items-center gap-2">
                                                                    <Calendar className="w-4 h-4" />
                                                                    {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                                </span>
                                                                {event.location && (
                                                                    <span className="flex items-center gap-2">
                                                                        <MapPin className="w-4 h-4" />
                                                                        {event.location}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full font-bold text-xs uppercase tracking-widest">
                                                            Registered
                                                        </div>
                                                    </div>
                                                </FluidGlass>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <AppleGlass className="text-center py-16 rounded-2xl border-2 border-slate-200">
                                        <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500 font-bold text-lg mb-4">No missions yet</p>
                                        <Link
                                            href="/events"
                                            className="inline-block px-6 py-3 bg-rose-400 text-white font-bold rounded-xl hover:bg-rose-500 transition-colors"
                                        >
                                            Browse Events
                                        </Link>
                                    </AppleGlass>
                                )}
                            </motion.div>
                        )}

                        {activeSection === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Pilot Profile</h1>
                                    <p className="text-slate-500 font-medium">Your mission stats and achievements</p>
                                </div>

                                {/* Profile Card */}
                                <FluidGlass className="p-8 rounded-3xl border-2 border-slate-200">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className={cn(
                                            "w-24 h-24 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black text-4xl overflow-hidden shadow-lg",
                                            !avatarUrl && avatarColor.from,
                                            !avatarUrl && avatarColor.to
                                        )}>
                                            {avatarUrl ? (
                                                <Image src={avatarUrl} alt={userName} width={96} height={96} className="w-full h-full object-cover" />
                                            ) : (
                                                userName.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 dark:text-white">{userName}</h2>
                                            <p className="text-slate-500 font-medium mb-2">{pilotTitle}</p>
                                            <PilotRank eventsAttended={userRsvps.length} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <AppleGlass className="p-4 text-center rounded-xl border-2 border-slate-200">
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">{userRsvps.length}</p>
                                            <p className="text-xs text-slate-500 font-bold uppercase">Total RSVPs</p>
                                        </AppleGlass>
                                        <AppleGlass className="p-4 text-center rounded-xl border-2 border-slate-200">
                                            <p className="text-2xl font-black text-slate-900">{myUpcomingEvents.length}</p>
                                            <p className="text-xs text-slate-500 font-bold uppercase">Upcoming</p>
                                        </AppleGlass>
                                        <AppleGlass className="p-4 text-center rounded-xl border-2 border-slate-200">
                                            <p className="text-2xl font-black text-slate-900">{Math.min(Math.floor(userRsvps.length / 2) + 1, 10)}</p>
                                            <p className="text-xs text-slate-500 font-bold uppercase">Level</p>
                                        </AppleGlass>
                                        <AppleGlass className="p-4 text-center rounded-xl border-2 border-slate-200">
                                            <p className="text-2xl font-black text-slate-900">{userRsvps.length >= 5 ? 3 : userRsvps.length >= 1 ? 1 : 0}</p>
                                            <p className="text-xs text-slate-500 font-bold uppercase">Badges</p>
                                        </AppleGlass>
                                    </div>
                                </FluidGlass>

                                {/* Achievements */}
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 uppercase">Achievements</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { name: 'First Launch', desc: 'Attended your first event', icon: Rocket, earned: userRsvps.length >= 1, color: 'bg-rose-400' },
                                            { name: 'Regular Pilot', desc: 'Attended 5+ events', icon: Star, earned: userRsvps.length >= 5, color: 'bg-amber-400' },
                                            { name: 'Mission Veteran', desc: 'Attended 10+ events', icon: Trophy, earned: userRsvps.length >= 10, color: 'bg-purple-400' },
                                        ].map((badge, i) => (
                                            <AppleGlass
                                                key={i}
                                                className={cn(
                                                    "p-6 rounded-2xl border-2 transition-all",
                                                    badge.earned ? "border-slate-900 dark:border-white bg-white dark:bg-slate-900" : "border-slate-200 dark:border-slate-700 opacity-50"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md",
                                                    badge.earned ? badge.color : "bg-slate-200"
                                                )}>
                                                    <badge.icon className={cn("w-6 h-6", badge.earned ? "text-white" : "text-slate-400")} />
                                                </div>
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{badge.name}</h4>
                                                <p className="text-sm text-slate-500">{badge.desc}</p>
                                            </AppleGlass>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
