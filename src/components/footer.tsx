"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site-data";
import { Rocket, Mail, MapPin, Phone, ArrowUpRight, Github, Instagram, Twitter } from "lucide-react";
import { RadicalFluidBackground } from "@/components/ui/radical-fluid-background";
import { Marquee } from "@/components/ui/marquee";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { FadeIn } from "@/components/ui/text-animations";
import { LegalModal } from "@/components/legal-modal";

export function Footer() {
    const pathname = usePathname();
    const [privacyOpen, setPrivacyOpen] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);
    const currentYear = new Date().getFullYear();

    if (pathname.startsWith("/dashboard")) return null;

    return (
        <footer className="relative bg-slate-50 overflow-hidden">
            <LegalModal
                isOpen={privacyOpen}
                onClose={() => setPrivacyOpen(false)}
                title="Privacy Protocol"
                type="privacy"
            />
            <LegalModal
                isOpen={termsOpen}
                onClose={() => setTermsOpen(false)}
                title="Terms of Operation"
                type="terms"
            />

            {/* 1. Background: Subtle Radical Fluidity */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <RadicalFluidBackground />
            </div>

            {/* Glass Overlay */}
            <div className="absolute inset-0 z-0 bg-white/40 backdrop-blur-xl pointer-events-none" />

            <div className="relative z-10">
                {/* 2. Kinetic Top - Marquee */}
                <div className="border-b border-slate-900/5 bg-white/30 backdrop-blur-sm py-4">
                    <Marquee className="text-slate-300" repeat={4}>
                        <span className="text-sm font-bold uppercase tracking-[0.3em] mx-8">Ad Astra Per Aspera</span>
                        <span className="text-sm font-bold uppercase tracking-[0.3em] mx-8 text-amber-400">//</span>
                        <span className="text-sm font-bold uppercase tracking-[0.3em] mx-8">Tahoma Rocketry Club</span>
                        <span className="text-sm font-bold uppercase tracking-[0.3em] mx-8 text-amber-400">//</span>
                        <span className="text-sm font-bold uppercase tracking-[0.3em] mx-8">Est. 2024</span>
                        <span className="text-sm font-bold uppercase tracking-[0.3em] mx-8 text-amber-400">//</span>
                    </Marquee>
                </div>

                <div className="container-width pt-20 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
                        {/* Brand Section */}
                        <div className="lg:col-span-5 space-y-8">
                            <FadeIn>
                                <Link href="/" className="inline-flex items-center gap-3 group">
                                    <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-900 transition-colors duration-500">
                                        <Rocket className="w-6 h-6" />
                                    </div>
                                    <span className="text-3xl font-black uppercase tracking-tighter text-slate-900">Tahoma <br /> Rocketry</span>
                                </Link>
                                <p className="text-lg font-medium text-slate-600 max-w-md leading-relaxed mt-6">
                                    Pushing the boundaries of high-power rocketry. Inspiring the next generation of aerospace engineers through hands-on innovation.
                                </p>
                            </FadeIn>
                        </div>

                        {/* Navigation Links */}
                        <div className="lg:col-span-3 lg:col-start-7">
                            <FadeIn delay={0.1}>
                                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-8">Navigation</h4>
                                <ul className="space-y-4">
                                    {[
                                        { name: "Mission Control", href: "/" },
                                        { name: "About Us", href: "/about" },
                                        { name: "Events", href: "/events" },
                                        { name: "Mission Archive", href: "/gallery" },
                                        { name: "Contact", href: "/contact" },
                                    ].map((link) => (
                                        <li key={link.name}>
                                            <Link href={link.href} className="group inline-flex items-center gap-2">
                                                <span className="text-xl font-bold text-slate-900 group-hover:text-amber-500 transition-colors">{link.name}</span>
                                                <ArrowUpRight className="w-4 h-4 text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </FadeIn>
                        </div>

                        {/* Contact & Socials */}
                        <div className="lg:col-span-3">
                            <FadeIn delay={0.2}>
                                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-8">Connect</h4>
                                <ul className="space-y-6 mb-12">
                                    <li className="flex items-start gap-4 group cursor-default">
                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-rose-400 group-hover:text-rose-500 transition-colors">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Base</div>
                                            <div className="font-bold text-slate-900">Tahoma High School<br />Room 119</div>
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-4 group cursor-default">
                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-amber-400 group-hover:text-amber-500 transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Frequency</div>
                                            <a href={`mailto:${siteConfig.contact.email}`} className="font-bold text-slate-900 hover:text-amber-500 transition-colors">
                                                {siteConfig.contact.email}
                                            </a>
                                        </div>
                                    </li>
                                </ul>

                                <div className="flex gap-4">
                                    {[
                                        { icon: Github, href: "#", label: "GitHub" },
                                        { icon: Instagram, href: "#", label: "Instagram" },
                                        { icon: Twitter, href: "#", label: "Twitter" },
                                    ].map((social) => (
                                        <MagneticButton key={social.label}>
                                            <a
                                                href={social.href}
                                                className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
                                                aria-label={social.label}
                                            >
                                                <social.icon className="w-5 h-5" />
                                            </a>
                                        </MagneticButton>
                                    ))}
                                </div>
                            </FadeIn>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-slate-900/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                            &copy; {currentYear} Tahoma Rocketry Club
                        </p>
                        <div className="flex gap-8">
                            <button
                                onClick={() => setPrivacyOpen(true)}
                                className="text-sm font-bold text-slate-400 hover:text-slate-900 uppercase tracking-wider transition-colors"
                            >
                                Privacy
                            </button>
                            <button
                                onClick={() => setTermsOpen(true)}
                                className="text-sm font-bold text-slate-400 hover:text-slate-900 uppercase tracking-wider transition-colors"
                            >
                                Terms
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
