"use client";
import { useEffect, useRef } from "react";

export function BauhausAnimation({ className }: { className?: string }) {
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

        // Bauhaus Shapes
        type Shape =
            | { type: "rect"; x: number; y: number; w: number; h: number; color: string; speed: number }
            | { type: "circle"; x: number; y: number; r: number; color: string; speed: number }
            | { type: "line"; x1: number; y1: number; x2: number; y2: number; color: string; speed: number };

        const shapes: Shape[] = [
            { type: "rect", x: 0.1, y: 0.1, w: 0.3, h: 0.4, color: "#f1f5f9", speed: 0.0005 }, // Slate-100
            { type: "circle", x: 0.6, y: 0.3, r: 0.15, color: "#e2e8f0", speed: -0.0003 }, // Slate-200
            { type: "rect", x: 0.5, y: 0.6, w: 0.4, h: 0.1, color: "#f8fafc", speed: 0.0007 }, // Slate-50
            { type: "circle", x: 0.2, y: 0.7, r: 0.1, color: "#f1f5f9", speed: 0.0004 },
            { type: "line", x1: 0, y1: 0.5, x2: 1, y2: 0.5, color: "#cbd5e1", speed: 0 }, // Slate-300
        ];

        const render = () => {
            time += 1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            shapes.forEach((shape, i) => {
                ctx.fillStyle = shape.color;
                ctx.strokeStyle = shape.color;

                // Movement
                const movement = Math.sin(time * shape.speed + i) * 50;

                if (shape.type === "rect") {
                    ctx.fillRect(
                        shape.x * canvas.width + movement,
                        shape.y * canvas.height,
                        shape.w * canvas.width,
                        shape.h * canvas.height
                    );
                } else if (shape.type === "circle") {
                    ctx.beginPath();
                    ctx.arc(
                        shape.x * canvas.width,
                        shape.y * canvas.height + movement,
                        shape.r * canvas.width,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                } else if (shape.type === "line") {
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.moveTo(shape.x1 * canvas.width, shape.y1 * canvas.height);
                    ctx.lineTo(shape.x2 * canvas.width, shape.y2 * canvas.height);
                    ctx.stroke();
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full ${className}`} />;
}
