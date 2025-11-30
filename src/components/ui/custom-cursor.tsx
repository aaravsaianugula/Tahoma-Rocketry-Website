"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor = () => {
    const [isVisible, setIsVisible] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
            setIsVisible(true);
        };

        const handleMouseDown = () => {
            document.body.classList.add('cursor-clicking');
        };

        const handleMouseUp = () => {
            document.body.classList.remove('cursor-clicking');
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [cursorX, cursorY]);

    if (!isVisible) return null;

    return (
        <>
            <style jsx global>{`
        body {
            cursor: none;
        }
        a, button, input, textarea {
            cursor: none;
        }
        .cursor-clicking .cursor-ring {
            transform: scale(0.8);
        }
      `}</style>
            <motion.div
                className="cursor-ring fixed top-0 left-0 w-8 h-8 border border-cyan-500 rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            />
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: 12,
                    translateY: 12
                }}
            />
        </>
    );
};
