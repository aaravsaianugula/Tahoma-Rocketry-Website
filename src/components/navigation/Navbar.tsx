"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Events", href: "/events" },
  { name: "Projects", href: "/projects" },
  { name: "Team", href: "/team" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass-medium shadow-lg py-3"
            : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group transition-transform hover:scale-105"
            >
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center group-hover:rotate-12 transition-transform">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="font-heading font-bold text-lg text-white leading-none">
                  Tahoma Rocketry
                </div>
                <div className="text-xs text-white/80">Inspire • Build • Launch</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white/90 hover:text-white font-medium transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-space-electric transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden lg:block">
              <Link href="/register">
                <Button variant="gradient" size="lg" className="shadow-lg">
                  Join Now
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-space-darkest/95 backdrop-blur-xl"
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Menu Content */}
        <div className="relative h-full flex flex-col items-center justify-center gap-8 p-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-white text-3xl font-heading font-bold hover:text-space-electric transition-colors animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/register" onClick={() => setIsOpen(false)}>
            <Button
              variant="gradient"
              size="xl"
              className="mt-4 animate-slide-up shadow-2xl"
              style={{ animationDelay: "0.7s" }}
            >
              Join Now
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
