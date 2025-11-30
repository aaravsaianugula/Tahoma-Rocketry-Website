"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Star {
    x: number;
    y: number;
    z: number;
    size: number;
}

export const Starfield = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const setSize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        setSize();
        window.addEventListener("resize", setSize);

        // Initialize stars
        const stars: Star[] = Array.from({ length: 800 }, () => ({
            x: Math.random() * width - width / 2,
            y: Math.random() * height - height / 2,
            z: Math.random() * 2000,
            size: Math.random() * 2,
        }));

        let animationFrameId: number;

        const render = () => {
            ctx.fillStyle = "#0A0E27"; // Match bg-space
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;

            stars.forEach((star) => {
                // Move star closer
                star.z -= 2; // Speed

                // Reset star if it passes camera
                if (star.z <= 0) {
                    star.x = Math.random() * width - width / 2;
                    star.y = Math.random() * height - height / 2;
                    star.z = 2000;
                }

                // Project 3D coordinates to 2D
                const scale = 1000 / star.z;
                const x2d = star.x * scale + cx;
                const y2d = star.y * scale + cy;

                if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
                    const size = star.size * scale;
                    const alpha = Math.min(1, (2000 - star.z) / 1000);

                    ctx.beginPath();
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.arc(x2d, y2d, size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", setSize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.canvas
                ref={canvasRef}
                style={{ y, opacity }}
                className="absolute inset-0 w-full h-full"
            />
            {/* Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0E27]/50 to-[#0A0E27] z-10" />
        </div>
    );
};
