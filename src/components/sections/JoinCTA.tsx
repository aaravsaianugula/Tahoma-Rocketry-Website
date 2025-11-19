import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import Link from "next/link";

export default function JoinCTA() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-primary"></div>

      {/* Animated background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)",
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-8 animate-bounce">
            <Rocket className="w-10 h-10 text-white" />
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-6 animate-slide-up">
            Ready to Reach New Heights?
          </h2>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Join Tahoma Rocketry Club and turn your aerospace dreams into reality
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link href="/register">
              <Button
                variant="default"
                size="xl"
                className="bg-white text-space-blue hover:bg-gray-100 hover:scale-105 min-w-[200px]"
              >
                Apply Now
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="xl"
                className="bg-transparent text-white border-white/50 hover:bg-white/10 min-w-[200px]"
              >
                Learn More
              </Button>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-white/90 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="text-center">
              <span className="font-bold text-2xl md:text-3xl">50+</span>
              <span className="mx-2">|</span>
              <span className="text-sm md:text-base">Members</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-2xl md:text-3xl">25+</span>
              <span className="mx-2">|</span>
              <span className="text-sm md:text-base">Launches</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-2xl md:text-3xl">5+</span>
              <span className="mx-2">|</span>
              <span className="text-sm md:text-base">Competitions</span>
            </div>
            <div className="text-center">
              <span className="font-bold text-2xl md:text-3xl">100%</span>
              <span className="mx-2">|</span>
              <span className="text-sm md:text-base">Passion</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
