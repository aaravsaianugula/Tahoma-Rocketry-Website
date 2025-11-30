"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface GridMotionProps {
    items?: string[];
    gradientColor?: string;
}

export function GridMotion({
    items = ["ROCKETRY", "ENGINEERING", "PHYSICS", "LAUNCH", "ORBIT", "THRUST", "APOGEE", "PAYLOAD", "TELEMETRY", "AVIONICS", "RECOVERY", "PROPULSION"],
    gradientColor = "black"
}: GridMotionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!gridRef.current) return;

        const totalItems = 28;
        // Create grid items
        const gridContent = Array.from({ length: totalItems }, (_, i) => {
            const item = document.createElement('div');
            item.className = 'grid-item relative w-full h-full overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center';

            const text = document.createElement('span');
            text.className = 'text-slate-700 font-black text-2xl uppercase opacity-20 select-none';
            text.innerText = items[i % items.length];
            item.appendChild(text);

            return item;
        });

        gridRef.current.innerHTML = '';
        gridContent.forEach(item => gridRef.current?.appendChild(item));

        // Animation
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const moveX = (clientX - centerX) / centerX;
            const moveY = (clientY - centerY) / centerY;

            gsap.to(gridRef.current, {
                x: -moveX * 50,
                y: -moveY * 50,
                rotationX: moveY * 10,
                rotationY: -moveX * 10,
                duration: 1,
                ease: 'power2.out'
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [items]);

    return (
        <div ref={sectionRef} className="absolute inset-0 z-0 overflow-hidden perspective-1000">
            <div
                ref={gridRef}
                className="w-[120%] h-[120%] -ml-[10%] -mt-[10%] grid grid-cols-4 gap-4 transform-style-3d"
            />
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-${gradientColor} pointer-events-none`} />
        </div>
    );
}
