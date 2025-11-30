'use client';

import { useEffect, useRef } from 'react';

export default function GalaxyBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width: number, height: number;
        let stars: { x: number; y: number; size: number; opacity: number; speed: number }[] = [];
        let animationFrameId: number;

        // Configuration
        const STAR_COUNT = 150;
        const STAR_SPEED = 0.05;

        const initStars = () => {
            stars = [];
            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 1.5,
                    opacity: Math.random(),
                    speed: (Math.random() * 0.5 + 0.1) * STAR_SPEED
                });
            }
        };

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initStars();
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw Gradient Background (Deep Space)
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#020a1a');
            gradient.addColorStop(1, '#051837');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Draw Stars
            ctx.fillStyle = 'white';
            stars.forEach(star => {
                ctx.globalAlpha = star.opacity;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();

                // Move Star
                star.y -= star.speed;
                if (star.y < 0) {
                    star.y = height;
                    star.x = Math.random() * width;
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas id="galaxy-bg" ref={canvasRef} />;
}
