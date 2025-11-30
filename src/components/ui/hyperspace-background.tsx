"use client";

import { useEffect, useRef } from 'react';

export function HyperspaceBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        // Set canvas size
        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', resize);
        resize();

        // Star properties
        const stars: { x: number; y: number; z: number; pz: number }[] = [];
        const numStars = 800;
        const speed = 25; // Warp speed

        // Initialize stars
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width - width / 2,
                y: Math.random() * height - height / 2,
                z: Math.random() * width,
                pz: 0 // Previous Z
            });
            stars[i].pz = stars[i].z;
        }

        const animate = () => {
            // Clear with trail effect
            ctx.fillStyle = 'rgba(2, 4, 16, 0.4)'; // Dark background with trail
            ctx.fillRect(0, 0, width, height);

            const cx = width / 2;
            const cy = height / 2;

            stars.forEach(star => {
                // Move star closer
                star.z -= speed;

                // Reset star if it passes camera
                if (star.z <= 0) {
                    star.z = width;
                    star.pz = width;
                    star.x = Math.random() * width - width / 2;
                    star.y = Math.random() * height - height / 2;
                }

                // Project star position
                const x = cx + (star.x / star.z) * width;
                const y = cy + (star.y / star.z) * height;

                // Project previous position (for trail)
                const px = cx + (star.x / star.pz) * width;
                const py = cy + (star.y / star.pz) * height;

                // Update previous Z
                star.pz = star.z;

                // Draw star trail
                const s = (1 - star.z / width); // Size/Opacity based on distance
                const size = s * 4;

                ctx.beginPath();
                ctx.strokeStyle = `rgba(245, 158, 11, ${s})`; // Amber color
                ctx.lineWidth = size;
                ctx.moveTo(px, py);
                ctx.lineTo(x, y);
                ctx.stroke();

                // Draw star head
                ctx.beginPath();
                ctx.fillStyle = `rgba(255, 255, 255, ${s})`;
                ctx.arc(x, y, size / 2, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        const animId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 w-full h-full bg-[#020410]"
        />
    );
}
