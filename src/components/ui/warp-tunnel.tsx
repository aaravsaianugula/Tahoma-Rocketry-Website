"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const WarpTunnel = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const stars: { x: number; y: number; z: number; pz: number }[] = [];
        const numStars = 800;
        const speed = 20;
        let animationFrameId: number;

        // Initialize stars
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: (Math.random() - 0.5) * width,
                y: (Math.random() - 0.5) * height,
                z: Math.random() * width,
                pz: Math.random() * width // Previous z
            });
        }

        const render = () => {
            // Trail effect
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;

            stars.forEach((star) => {
                star.z -= speed;
                if (star.z <= 0) {
                    star.z = width;
                    star.pz = width;
                    star.x = (Math.random() - 0.5) * width;
                    star.y = (Math.random() - 0.5) * height;
                }

                const x = (star.x / star.z) * width + cx;
                const y = (star.y / star.z) * height + cy;

                const px = (star.x / star.pz) * width + cx;
                const py = (star.y / star.pz) * height + cy;

                star.pz = star.z;

                if (x >= 0 && x <= width && y >= 0 && y <= height) {
                    const size = (1 - star.z / width) * 4;
                    const alpha = 1 - star.z / width;

                    // Draw Streak
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = size;
                    ctx.moveTo(px, py);
                    ctx.lineTo(x, y);
                    ctx.stroke();

                    // Draw Head
                    ctx.beginPath();
                    ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`; // Cyan head
                    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <motion.canvas
            ref={canvasRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] pointer-events-none"
        />
    );
};
