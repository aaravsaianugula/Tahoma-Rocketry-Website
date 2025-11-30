"use client";

import { useEffect, useRef } from "react";

export const SplashCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const ring = ringRef.current;
        if (!cursor || !ring) return;

        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Instant update for dot
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        };

        window.addEventListener("mousemove", onMouseMove);

        // Physics loop for ring
        const loop = () => {
            // Lerp for smooth following
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
            requestAnimationFrame(loop);
        };
        loop();

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference -ml-1 -mt-1"
            />
            <div
                ref={ringRef}
                className="fixed top-0 left-0 w-8 h-8 border border-white/50 rounded-full pointer-events-none z-[9999] mix-blend-difference -ml-4 -mt-4 transition-opacity duration-300"
            />
        </>
    );
};
