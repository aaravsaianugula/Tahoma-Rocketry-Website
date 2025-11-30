"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface HexagonGridProps {
    color?: string;
    size?: number;
    duration?: number;
    className?: string;
}

export const HexagonGrid = ({
    color = "#f59e0b",
    size = 40,
    duration = 4,
    className,
}: HexagonGridProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resize);
        resize();

        const drawHexagon = (x: number, y: number, r: number) => {
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                ctx.lineTo(
                    x + r * Math.cos((Math.PI / 3) * i),
                    y + r * Math.sin((Math.PI / 3) * i)
                );
            }
            ctx.closePath();
            ctx.stroke();
        };

        const animate = () => {
            time += 0.005;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 1;

            const a = (2 * Math.PI) / 6;
            const r = size;
            const w = 2 * r * Math.sin(Math.PI / 3); // Width of hex
            const h = 1.5 * r; // Vertical distance between centers

            const cols = Math.ceil(canvas.width / w) + 2;
            const rows = Math.ceil(canvas.height / h) + 2;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * w + (j % 2) * (w / 2);
                    const y = j * h;

                    // Calculate distance from mouse or center for wave effect
                    const dx = x - canvas.width / 2;
                    const dy = y - canvas.height / 2;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Dynamic opacity based on wave
                    const opacity = (Math.sin(dist * 0.005 - time * 2) + 1) / 2 * 0.3;

                    ctx.strokeStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
                    drawHexagon(x, y, r);
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [color, size]);

    return (
        <canvas
            ref={canvasRef}
            className={cn("fixed inset-0 z-0 pointer-events-none", className)}
        />
    );
};
