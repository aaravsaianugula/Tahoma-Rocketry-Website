"use client";
import { useState, useEffect } from "react";
import { SpotlightCard } from "@/components/ui/cards";
import { Calendar, Edit, Trash2, Plus, Users, Rocket, BarChart3, Image as ImageIcon, LogOut, Search, Filter, ChevronRight, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { TextPressure } from "@/components/ui/text-pressure";
// import { MagneticButton } from "@/components/ui/magnetic-button";
import { FadeIn, ShinyText } from "@/components/ui/text-animations";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"overview" | "events" | "gallery" | "rsvps">("overview");
    const [events, setEvents] = useState<any[]>([]);
    const [galleryItems, setGalleryItems] = useState<any[]>([]);
    const [rsvps, setRsvps] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Event State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        date: "",
        time: "",
        location: "",
        type: "launch",
        shortDescription: "",
        longDescription: ""
    });



    // Recurrence State
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceFrequency, setRecurrenceFrequency] = useState<"weekly" | "biweekly" | "monthly">("weekly");
    const [recurrenceEndDate, setRecurrenceEndDate] = useState("");
    const [selectedDays, setSelectedDays] = useState<number[]>([]); // 0=Sun, 1=Mon, etc.

    // Gallery State
    const [showAddMediaModal, setShowAddMediaModal] = useState(false);
    const [newMedia, setNewMedia] = useState({
        title: "",
        description: "",
        category: "launch",
        type: "image",
        url: "",
        date: ""
    });

    // Edit State
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [editingMedia, setEditingMedia] = useState<any>(null);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/events', { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                // console.log("DEBUG: Fetched events:", data);
                setEvents(data);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    // ... (other fetch functions)
    const fetchGallery = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/gallery');
            if (response.ok) {
                const data = await response.json();
                setGalleryItems(data);
            }
        } catch (error) {
            console.error('Failed to fetch gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRSVPs = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/rsvps');
            if (response.ok) {
                const data = await response.json();
                setRsvps(data);
            }
        } catch (error) {
            console.error('Failed to fetch RSVPs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data based on active tab
    useEffect(() => {
        if (activeTab === 'events' || activeTab === 'overview') {
            fetchEvents();
        }
        if (activeTab === 'gallery' || activeTab === 'overview') {
            fetchGallery();
        }
        if (activeTab === 'rsvps' || activeTab === 'overview') {
            fetchRSVPs();
        }
    }, [activeTab]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    // Event Handlers
    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let payload: any = newEvent;

            if (isRecurring && recurrenceEndDate) {
                // ... (recurrence logic remains the same)
                const events = [];
                // If no start date is provided for a recurring event, default to today
                let currentDate = newEvent.date ? new Date(newEvent.date) : new Date();
                const endDate = new Date(recurrenceEndDate);

                // Validation: Ensure end date is after start date
                if (endDate <= currentDate) {
                    alert("End date must be after the start date.");
                    return;
                }

                // Prevent infinite loops or excessive creation
                let count = 0;
                const maxEvents = 100; // Safety limit

                if (recurrenceFrequency === 'weekly' && selectedDays.length > 0) {
                    // Day-specific weekly recurrence (e.g., Mon/Wed)
                    while (currentDate <= endDate && count < maxEvents) {
                        if (selectedDays.includes(currentDate.getDay())) {
                            events.push({
                                ...newEvent,
                                date: currentDate.toISOString(),
                            });
                            count++;
                        }
                        // Advance one day
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                } else {
                    // Standard recurrence
                    while (currentDate <= endDate && count < maxEvents) {
                        events.push({
                            ...newEvent,
                            date: currentDate.toISOString(),
                        });

                        // Increment date
                        if (recurrenceFrequency === 'weekly') {
                            currentDate.setDate(currentDate.getDate() + 7);
                        } else if (recurrenceFrequency === 'biweekly') {
                            currentDate.setDate(currentDate.getDate() + 14);
                        } else if (recurrenceFrequency === 'monthly') {
                            currentDate.setMonth(currentDate.getMonth() + 1);
                        }
                        count++;
                    }
                }

                if (events.length === 0) {
                    // Fallback if logic produced no events (e.g. wrong days selected for range)
                    events.push(newEvent);
                }

                payload = events;
            }

            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setShowCreateModal(false);
                setNewEvent({
                    title: "",
                    date: "",
                    time: "",
                    location: "",
                    type: "launch",
                    shortDescription: "",
                    longDescription: ""
                });
                setIsRecurring(false);
                setRecurrenceEndDate("");
                setSelectedDays([]);
                alert("Event created successfully!");
                fetchEvents();
            } else {
                const errorData = await response.json();
                alert(`Failed to create event: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Failed to create event:', error);
            alert('An unexpected error occurred.');
        }
    };

    const handleDeleteEvent = async (id: string) => {
        // if (!confirm('Are you sure you want to delete this event?')) return;
        try {
            const response = await fetch(`/api/events?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchEvents();
            }
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };

    const handleUpdateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingEvent) return;

        try {
            const response = await fetch('/api/events', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingEvent),
            });

            if (response.ok) {
                setEditingEvent(null);
                fetchEvents();
            }
        } catch (error) {
            console.error('Failed to update event:', error);
        }
    };

    // Gallery Handlers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewMedia(prev => ({ ...prev, url: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddMedia = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMedia),
            });

            if (response.ok) {
                setShowAddMediaModal(false);
                setNewMedia({
                    title: "",
                    description: "",
                    category: "launch",
                    type: "image",
                    url: "",
                    date: ""
                });
                fetchGallery();
            }
        } catch (error) {
            console.error('Failed to add media:', error);
        }
    };

    const handleDeleteMedia = async (id: string) => {
        // if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            const response = await fetch(`/api/gallery?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchGallery();
            }
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const handleUpdateMedia = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMedia) return;

        try {
            const response = await fetch('/api/gallery', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingMedia),
            });

            if (response.ok) {
                setEditingMedia(null);
                fetchGallery();
            }
        } catch (error) {
            console.error('Failed to update media:', error);
        }
    };

    const handleDeleteRSVP = async (id: string) => {
        // if (!confirm('Are you sure you want to delete this RSVP?')) return;
        try {
            const response = await fetch(`/api/rsvps?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchRSVPs();
            }
        } catch (error) {
            console.error('Failed to delete RSVP:', error);
        }
    };

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex flex-col md:flex-row min-h-screen relative">
            {/* Flash In Transition */}
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="fixed inset-0 bg-white z-[100] pointer-events-none"
            />

            {/* Radical Sidebar */}
            <motion.div
                animate={{
                    width: isSidebarCollapsed ? "80px" : "288px"
                }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.1 }}
                className="bg-white/40 backdrop-blur-xl border-r border-white/50 flex flex-col justify-between relative z-20 h-screen sticky top-0 overflow-hidden"
            >
                <div className={cn("transition-all duration-300", isSidebarCollapsed ? "p-4" : "p-6")}>
                    <div className={cn("flex items-center mb-12 overflow-hidden transition-all duration-300", isSidebarCollapsed ? "justify-center gap-0" : "gap-3")}>
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg shrink-0">
                            <Rocket className="w-6 h-6" />
                        </div>
                        <motion.div
                            animate={{ opacity: isSidebarCollapsed ? 0 : 1, width: isSidebarCollapsed ? 0 : "auto" }}
                            className="whitespace-nowrap overflow-hidden"
                        >
                            <h1 className="font-black text-slate-900 uppercase tracking-tighter text-xl leading-none ml-3">Command<br />Center</h1>
                        </motion.div>
                    </div>

                    <nav className="space-y-3">
                        {[
                            { id: "overview", label: "Overview", icon: LayoutDashboard },
                            { id: "events", label: "Events", icon: Calendar },
                            { id: "gallery", label: "Gallery", icon: ImageIcon },
                            { id: "rsvps", label: "RSVPs", icon: Users },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={cn(
                                    "w-full flex items-center rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 group relative overflow-hidden",
                                    isSidebarCollapsed ? "justify-center px-2 py-4 gap-0" : "px-4 py-4 gap-4",
                                    activeTab === item.id
                                        ? "bg-slate-900 text-white shadow-lg"
                                        : "text-slate-500 hover:bg-white/50 hover:text-slate-900"
                                )}
                                title={isSidebarCollapsed ? item.label : undefined}
                            >
                                <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
                                <motion.span
                                    animate={{ opacity: isSidebarCollapsed ? 0 : 1, width: isSidebarCollapsed ? 0 : "auto" }}
                                    className="relative z-10 whitespace-nowrap overflow-hidden"
                                >
                                    {item.label}
                                </motion.span>
                                {activeTab === item.id && (
                                    <motion.div layoutId="activeTab" className="absolute inset-0 bg-slate-900 z-0" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className={cn("flex flex-col gap-4 transition-all duration-300", isSidebarCollapsed ? "p-4" : "p-6")}>
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="w-full flex items-center justify-center p-3 rounded-xl bg-white/50 hover:bg-white text-slate-500 hover:text-slate-900 transition-all"
                    >
                        {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider"><ChevronRight className="w-4 h-4 rotate-180" /> Collapse</div>}
                    </button>

                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center rounded-xl text-sm font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-50 transition-colors",
                            isSidebarCollapsed ? "justify-center px-2 py-4 gap-0" : "px-4 py-4 gap-3"
                        )}
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <motion.span
                            animate={{ opacity: isSidebarCollapsed ? 0 : 1, width: isSidebarCollapsed ? 0 : "auto" }}
                            className="whitespace-nowrap overflow-hidden"
                        >
                            Logout
                        </motion.span>
                    </button>
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <header className="mb-12 flex justify-between items-end">
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Welcome back, Pilot</p>
                            <div className="h-16 relative">
                                <TextPressure
                                    text={activeTab}
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
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="bg-white/50 backdrop-blur-md border border-white/60 rounded-full px-4 py-2 flex items-center gap-2 text-slate-500">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-wider">System Online</span>
                            </div>
                        </div>
                    </header>

                    <AnimatePresence mode="wait">
                        {activeTab === "overview" && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <SpotlightCard className="bg-white/50 border-white/60">
                                        <div className="p-6">
                                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                                                <Rocket className="w-6 h-6 text-cyan-400" />
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900 mb-1">{events.length}</h3>
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Missions</p>
                                        </div>
                                    </SpotlightCard>
                                    <SpotlightCard className="bg-white/50 border-white/60">
                                        <div className="p-6">
                                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                                                <ImageIcon className="w-6 h-6 text-cyan-400" />
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900 mb-1">{galleryItems.length}</h3>
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Visual Assets</p>
                                        </div>
                                    </SpotlightCard>
                                    <SpotlightCard className="bg-white/50 border-white/60">
                                        <div className="p-6">
                                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                                                <Users className="w-6 h-6 text-cyan-400" />
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900 mb-1">{rsvps.length}</h3>
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Squadron Pilots</p>
                                        </div>
                                    </SpotlightCard>
                                    <SpotlightCard className="bg-white/50 border-white/60">
                                        <div className="p-6">
                                            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                                                <BarChart3 className="w-6 h-6 text-cyan-400" />
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900 mb-1">100%</h3>
                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">System Status</p>
                                        </div>
                                    </SpotlightCard>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "events" && (
                            <motion.div
                                key="events"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-8"
                            >
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-cyan-500 text-white font-bold uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-cyan-500/30"
                                    >
                                        <Plus className="w-4 h-4" /> Initialize Event
                                    </button>
                                </div>

                                {showCreateModal && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                                    >
                                        <div className="bg-white/90 backdrop-blur-2xl border border-white/60 p-8 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">New Mission Parameters</h3>
                                            <form onSubmit={handleCreateEvent} className="space-y-6">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <input
                                                        type="text"
                                                        placeholder="Mission Title"
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors"
                                                        value={newEvent.title}
                                                        onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                                        required
                                                    />
                                                    <select
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors"
                                                        value={newEvent.type}
                                                        onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                                                    >
                                                        <option value="launch">Launch</option>
                                                        <option value="meeting">Meeting</option>
                                                        <option value="fundraiser">Fundraiser</option>
                                                    </select>
                                                    <input
                                                        type="date"
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors"
                                                        value={newEvent.date}
                                                        onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                                        required={!isRecurring}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Time (e.g. 0900 Hours)"
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors"
                                                        value={newEvent.time}
                                                        onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Coordinates / Location"
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors col-span-2"
                                                        value={newEvent.location}
                                                        onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                                                    />
                                                </div>
                                                <textarea
                                                    placeholder="Mission Briefing (Short Description)"
                                                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors h-32"
                                                    value={newEvent.shortDescription}
                                                    onChange={e => setNewEvent({ ...newEvent, shortDescription: e.target.value })}
                                                />

                                                {/* Recurrence Controls */}
                                                <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <input
                                                            type="checkbox"
                                                            id="isRecurring"
                                                            className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                                            checked={isRecurring}
                                                            onChange={e => setIsRecurring(e.target.checked)}
                                                        />
                                                        <label htmlFor="isRecurring" className="font-bold text-slate-900 uppercase tracking-wider text-sm">Repeat Event?</label>
                                                    </div>

                                                    {isRecurring && (
                                                        <div className="grid grid-cols-1 gap-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Frequency</label>
                                                                    <select
                                                                        className="w-full bg-white border-2 border-slate-200 focus:border-slate-900 rounded-lg p-2 font-bold text-slate-900 outline-none"
                                                                        value={recurrenceFrequency}
                                                                        onChange={e => setRecurrenceFrequency(e.target.value as any)}
                                                                    >
                                                                        <option value="weekly">Weekly</option>
                                                                        <option value="biweekly">Bi-Weekly</option>
                                                                        <option value="monthly">Monthly</option>
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Repeat Until</label>
                                                                    <input
                                                                        type="date"
                                                                        className="w-full bg-white border-2 border-slate-200 focus:border-slate-900 rounded-lg p-2 font-bold text-slate-900 outline-none"
                                                                        value={recurrenceEndDate}
                                                                        onChange={e => setRecurrenceEndDate(e.target.value)}
                                                                        required={isRecurring}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {recurrenceFrequency === 'weekly' && (
                                                                <div>
                                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Repeat On</label>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                                                            <button
                                                                                key={day}
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    if (selectedDays.includes(index)) {
                                                                                        setSelectedDays(selectedDays.filter(d => d !== index));
                                                                                    } else {
                                                                                        setSelectedDays([...selectedDays, index]);
                                                                                    }
                                                                                }}
                                                                                className={cn(
                                                                                    "px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all border-2",
                                                                                    selectedDays.includes(index)
                                                                                        ? "bg-slate-900 text-white border-slate-900"
                                                                                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
                                                                                )}
                                                                            >
                                                                                {day}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex justify-end gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCreateModal(false)}
                                                        className="px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors"
                                                    >
                                                        Abort
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold uppercase tracking-wider hover:bg-cyan-500 transition-colors shadow-lg"
                                                    >
                                                        Confirm Launch
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}

                                {editingEvent && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                                    >
                                        <div className="bg-white/90 backdrop-blur-2xl border border-white/60 p-8 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">Update Mission Parameters</h3>
                                            <form onSubmit={handleUpdateEvent} className="space-y-6">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <input
                                                        type="text"
                                                        placeholder="Mission Title"
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors"
                                                        value={editingEvent.title}
                                                        onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                                                        required
                                                    />
                                                    <select
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors"
                                                        value={editingEvent.type}
                                                        onChange={e => setEditingEvent({ ...editingEvent, type: e.target.value })}
                                                    >
                                                        <option value="launch">Launch</option>
                                                        <option value="meeting">Meeting</option>
                                                        <option value="fundraiser">Fundraiser</option>
                                                    </select>
                                                    <input
                                                        type="date"
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors"
                                                        value={editingEvent.date.split('T')[0]}
                                                        onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })}
                                                        required
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Time (e.g. 0900 Hours)"
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors"
                                                        value={editingEvent.time || ''}
                                                        onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Coordinates / Location"
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors col-span-2"
                                                        value={editingEvent.location}
                                                        onChange={e => setEditingEvent({ ...editingEvent, location: e.target.value })}
                                                    />
                                                </div>
                                                <textarea
                                                    placeholder="Mission Briefing (Short Description)"
                                                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors h-32"
                                                    value={editingEvent.shortDescription}
                                                    onChange={e => setEditingEvent({ ...editingEvent, shortDescription: e.target.value })}
                                                />
                                                <div className="flex justify-end gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingEvent(null)}
                                                        className="px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors"
                                                    >
                                                        Abort
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold uppercase tracking-wider hover:bg-cyan-500 transition-colors shadow-lg"
                                                    >
                                                        Update Mission
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl overflow-hidden shadow-xl">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50/50 border-b border-slate-100">
                                            <tr>
                                                <th className="p-6 font-black text-slate-900 uppercase tracking-wider text-xs">Mission</th>
                                                <th className="p-6 font-black text-slate-900 uppercase tracking-wider text-xs">Date</th>
                                                <th className="p-6 font-black text-slate-900 uppercase tracking-wider text-xs">Type</th>
                                                <th className="p-6 font-black text-slate-900 uppercase tracking-wider text-xs">Location</th>
                                                <th className="p-6 text-right font-black text-slate-900 uppercase tracking-wider text-xs">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {events.map((event) => (
                                                <tr key={event.id} className="hover:bg-white/50 transition-colors group">
                                                    <td className="p-6 font-bold text-slate-900">{event.title}</td>
                                                    <td className="p-6 font-medium text-slate-600">{new Date(event.date).toLocaleDateString()}</td>
                                                    <td className="p-6">
                                                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                                                            {event.type}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 font-medium text-slate-600">{event.location}</td>
                                                    <td className="p-6 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => setEditingEvent(event)}
                                                                className="p-2 rounded-lg hover:bg-blue-100 text-slate-400 hover:text-blue-500 transition-colors"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteEvent(event.id)}
                                                                className="p-2 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {events.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="p-12 text-center text-slate-400 font-medium">
                                                        No active missions found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "gallery" && (
                            <motion.div
                                key="gallery"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowAddMediaModal(true)}
                                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-cyan-500 text-white font-bold uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-cyan-500/30"
                                    >
                                        <Plus className="w-4 h-4" /> Upload Asset
                                    </button>
                                </div>

                                {showAddMediaModal && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                                    >
                                        <div className="bg-white/90 backdrop-blur-2xl border border-white/60 p-8 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">New Visual Asset</h3>
                                            <form onSubmit={handleAddMedia} className="space-y-6">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <input
                                                        type="text"
                                                        placeholder="Asset Title"
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors"
                                                        value={newMedia.title}
                                                        onChange={e => setNewMedia({ ...newMedia, title: e.target.value })}
                                                        required
                                                    />
                                                    <select
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors"
                                                        value={newMedia.type}
                                                        onChange={e => setNewMedia({ ...newMedia, type: e.target.value })}
                                                    >
                                                        <option value="image">Image</option>
                                                        <option value="video">Video</option>
                                                    </select>
                                                    <div className="col-span-2 space-y-2">
                                                        <label className="block text-xs font-bold text-slate-500 uppercase">Upload File</label>
                                                        <input
                                                            type="file"
                                                            accept="image/*,video/*"
                                                            onChange={handleFileChange}
                                                            className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-cyan-500"
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Asset URL (e.g. /assets/...)"
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors col-span-2"
                                                        value={newMedia.url}
                                                        onChange={e => setNewMedia({ ...newMedia, url: e.target.value })}
                                                        required
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Category (e.g. Launch, Build)"
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors"
                                                        value={newMedia.category}
                                                        onChange={e => setNewMedia({ ...newMedia, category: e.target.value })}
                                                    />
                                                    <input
                                                        type="date"
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors"
                                                        value={newMedia.date}
                                                        onChange={e => setNewMedia({ ...newMedia, date: e.target.value })}
                                                    />
                                                </div>
                                                <textarea
                                                    placeholder="Asset Description"
                                                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors h-32"
                                                    value={newMedia.description}
                                                    onChange={e => setNewMedia({ ...newMedia, description: e.target.value })}
                                                />
                                                <div className="flex justify-end gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowAddMediaModal(false)}
                                                        className="px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold uppercase tracking-wider hover:bg-cyan-500 transition-colors shadow-lg"
                                                    >
                                                        Upload
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}

                                {editingMedia && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
                                    >
                                        <div className="bg-white/90 backdrop-blur-2xl border border-white/60 p-8 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">Update Visual Asset</h3>
                                            <form onSubmit={handleUpdateMedia} className="space-y-6">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <input
                                                        type="text"
                                                        placeholder="Asset Title"
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors"
                                                        value={editingMedia.title}
                                                        onChange={e => setEditingMedia({ ...editingMedia, title: e.target.value })}
                                                        required
                                                    />
                                                    <select
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors"
                                                        value={editingMedia.type}
                                                        onChange={e => setEditingMedia({ ...editingMedia, type: e.target.value })}
                                                    >
                                                        <option value="image">Image</option>
                                                        <option value="video">Video</option>
                                                    </select>
                                                    <input
                                                        type="text"
                                                        placeholder="Asset URL (e.g. /assets/...)"
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors col-span-2"
                                                        value={editingMedia.url}
                                                        onChange={e => setEditingMedia({ ...editingMedia, url: e.target.value })}
                                                        required
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Category (e.g. Launch, Build)"
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors"
                                                        value={editingMedia.category}
                                                        onChange={e => setEditingMedia({ ...editingMedia, category: e.target.value })}
                                                    />
                                                    <input
                                                        type="date"
                                                        className="bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors"
                                                        value={editingMedia.date ? editingMedia.date.split('T')[0] : ''}
                                                        onChange={e => setEditingMedia({ ...editingMedia, date: e.target.value })}
                                                    />
                                                </div>
                                                <textarea
                                                    placeholder="Asset Description"
                                                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl p-4 font-bold text-slate-900 outline-none transition-colors h-32"
                                                    value={editingMedia.description}
                                                    onChange={e => setEditingMedia({ ...editingMedia, description: e.target.value })}
                                                />
                                                <div className="flex justify-end gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingMedia(null)}
                                                        className="px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold uppercase tracking-wider hover:bg-cyan-500 transition-colors shadow-lg"
                                                    >
                                                        Update Asset
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {galleryItems.map((item) => (
                                        <div key={item.id} className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500">
                                            <div className="aspect-video bg-slate-100 relative overflow-hidden">
                                                {item.type === 'video' ? (
                                                    <video src={item.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" />
                                                ) : (
                                                    <img src={item.url} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" />
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/40 backdrop-blur-sm">
                                                    <button
                                                        onClick={() => setEditingMedia(item)}
                                                        className="p-3 rounded-full bg-white text-blue-500 hover:bg-blue-500 hover:text-white transition-colors shadow-xl transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                                                    >
                                                        <Edit className="w-6 h-6" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMedia(item.id)}
                                                        className="p-3 rounded-full bg-white text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shadow-xl transform translate-y-4 group-hover:translate-y-0 duration-300"
                                                    >
                                                        <Trash2 className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="font-bold text-slate-900 leading-tight">{item.title}</h3>
                                                    <span className="text-[10px] font-black uppercase text-slate-400 border border-slate-200 px-2 py-1 rounded-full tracking-wider">
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 line-clamp-2 font-medium">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )
                        }

                        {
                            activeTab === "rsvps" && (
                                <motion.div
                                    key="rsvps"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl overflow-hidden shadow-xl">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                                <tr>
                                                    <th className="p-6 font-black text-slate-900 uppercase tracking-wider text-xs">Pilot Name</th>
                                                    <th className="p-6 font-black text-slate-900 uppercase tracking-wider text-xs">Mission</th>
                                                    <th className="p-6 font-black text-slate-900 uppercase tracking-wider text-xs">Status</th>
                                                    <th className="p-6 font-black text-slate-900 uppercase tracking-wider text-xs">Date</th>
                                                    <th className="p-6 text-right font-black text-slate-900 uppercase tracking-wider text-xs">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {rsvps.map((rsvp) => (
                                                    <tr key={rsvp.id} className="hover:bg-white/50 transition-colors group">
                                                        <td className="p-6">
                                                            <div className="font-bold text-slate-900">{rsvp.user_name || 'Unknown Pilot'}</div>
                                                            <div className="text-xs text-slate-400 font-medium">{rsvp.user_email}</div>
                                                        </td>
                                                        <td className="p-6 font-medium text-slate-600">{rsvp.events?.title || 'Unknown Mission'}</td>
                                                        <td className="p-6">
                                                            <span className={cn(
                                                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                                                                rsvp.status === 'attending' ? "bg-emerald-100 text-emerald-600" :
                                                                    rsvp.status === 'maybe' ? "bg-amber-100 text-amber-600" :
                                                                        "bg-slate-100 text-slate-600"
                                                            )}>
                                                                {rsvp.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-6 font-medium text-slate-600">{new Date(rsvp.created_at).toLocaleDateString()}</td>
                                                        <td className="p-6 text-right">
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => handleDeleteRSVP(rsvp.id)}
                                                                    className="p-2 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-500 transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {rsvps.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="p-12 text-center text-slate-400 font-medium">
                                                            No active rosters found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )
                        }
                    </AnimatePresence >
                </motion.div >
            </div >
        </div >
    );
}
