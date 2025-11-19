"use client";

import { Button } from "@/components/ui/button";
import { Rocket, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

// Dynamically import 3D component to avoid SSR issues
const Rocket3D = dynamic(() => import("@/components/3d/Rocket3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <Rocket className="w-24 h-24 text-space-blue animate-pulse" />
    </div>
  ),
});

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToWelcome = () => {
    document.getElementById("welcome")?.scrollIntoView({ behavior: "smooth" });
  };

  // Parallax effect - content moves slower than scroll
  const parallaxOffset = scrollY * 0.5;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-space">
      {/* Animated background with parallax */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-space-blue/20 via-transparent to-transparent"></div>

        {/* Enhanced starfield with multiple layers */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(2px 2px at 20px 30px, white, rgba(0,0,0,0)), radial-gradient(2px 2px at 60px 70px, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 50px, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 130px 80px, white, rgba(0,0,0,0)), radial-gradient(2px 2px at 90px 10px, white, rgba(0,0,0,0))",
            backgroundSize: "200px 200px",
            backgroundRepeat: "repeat",
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        ></div>

        {/* Additional animated gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-space-electric/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-rocket-red/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* 3D Rocket with reduced parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }}
      >
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <Rocket className="w-24 h-24 text-space-blue animate-pulse" />
            </div>
          }
        >
          <Rocket3D />
        </Suspense>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Main headline with text gradient */}
          <h1 className="text-hero font-heading font-extrabold leading-tight animate-slide-up">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-space-electric to-white">
              Inspire, Build, Launch
            </span>
          </h1>

          {/* Subheadline with glow effect */}
          <h2
            className="text-3xl md:text-4xl font-heading font-semibold text-space-electric drop-shadow-[0_0_20px_rgba(0,217,255,0.5)] animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Tahoma Rocketry Club Experience
          </h2>

          {/* Description */}
          <p
            className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Join us in exploring the exciting world of rocketry.
          </p>

          {/* Live stats with enhanced glassmorphism */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto py-8 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            {[
              { value: "50+", label: "Active Members" },
              { value: "25+", label: "Launches" },
              { value: "5+", label: "Competitions" },
              { value: "100%", label: "Passion" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="glass-medium rounded-xl p-4 md:p-6 group hover:scale-105 transition-all duration-300 hover:bg-white/20 cursor-pointer"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-space-electric to-white group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-300 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA buttons with enhanced effects */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up"
            style={{ animationDelay: "0.7s" }}
          >
            <Link href="/register">
              <Button
                variant="gradient"
                size="xl"
                className="min-w-[200px] shadow-2xl hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all"
              >
                Join Our Club
              </Button>
            </Link>
            <Link href="/events">
              <Button
                variant="outline"
                size="xl"
                className="min-w-[200px] bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
              >
                View Events
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator with enhanced animation */}
        <button
          onClick={scrollToWelcome}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer text-white/80 hover:text-white transition-all group"
          aria-label="Scroll to content"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Scroll to explore</span>
            <ChevronDown className="w-10 h-10 animate-bounce group-hover:scale-110 transition-transform" />
          </div>
        </button>
      </div>
    </section>
  );
}
