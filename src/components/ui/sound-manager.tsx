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

            // --- PRO FM SYNTHESIS: GLASS BELL ---
            // Carrier: Main tone
            const carrier = ctx.createOscillator();
            const carrierGain = ctx.createGain();

            // Modulator 1: Texture
            const mod1 = ctx.createOscillator();
            const mod1Gain = ctx.createGain();

            // Modulator 2: Metallic Ring
            const mod2 = ctx.createOscillator();
            const mod2Gain = ctx.createGain();

            // Filter: Clean tail
            const filter = ctx.createBiquadFilter();

            // Configuration
            carrier.type = "sine";
            carrier.frequency.setValueAtTime(800, t);
            carrier.frequency.exponentialRampToValueAtTime(0.01, t + 0.5); // Percussive decay

            mod1.type = "sine";
            mod1.frequency.setValueAtTime(1200, t); // 1.5 ratio
            mod1Gain.gain.setValueAtTime(400, t);
            mod1Gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

            mod2.type = "square";
            mod2.frequency.setValueAtTime(400, t); // 0.5 ratio
            mod2Gain.gain.setValueAtTime(200, t);
            mod2Gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

            // Routing: Mod2 -> Mod1 -> Carrier
            mod2.connect(mod2Gain);
            mod2Gain.connect(mod1.frequency);
            mod1.connect(mod1Gain);
            mod1Gain.connect(carrier.frequency);

            // Filter Envelope
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(3000, t);
            filter.frequency.exponentialRampToValueAtTime(100, t + 0.3);

            // Amplitude Envelope
            carrierGain.gain.setValueAtTime(0.4, t);
            carrierGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

            // Connections
            carrier.connect(filter);
            filter.connect(carrierGain);
            carrierGain.connect(ctx.destination);

            // Start/Stop
            carrier.start(t);
            mod1.start(t);
            mod2.start(t);
            carrier.stop(t + 0.5);
            mod1.stop(t + 0.5);
            mod2.stop(t + 0.5);
        };

        const playHover = () => {
            if (isMuted || ctx.state === 'suspended') return;
            const t = ctx.currentTime;

            // --- PRO SUBTRACTIVE: AERO SWISH ---
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            const panner = ctx.createStereoPanner();

            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(100, t); // Low rumble base

            // Filter Sweep (High Pass for "Air")
            filter.type = "highpass";
            filter.frequency.setValueAtTime(800, t);
            filter.frequency.exponentialRampToValueAtTime(4000, t + 0.1);

            // Panning sweep
            panner.pan.setValueAtTime(-0.3, t);
            panner.pan.linearRampToValueAtTime(0.3, t + 0.1);

            // Envelope
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.05, t + 0.02);
            gain.gain.linearRampToValueAtTime(0, t + 0.1);

            osc.connect(filter);
            filter.connect(panner);
            panner.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 0.1);
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
            className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl hover:bg-white/10 transition-all duration-500 group shadow-2xl hover:scale-110"
        >
            {isMuted ? (
                <VolumeX className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            ) : (
                <Volume2 className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            )}
        </button>
    );
};
