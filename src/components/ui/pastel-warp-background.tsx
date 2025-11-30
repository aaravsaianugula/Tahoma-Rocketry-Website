"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

export const PastelWarpBackground = ({
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
            time += 0.005;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Pastel Club Colors
            // Navy -> Slate-300/400 (#cbd5e1)
            // Gold -> Amber-200 (#fde68a)
            // Red -> Rose-300 (#fda4af)

            const colors = [
                { r: 203, g: 213, b: 225 }, // Slate
                { r: 253, g: 230, b: 138 }, // Amber
                { r: 253, g: 164, b: 175 }, // Rose
            ];

            // OPTIMIZATION: Increased step size to 24 to drastically reduce CPU load
            const step = 24;

            for (let x = 0; x < canvas.width; x += step) {
                for (let y = 0; y < canvas.height; y += step) {
                    // Radical Warp Logic
                    const v =
                        Math.sin(x * 0.01 + time) +
                        Math.sin(y * 0.01 + time) +
                        Math.sin((x + y) * 0.01 + time);

                    // Only draw "waves"
                    if (v > 1.5) {
                        const colorIndex = Math.floor((x / canvas.width) * 3) % 3;
                        const c = colors[colorIndex];
                        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, 0.3)`;
                        ctx.fillRect(x, y, step, step);
                    }
                }
            }

            // Radical Lines
            ctx.lineWidth = 2;
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(253, 230, 138, 0.5)`; // Gold lines
                const y = canvas.height / 2 + Math.sin(time * 2 + i) * 100;
                ctx.moveTo(0, y);
                ctx.bezierCurveTo(
                    canvas.width / 3, y - 200,
                    canvas.width / 3 * 2, y + 200,
                    canvas.width, y
                );
                ctx.stroke();
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
        <div className={cn("relative h-full w-full bg-white overflow-hidden", className)}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 h-full w-full opacity-60"
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
};
