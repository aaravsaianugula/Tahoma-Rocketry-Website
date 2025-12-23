"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Star {
    x: number;
    y: number;
    z: number;
    size: number;
    opacity: number;
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

        const ctx = canvas.getContext("2d", { alpha: false }); // Optimization: alpha false if we draw background
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const setSize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            // 2x-3x resolution scale for sharp rendering on retina, 
            // but for performance we might stick to 1x or 1.5x on weak devices if needed.
            // Keeping raw pixel 1:1 for Speed.
            canvas.width = width;
            canvas.height = height;
        };

        setSize();
        const resizeObserver = new ResizeObserver(() => setSize());
        resizeObserver.observe(document.body);

        // Optimization: Reduce count from 800 -> 400
        const STAR_COUNT = 400;

        const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
            x: Math.random() * width - width / 2,
            y: Math.random() * height - height / 2,
            z: Math.random() * 2000,
            size: Math.random() * 1.5 + 0.5, // slightly smaller stars
            opacity: Math.random(),
        }));

        let animationFrameId: number;
        let prevTime = 0;

        const render = (time: number) => {
            // Delta time for consistent speed
            const dt = (time - prevTime) / 16.67;
            prevTime = time;

            // Clear once
            ctx.fillStyle = "#0A0E27";
            ctx.fillRect(0, 0, width, height);

            // Set base star color once
            ctx.fillStyle = "#FFFFFF";

            const cx = width / 2;
            const cy = height / 2;

            // Single loop
            for (let i = 0; i < STAR_COUNT; i++) {
                const star = stars[i];

                // Move star
                star.z -= 2 * (dt || 1);

                // Reset
                if (star.z <= 1) {
                    star.z = 2000;
                    star.x = Math.random() * width - width / 2;
                    star.y = Math.random() * height - height / 2;
                    star.opacity = Math.random();
                }

                // Projection
                const scale = 1000 / star.z;
                const x2d = star.x * scale + cx;
                const y2d = star.y * scale + cy;

                if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
                    // Optimization: fillRect is faster than arc
                    const size = star.size * scale;
                    const brightness = Math.min(1, (2000 - star.z) / 1000) * star.opacity;

                    // Only draw if visible enough
                    if (brightness > 0.05) {
                        ctx.globalAlpha = brightness;
                        ctx.fillRect(x2d, y2d, size, size);
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            resizeObserver.disconnect();
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
