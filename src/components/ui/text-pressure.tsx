"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TextPressureProps {
    text: string;
    fontFamily?: string;
    fontUrl?: string;
    width?: boolean;
    weight?: boolean;
    italic?: boolean;
    alpha?: boolean;
    flex?: boolean;
    stroke?: boolean;
    scale?: boolean;
    textColor?: string;
    strokeColor?: string;
    className?: string;
    minFontSize?: number;
}

export function TextPressure({
    text,
    fontFamily = "Inter",
    fontUrl,
    width = true,
    weight = true,
    italic = true,
    alpha = false,
    flex = true,
    stroke = false,
    scale = false,
    textColor = "#000000",
    strokeColor = "#000000",
    className,
    minFontSize = 24,
}: TextPressureProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const spansRef = useRef<(HTMLSpanElement | null)[]>([]);

    const mouseRef = useRef({ x: 0, y: 0 });
    const cursorRef = useRef({ x: 0, y: 0 });

    const [fontSize, setFontSize] = useState(minFontSize);
    const [scaleY, setScaleY] = useState(1);
    const [lineHeight, setLineHeight] = useState(1);

    const chars = text.split("");

    const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            cursorRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useEffect(() => {
        if (containerRef.current && scale) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            const newFontSize = Math.max(minFontSize, Math.min(width / chars.length, height));
            setFontSize(newFontSize);
            setScaleY(1);
            setLineHeight(1);
        }
    }, [scale, minFontSize, chars.length]);

    useEffect(() => {
        let rafId: number;
        const animate = () => {
            mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) * 0.1;
            mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) * 0.1;

            if (titleRef.current) {
                const titleRect = titleRef.current.getBoundingClientRect();
                const maxDist = titleRect.width / 2;

                spansRef.current.forEach((span) => {
                    if (!span) return;
                    const rect = span.getBoundingClientRect();
                    const charCenter = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                    };

                    const d = dist(mouseRef.current, charCenter);
                    const getAttr = (distance: number, minVal: number, maxVal: number) => {
                        const val = maxVal - Math.abs((maxVal * distance) / maxDist);
                        return Math.max(minVal, val + minVal);
                    };

                    const wdth = width ? Math.floor(getAttr(d, 50, 200)) : 100;
                    const wght = weight ? Math.floor(getAttr(d, 100, 900)) : 400;
                    const ital = italic ? getAttr(d, 0, 1).toFixed(2) : 0;
                    const alph = alpha ? getAttr(d, 0, 1).toFixed(2) : 1;

                    span.style.opacity = alph.toString();
                    span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${ital}`;
                });
            }

            rafId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(rafId);
    }, [width, weight, italic, alpha, chars.length]);

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full h-full", className)}
        >
            <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
        }
      `}</style>
            <h1
                ref={titleRef}
                className={cn(
                    "flex justify-between items-center w-full h-full",
                    flex ? "flex-row" : "flex-col",
                    stroke ? "text-transparent stroke-2" : ""
                )}
                style={{
                    fontFamily,
                    fontSize,
                    lineHeight,
                    transform: `scaleY(${scaleY})`,
                    color: stroke ? "transparent" : textColor,
                    WebkitTextStroke: stroke ? `2px ${strokeColor}` : undefined,
                }}
            >
                {chars.map((char, i) => (
                    <span
                        key={i}
                        ref={(el) => { spansRef.current[i] = el; }}
                        className="inline-block"
                    >
                        {char}
                    </span>
                ))}
            </h1>
        </div>
    );
}
