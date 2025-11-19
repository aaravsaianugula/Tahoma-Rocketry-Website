"use client";

import { Button } from "@/components/ui/button";
import { Rocket, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

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
  const scrollToWelcome = () => {
    document.getElementById("welcome")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-space">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-space-blue/20 via-transparent to-transparent"></div>
        {/* Starfield effect */}
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(2px 2px at 20px 30px, white, rgba(0,0,0,0)), radial-gradient(2px 2px at 60px 70px, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 50px 50px, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 130px 80px, white, rgba(0,0,0,0)), radial-gradient(2px 2px at 90px 10px, white, rgba(0,0,0,0))", backgroundSize: "200px 200px", backgroundRepeat: "repeat" }}></div>
      </div>

      {/* 3D Rocket */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Rocket className="w-24 h-24 text-space-blue animate-pulse" />
          </div>
        }>
          <Rocket3D />
        </Suspense>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
          {/* Main headline */}
          <h1 className="text-hero font-heading font-extrabold text-white leading-tight animate-slide-up">
            Inspire, Build, Launch
          </h1>

          {/* Subheadline */}
          <h2 className="text-3xl md:text-4xl font-heading font-semibold text-space-electric animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Tahoma Rocketry Club Experience
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Join us in exploring the exciting world of rocketry.
          </p>

          {/* Live stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto py-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="glass-medium rounded-lg p-4 md:p-6">
              <div className="text-3xl md:text-4xl font-bold text-space-electric">50+</div>
              <div className="text-sm md:text-base text-gray-300">Active Members</div>
            </div>
            <div className="glass-medium rounded-lg p-4 md:p-6">
              <div className="text-3xl md:text-4xl font-bold text-space-electric">25+</div>
              <div className="text-sm md:text-base text-gray-300">Launches</div>
            </div>
            <div className="glass-medium rounded-lg p-4 md:p-6">
              <div className="text-3xl md:text-4xl font-bold text-space-electric">5+</div>
              <div className="text-sm md:text-base text-gray-300">Competitions</div>
            </div>
            <div className="glass-medium rounded-lg p-4 md:p-6">
              <div className="text-3xl md:text-4xl font-bold text-space-electric">100%</div>
              <div className="text-sm md:text-base text-gray-300">Passion</div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Button variant="gradient" size="xl" className="min-w-[200px]">
              Join Our Club
            </Button>
            <Button variant="outline" size="xl" className="min-w-[200px] bg-white/10 text-white border-white/30 hover:bg-white/20">
              View Launches
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToWelcome}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer text-white/80 hover:text-white transition-colors"
          aria-label="Scroll to content"
        >
          <ChevronDown className="w-10 h-10" />
        </button>
      </div>
    </section>
  );
}
