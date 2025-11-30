"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface BeamsBackgroundProps {
    className?: string;
    intensity?: "subtle" | "medium" | "strong";
}

export function BeamsBackground({ className, intensity = "subtle" }: BeamsBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let beams: Beam[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initBeams();
        };

        class Beam {
            x: number;
            y: number;
            width: number;
            speed: number;
            opacity: number;
            angle: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = -100;
                this.width = Math.random() * 100 + 50;
                this.speed = Math.random() * 0.2 + 0.05; // Very slow
                this.opacity = Math.random() * 0.05 + 0.01; // Very low opacity
                this.angle = Math.random() * 0.2 - 0.1; // Slight angle
            }

            update() {
                this.y += this.speed;
                this.x += Math.sin(this.y * 0.002) * 0.5;

                if (this.y > canvas!.height + 100) {
                    this.y = -100;
                    this.x = Math.random() * canvas!.width;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);

                // Gold/Amber tint for the beams
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas!.height / 2);
                gradient.addColorStop(0, `rgba(212, 175, 55, 0)`);
                gradient.addColorStop(0.5, `rgba(212, 175, 55, ${this.opacity})`);
                gradient.addColorStop(1, `rgba(212, 175, 55, 0)`);

                ctx.fillStyle = gradient;
                ctx.fillRect(-this.width / 2, 0, this.width, canvas!.height);
                ctx.restore();
            }
        }

        const initBeams = () => {
            beams = [];
            const count = Math.floor(window.innerWidth / 100);
            for (let i = 0; i < count; i++) {
                beams.push(new Beam());
                // Randomize starting positions
                beams[i].y = Math.random() * canvas.height;
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            beams.forEach(beam => {
                beam.update();
                beam.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resize);
        resize();
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={cn("absolute inset-0 w-full h-full pointer-events-none mix-blend-screen", className)}
        />
    );
}
