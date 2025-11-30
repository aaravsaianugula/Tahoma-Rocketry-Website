"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

export const RadicalFluidBackground = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let time = 0;
        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resize);
        resize();

        const render = () => {
            time += 0.005; // Slowed down for "Flow"
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Soft Radical Palette (Pastels)
            // Amber-200 (#fde68a)
            // Rose-200 (#fecdd3)
            // Sky-200 (#bae6fd)
            const colors = [
                { r: 253, g: 230, b: 138 }, // Soft Amber
                { r: 254, g: 205, b: 211 }, // Soft Rose
                { r: 186, g: 230, b: 253 }, // Soft Sky
            ];

            const step = 20;

            for (let x = 0; x < canvas.width; x += step) {
                for (let y = 0; y < canvas.height; y += step) {
                    // Smoother Wave Logic
                    const v =
                        Math.sin(x * 0.01 + time) +
                        Math.sin(y * 0.01 + time) +
                        Math.sin((x + y) * 0.01 + time * 0.5);

                    if (v > 1.0) {
                        const colorIndex = Math.floor((x / canvas.width) * 3 + (y / canvas.height) * 2 + time) % 3;
                        const c = colors[colorIndex];
                        // Much lower opacity for "Airy" feel
                        const alpha = (v - 1.0) * 0.1; 
                        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
                        ctx.fillRect(x, y, step, step);
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className={cn("relative h-full w-full bg-[#FDFBF7] overflow-hidden", className)}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 h-full w-full opacity-100 mix-blend-multiply"
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
};
