"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Camera, Palette, Bell, Shield, ChevronLeft, Save, Loader2,
    Check, Rocket, Star, Zap, Moon, Sun, Sparkles, Heart, Upload, X
} from "lucide-react";
import { FluidGlass } from "@/components/ui/fluid-glass";
import { AppleGlass } from "@/components/ui/apple-glass";
import { cn } from "@/lib/utils";

// Avatar color presets
const AVATAR_COLORS = [
    { name: 'Rocket Red', from: 'from-rose-500', to: 'to-orange-500' },
    { name: 'Cosmic Blue', from: 'from-blue-500', to: 'to-cyan-500' },
    { name: 'Nebula Purple', from: 'from-purple-500', to: 'to-pink-500' },
    { name: 'Aurora Green', from: 'from-emerald-500', to: 'to-teal-500' },
    { name: 'Solar Gold', from: 'from-amber-500', to: 'to-yellow-500' },
    { name: 'Void Black', from: 'from-slate-700', to: 'to-slate-900' },
    { name: 'Plasma Pink', from: 'from-pink-500', to: 'to-rose-500' },
    { name: 'Galaxy Indigo', from: 'from-indigo-500', to: 'to-violet-500' },
];

// Theme options
const THEME_OPTIONS = [
    { id: 'dark', name: 'Mission Control', icon: Moon, description: 'Dark space theme' },
    { id: 'light', name: 'Launch Day', icon: Sun, description: 'Bright and clear' },
    { id: 'auto', name: 'Auto Pilot', icon: Sparkles, description: 'Follow system' },
];

