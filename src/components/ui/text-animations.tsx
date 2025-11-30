"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

export const ShinyText = ({ text, disabled = false, speed = 3, className = "" }: { text: string; disabled?: boolean; speed?: number; className?: string }) => {
    const animationDuration = `${speed}s`;

    return (
        <div
            className={`text-[#b5b5b5a4] bg-clip-text inline-block ${disabled ? "" : "animate-shine"} ${className}`}
            style={{
                backgroundImage: "linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                animationDuration: animationDuration,
            }}
        >
            {text}
        </div>
    );
};

export const FadeIn = ({ children, delay = 0, className = "", priority = false }: { children: React.ReactNode; delay?: number; className?: string; priority?: boolean }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
    const [isVisible, setIsVisible] = useState(priority);

    useEffect(() => {
        if (isInView) {
            setIsVisible(true);
        }
    }, [isInView]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1000); // Fallback after 1s to ensure content is never hidden forever
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
