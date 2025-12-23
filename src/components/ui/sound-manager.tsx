"use client";

import { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

export const SoundManager = () => {
    const [isMuted, setIsMuted] = useState(true);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        const playClick = () => {
            if (isMuted || ctx.state === 'suspended') return;
            const t = ctx.currentTime;

            // --- ETHEREAL CLICK: CRYSTAL DROP ---
            // A pure, glass-like tone inspired by magical UI interactions (Frieren)

            // Oscillator 1: The 'Body' (Sine for purity)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();

            // Oscillator 2: The 'Shimmer' (Higher harmonic)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();

            // Configuration
            osc1.type = "sine";
            // Start high and drop slightly for 'impact' feel (800Hz -> 600Hz)
            osc1.frequency.setValueAtTime(800, t);
            osc1.frequency.exponentialRampToValueAtTime(600, t + 0.1);

            osc2.type = "sine";
            // Perfect 5th harmonic for musicality
            osc2.frequency.setValueAtTime(1200, t);
            osc2.frequency.exponentialRampToValueAtTime(900, t + 0.1);

            // Envelopes (Percussive but soft)
            gain1.gain.setValueAtTime(0, t);
            gain1.gain.linearRampToValueAtTime(0.3, t + 0.01); // Soft attack
            gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.3); // Crystal decay

            gain2.gain.setValueAtTime(0, t);
            gain2.gain.linearRampToValueAtTime(0.1, t + 0.01);
            gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.15); // Faster shimmer decay

            // Filters for warmth
            const filter = ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(2000, t);

            // Connections
            osc1.connect(gain1);
            osc2.connect(gain2);
            gain1.connect(filter);
            gain2.connect(filter);
            filter.connect(ctx.destination);

            // Play
            osc1.start(t);
            osc2.start(t);
            osc1.stop(t + 0.3);
            osc2.stop(t + 0.3);
        };

        const playHover = () => {
            if (isMuted || ctx.state === 'suspended') return;
            const t = ctx.currentTime;

            // --- MAGICAL WHISPER: AIRY RESONANCE ---
            // A very subtle high-frequency swell, like calm wind or magic detection

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const panner = ctx.createStereoPanner();

            osc.type = "triangle"; // Slightly richer than sine, but soft
            osc.frequency.setValueAtTime(1200, t);

            // Subtle pitch drift for 'organic' feel
            osc.frequency.linearRampToValueAtTime(1250, t + 0.1);

            // Panning for movement (Left -> Center -> Right)
            // Randomize start pan slightly
            const startPan = Math.random() * 0.4 - 0.2;
            panner.pan.setValueAtTime(startPan, t);
            panner.pan.linearRampToValueAtTime(0, t + 0.1);

            // Soft Envelope
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.05, t + 0.02); // Very quiet
            gain.gain.linearRampToValueAtTime(0, t + 0.1);

            osc.connect(panner);
            panner.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 0.2);
        };

        const handleClick = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('button, a, .interactive')) {
                if (ctx.state === 'suspended') ctx.resume();
                playClick();
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('button, a, .interactive')) {
                playHover();
            }
        };

        window.addEventListener("click", handleClick);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("click", handleClick);
            window.removeEventListener("mouseover", handleMouseOver);
            ctx.close();
        };
    }, [isMuted]);

    return (
        <button
            onClick={() => setIsMuted(!isMuted)}
            className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-300 group"
        >
            {isMuted ? (
                <VolumeX className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
            ) : (
                <Volume2 className="w-5 h-5 text-slate-900 group-hover:text-rose-600 transition-colors" />
            )}
        </button>
    );
};