// Pilot titles
const PILOT_TITLES = [
    'Rocket Enthusiast',
    'Launch Director',
    'Payload Specialist',
    'Mission Commander',
    'Flight Engineer',
    'Propulsion Expert',
    'Recovery Specialist',
    'Safety Officer',
];

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications'>('profile');
    const [uploadingPfp, setUploadingPfp] = useState(false);

    // Profile settings
    const [displayName, setDisplayName] = useState('');
    const [pilotTitle, setPilotTitle] = useState('Rocket Enthusiast');
    const [bio, setBio] = useState('');
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedTheme, setSelectedTheme] = useState('dark');
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    // Notification settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [eventReminders, setEventReminders] = useState(true);
    const [launchAlerts, setLaunchAlerts] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);

            // Load saved preferences from user metadata
            const metadata = user.user_metadata || {};
            setDisplayName(metadata.full_name || metadata.name || user.email?.split('@')[0] || '');
            setPilotTitle(metadata.pilot_title || 'Rocket Enthusiast');
            setBio(metadata.bio || '');
            setSelectedColor(metadata.avatar_color || 0);
            setSelectedTheme(metadata.theme || 'dark');
            setProfilePicture(metadata.avatar_url || null);
            setEmailNotifications(metadata.email_notifications !== false);
            setEventReminders(metadata.event_reminders !== false);
            setLaunchAlerts(metadata.launch_alerts !== false);

            setLoading(false);
        };
        fetchUser();
    }, []);

    // Handle profile picture upload
    const handlePfpUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Image must be less than 2MB');
            return;
        }

        setUploadingPfp(true);
        try {
            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                // Fallback to data URL
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const dataUrl = e.target?.result as string;
                    setProfilePicture(dataUrl);
                    await supabase.auth.updateUser({
                        data: { avatar_url: dataUrl }
                    });
                };
                reader.readAsDataURL(file);
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setProfilePicture(publicUrl);

            // Update user metadata
            await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });
        } catch (error) {
            console.error('Failed to upload:', error);
        } finally {
            setUploadingPfp(false);
        }
    };

    // Remove profile picture
    const handleRemovePfp = async () => {
        setProfilePicture(null);
        await supabase.auth.updateUser({
            data: { avatar_url: null }
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: displayName,
                    pilot_title: pilotTitle,
                    bio: bio,
                    avatar_color: selectedColor,
                    theme: selectedTheme,
                    avatar_url: profilePicture,
                    email_notifications: emailNotifications,
                    event_reminders: eventReminders,
                    launch_alerts: launchAlerts,
                }
            });

            if (error) throw error;

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error('Failed to save settings:', error);
        } finally {
            setSaving(false);
        }
    };

    const userName = displayName || user?.email?.split('@')[0] || 'Pilot';
    const userInitial = userName.charAt(0).toUpperCase();
    const currentColor = AVATAR_COLORS[selectedColor];

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Rocket className="w-12 h-12 text-rose-400" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white relative overflow-hidden selection:bg-amber-200 selection:text-slate-900">
            {/* Subtle grid pattern */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <Link
                        href="/dashboard"
                        className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors border-2 border-slate-200"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">SETTINGS</h1>
                        <p className="text-slate-500 text-sm font-medium">Customize your pilot profile</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    {[
                        { id: 'profile', label: 'Profile', icon: User },
                        { id: 'appearance', label: 'Appearance', icon: Palette },
                        { id: 'notifications', label: 'Alerts', icon: Bell },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all border-2",
                                activeTab === tab.id
                                    ? "bg-slate-900 text-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)]"
                                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'profile' && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* Profile Picture Upload */}
                            <FluidGlass className="p-8 rounded-3xl border-2 border-slate-200">
                                <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-wider">Profile Picture</h3>
                                <div className="flex items-center gap-6">
                                    {/* Avatar Preview */}
                                    <div className="relative group">
                                        <div className={cn(
                                            "w-28 h-28 rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-lg overflow-hidden",
                                            !profilePicture && `bg-gradient-to-br ${currentColor.from} ${currentColor.to}`
                                        )}>
                                            {profilePicture ? (
                                                <Image
                                                    src={profilePicture}
                                                    alt={userName}
                                                    width={112}
                                                    height={112}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                userInitial
                                            )}
                                        </div>

                                        {/* Upload overlay */}
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center cursor-pointer"
                                        >
                                            {uploadingPfp ? (
                                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                                            ) : (
                                                <Camera className="w-8 h-8 text-white" />
                                            )}
                                        </button>

                                        {/* Remove button */}
                                        {profilePicture && (
                                            <button
                                                onClick={handleRemovePfp}
                                                className="absolute -top-2 -right-2 w-7 h-7 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600 transition-colors shadow-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-slate-900 font-bold mb-2">Upload a custom profile picture</p>
                                        <p className="text-slate-500 text-sm mb-4">JPG, PNG or GIF. Max 2MB.</p>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploadingPfp}
                                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-sm transition-colors border-2 border-slate-200"
                                        >
                                            {uploadingPfp ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Upload className="w-4 h-4" />
                                            )}
                                            {uploadingPfp ? 'Uploading...' : 'Choose File'}
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePfpUpload}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            </FluidGlass>

                            {/* Avatar Color (for fallback) */}
                            <FluidGlass className="p-8 rounded-3xl border-2 border-slate-200">
                                <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-wider">Avatar Color</h3>
                                <p className="text-slate-500 text-sm mb-6">Used when no profile picture is set</p>
                                <div className="flex flex-wrap gap-3">
                                    {AVATAR_COLORS.map((color, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedColor(i)}
                                            className={cn(
                                                "w-12 h-12 rounded-xl bg-gradient-to-br transition-all flex items-center justify-center text-white font-bold text-lg shadow-md",
                                                color.from, color.to,
                                                selectedColor === i && "ring-4 ring-amber-400 ring-offset-2 scale-110"
                                            )}
                                        >
                                            {selectedColor === i && <Check className="w-5 h-5" />}
                                        </button>
                                    ))}
                                </div>
                            </FluidGlass>

                            {/* Profile Info */}
                            <FluidGlass className="p-8 rounded-3xl border-2 border-slate-200">
                                <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-wider">Pilot Details</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Name</label>
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-rose-400 transition-colors"
                                            placeholder="Enter your callsign"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilot Title</label>
                                        <select
                                            value={pilotTitle}
                                            onChange={(e) => setPilotTitle(e.target.value)}
                                            className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-rose-400 transition-colors appearance-none cursor-pointer"
                                        >
                                            {PILOT_TITLES.map((title) => (
                                                <option key={title} value={title}>{title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bio</label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            rows={3}
                                            className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:border-rose-400 transition-colors resize-none"
                                            placeholder="Tell us about your rocket journey..."
                                        />
                                    </div>
                                </div>
                            </FluidGlass>
                        </motion.div>
                    )}

                    {activeTab === 'appearance' && (
                        <motion.div
                            key="appearance"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <FluidGlass className="p-8 rounded-3xl border-2 border-slate-200">
                                <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-wider">Dashboard Theme</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {THEME_OPTIONS.map((theme) => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setSelectedTheme(theme.id)}
                                            className={cn(
                                                "p-6 rounded-2xl border-2 transition-all text-left",
                                                selectedTheme === theme.id
                                                    ? "bg-amber-50 border-amber-400 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)]"
                                                    : "bg-white border-slate-200 hover:border-slate-300"
                                            )}
                                        >
                                            <theme.icon className={cn(
                                                "w-8 h-8 mb-4",
                                                selectedTheme === theme.id ? "text-amber-500" : "text-slate-400"
                                            )} />
                                            <p className="font-bold text-slate-900 mb-1">{theme.name}</p>
                                            <p className="text-sm text-slate-500">{theme.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </FluidGlass>
                        </motion.div>
                    )}

                    {activeTab === 'notifications' && (
                        <motion.div
                            key="notifications"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <FluidGlass className="p-8 rounded-3xl border-2 border-slate-200">
                                <h3 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-wider">Alert Preferences</h3>
                                <div className="space-y-4">
                                    {[
                                        { id: 'email', label: 'Email Notifications', desc: 'Receive updates via email', value: emailNotifications, setter: setEmailNotifications },
                                        { id: 'events', label: 'Event Reminders', desc: 'Get notified before events', value: eventReminders, setter: setEventReminders },
                                        { id: 'launch', label: 'Launch Alerts', desc: 'Instant notifications for launches', value: launchAlerts, setter: setLaunchAlerts },
                                    ].map((setting) => (
                                        <div key={setting.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
                                            <div>
                                                <p className="font-bold text-slate-900">{setting.label}</p>
                                                <p className="text-sm text-slate-500">{setting.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => setting.setter(!setting.value)}
                                                className={cn(
                                                    "w-14 h-8 rounded-full transition-colors relative",
                                                    setting.value ? "bg-emerald-400" : "bg-slate-300"
                                                )}
                                            >
                                                <div className={cn(
                                                    "absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-md",
                                                    setting.value ? "left-7" : "left-1"
                                                )} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </FluidGlass>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Save Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={cn(
                            "flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white transition-all border-2",
                            saved
                                ? "bg-emerald-400 border-emerald-400"
                                : "bg-slate-900 border-slate-900 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                        )}
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : saved ? (
                            <>
                                <Check className="w-5 h-5" />
                                Saved!
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
