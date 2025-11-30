"use client";

import { useSpring, animated } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";

interface SplitTextProps {
    text: string;
    className?: string;
    delay?: number;
}

export const SplitText = ({ text, className = "", delay = 100 }: SplitTextProps) => {
    const words = text.split(" ");
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: "-50px" }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`inline-block overflow-hidden ${className}`}>
            {words.map((word, i) => (
                <span key={i} className="inline-block mr-[0.3em] whitespace-nowrap">
                    {word.split("").map((char, j) => (
                        <AnimatedChar
                            key={j}
                            char={char}
                            delay={delay + i * 100 + j * 30}
                            inView={inView}
                        />
                    ))}
                </span>
            ))}
        </div>
    );
};

const AnimatedChar = ({ char, delay, inView }: { char: string; delay: number; inView: boolean }) => {
    const springs = useSpring({
        from: { opacity: 0, transform: "translate3d(0, 40px, 0)" },
        to: inView
            ? { opacity: 1, transform: "translate3d(0, 0, 0)" }
            : { opacity: 0, transform: "translate3d(0, 40px, 0)" },
        delay,
        config: { mass: 1, tension: 280, friction: 60 },
    });

    return (
        <animated.span style={springs} className="inline-block">
            {char}
        </animated.span>
    );
};
