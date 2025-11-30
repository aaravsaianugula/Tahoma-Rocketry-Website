"use client";

import Link from "next/link";
import { NeoBrutalistCard } from "@/components/ui/cards";
import { FadeIn } from "@/components/ui/text-animations";
import { SplitText } from "@/components/ui/split-text";
import { SplashCursor } from "@/components/ui/splash-cursor";
import { EVENTS, LEADERSHIP, HERO_CONTENT, MISSION_CARD_CONTENT } from "@/data/site-data";
import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { VelocityScroll } from "@/components/ui/velocity-scroll";
import { GlitchText } from "@/components/ui/glitch-text";
import { HoverReveal } from "@/components/ui/hover-reveal";
import { SquaresBackground } from "@/components/ui/squares-background";
import { motion, Variants } from "framer-motion";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ShinyText } from "@/components/ui/shiny-text";
import { TextPressure } from "@/components/ui/text-pressure";
import { PastelWarpBackground } from "@/components/ui/pastel-warp-background";
import { AppleGlass } from "@/components/ui/apple-glass";
import { FluidGlass } from "@/components/ui/fluid-glass";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { TrueFocus } from "@/components/ui/true-focus";
import { Home as HomeIcon, Rocket, Users, Calendar, Image as ImageIcon, Mail, Wrench, Star } from "lucide-react";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function Home() {
  const [nextLaunch, setNextLaunch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fundraiser = EVENTS.find(e => e.type === "fundraiser");

  useEffect(() => {
    const fetchNextLaunch = async () => {
      const supabase = createClient();

      // 1. Try to find the next UPCOMING launch
      const { data: futureData, error: futureError } = await supabase
        .from('events')
        .select('*')
        .eq('type', 'launch')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(1)
        .single();

      if (futureData) {
        setNextLaunch(futureData);
      } else {
        // 2. Fallback: Find the MOST RECENT launch (even if past)
        // This ensures the section doesn't disappear if there are no future events
        const { data: latestData, error: latestError } = await supabase
          .from('events')
          .select('*')
          .eq('type', 'launch')
          .order('date', { ascending: false })
          .limit(1)
          .single();

        if (latestData) {
          setNextLaunch(latestData);
        }
      }
      setLoading(false);
    };

    fetchNextLaunch();
  }, []);

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "circOut"
      }
    }
  };

  return (
    <div className="min-h-screen relative bg-white text-slate-900 font-sans selection:bg-amber-200 selection:text-slate-900 overflow-x-hidden">
      {/* <SplashCursor /> - Disabled for performance */}

      {/* Radical Pastel Warp Background */}
      {/* Radical Pastel Warp Background - REMOVED per user feedback */}
      {/* <div className="fixed inset-0 z-0">
        <PastelWarpBackground className="h-full" />
      </div> */}

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden pt-20">
          <div className="container-width">
            <div className="relative z-10">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 mb-8 shadow-lg"
              >
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                <span className="text-sm font-bold tracking-widest text-slate-700 uppercase">
                  EST. 2023
                </span>
              </motion.div>

              {/* Massive Deconstructed Title */}
              <div className="relative z-10">
                <div className="flex flex-col leading-[0.85] select-none mix-blend-multiply">
                  <SplitText
                    text={HERO_CONTENT.title.line1}
                    className="text-[clamp(80px,15vw,220px)] font-black text-slate-900 tracking-tighter uppercase"
                    delay={0}
                  />
                  <div className="pl-[10vw]">
                    <SplitText
                      text={HERO_CONTENT.title.line2}
                      className="text-[clamp(80px,15vw,220px)] font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-800 to-slate-400 tracking-tighter uppercase"
                      delay={100}
                    />
                  </div>
                  <div className="pl-[5vw]">
                    <TextPressure
                      text={HERO_CONTENT.title.line3}
                      flex={true}
                      alpha={false}
                      stroke={false}
                      width={false}
                      weight={true}
                      italic={true}
                      textColor="#f59e0b"
                      minFontSize={100}
                    />
                  </div>
                </div>
              </div>

              {/* Floating Image Element */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                animate={{ opacity: 1, scale: 1, rotate: 5 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute top-[5%] right-[2%] w-[clamp(300px,30vw,600px)] h-[clamp(400px,40vw,800px)] border-4 border-white/80 shadow-[8px_8px_0px_0px_rgba(253,230,138,1)] bg-white/50 backdrop-blur-sm overflow-hidden hidden lg:block rounded-3xl z-0"
              >
                <Image
                  src="/assets/rocket-launch.jpg"
                  alt="Rocket Launch"
                  fill
                  className="object-cover transition-all duration-500"
                />
              </motion.div>

              {/* Description & CTA */}
              <FluidGlass className="max-w-2xl mt-12 p-8 rounded-2xl border-2 border-white/60 bg-white/40 backdrop-blur-xl shadow-2xl">
                <p className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-tight">
                  {HERO_CONTENT.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Link href="/contact">
                    <MagneticButton className="group relative px-8 py-4 bg-slate-900 text-white font-black text-lg uppercase tracking-wider border-2 border-slate-900 hover:bg-rose-400 hover:border-rose-400 hover:text-white transition-colors text-center w-full sm:w-auto rounded-xl shadow-lg">
                      <GlitchText text="JOIN MISSION" />
                    </MagneticButton>
                  </Link>
                  <div className="hidden sm:block">
                    <Link href="/events">
                      <MagneticButton className="px-6 py-4 rounded-xl border-2 border-slate-900 bg-amber-300 text-slate-900 font-black text-lg uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                        <GlitchText text="LAUNCH SCHEDULE" />
                      </MagneticButton>
                    </Link>
                  </div>
                </div>
              </FluidGlass>
            </div>
          </div>
        </section>

        {/* Marquee Separator */}
        <div className="py-12 border-y-2 border-slate-900 bg-amber-200/90 backdrop-blur-sm overflow-hidden rotate-1 scale-105 transform origin-left">
          <Marquee className="text-slate-900 font-black text-4xl uppercase tracking-tighter" repeat={10}>
            <span className="mx-8">BUILD ROCKETS</span>
            <Star className="w-8 h-8 fill-slate-900" />
            <span className="mx-8">BREAK BARRIERS</span>
            <Star className="w-8 h-8 fill-slate-900" />
            <span className="mx-8">LAUNCH FUTURES</span>
            <Star className="w-8 h-8 fill-slate-900" />
          </Marquee>
        </div>

        {/* Welcome Section with Bento Grid */}
        <section className="py-20 relative z-10">
          <div className="container-width">
            <div className="grid md:grid-cols-2 gap-20 items-start mb-16">
              <div className="sticky top-32 h-fit">
                <h2 className="text-6xl md:text-8xl font-black mb-8 text-slate-900 tracking-tighter uppercase leading-[0.9]">
                  <ShinyText text="NOT YOUR" speed={3} /> <br />
                  <span className="text-rose-400">AVERAGE</span> <br />
                  CLUB.
                </h2>
                <FluidGlass className="p-6 rounded-xl border-l-4 border-rose-400 bg-white/40 backdrop-blur-md shadow-lg">
                  <p className="text-xl font-medium text-slate-700 leading-relaxed">
                    We don't just talk about space. We build the vehicles to get there.
                    Real engineering. Real physics. Real fire.
                  </p>
                </FluidGlass>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="mt-0"
              >
                <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
                  <BentoGridItem
                    title={<span className="text-slate-900 font-black text-xl">Hands-on Building</span>}
                    description="Design and construct real rockets using advanced materials and techniques. Carbon fiber, fiberglass, and epoxy are our daily tools."
                    header={
                      <div className="relative w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
                        <Image
                          src="/assets/bento/hands-on-v2.png"
                          alt="Hands-on Building"
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />


                        <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
                      </div>
                    }
                    icon={<Rocket className="h-4 w-4 text-rose-500" />}
                    className="md:col-span-2"
                  />
                  <BentoGridItem
                    title={<span className="text-slate-900 font-black text-xl">STEM Skills</span>}
                    description="Learn CAD, electronics, physics, and project management."
                    header={
                      <div className="relative w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
                        <Image
                          src="/assets/bento/stem-v2.png"
                          alt="STEM Skills"
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />


                        <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
                      </div>
                    }
                    icon={<Wrench className="h-4 w-4 text-slate-500" />}
                    className="md:col-span-1"
                  />
                  <BentoGridItem
                    title={<span className="text-slate-900 font-black text-xl">Teamwork</span>}
                    description="Work together to solve complex problems. Mission success depends on every member doing their part."
                    header={
                      <div className="relative w-full h-full min-h-[6rem] rounded-xl overflow-hidden group">
                        <Image
                          src="/assets/project-tarc.jpg"
                          alt="Teamwork"
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
                      </div>
                    }
                    icon={<Users className="h-4 w-4 text-amber-500" />}
                    className="md:col-span-3"
                  />
                </BentoGrid>
              </motion.div>
            </div>
          </div>
        </section >

        {/* Upcoming Launch */}
        {
          nextLaunch && (
            <section className="py-20 border-t-2 border-slate-200 bg-white/60 backdrop-blur-sm">
              <div className="container-width">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1">
                    <div className="inline-block px-4 py-2 bg-slate-900 text-white font-mono font-bold mb-6 rounded-lg">
                      <ShinyText text={`NEXT MISSION: ${MISSION_CARD_CONTENT.status}`} speed={4} className="text-white" />
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black mb-8 text-slate-900 tracking-tighter uppercase leading-none">
                      {nextLaunch.title}
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-12">
                      <AppleGlass className="p-4" intensity="medium">
                        <div className="text-sm font-mono text-slate-500 mb-1">DATE</div>
                        <div className="text-xl font-bold" suppressHydrationWarning>{new Date(nextLaunch.date).toLocaleDateString()}</div>
                      </AppleGlass>
                      <AppleGlass className="p-4" intensity="medium">
                        <div className="text-sm font-mono text-slate-500 mb-1">LOCATION</div>
                        <div className="text-xl font-bold">{nextLaunch.location}</div>
                      </AppleGlass>
                    </div>

                    <Link href="/events" className="inline-block w-full text-center px-8 py-6 bg-amber-400 border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(30,41,59,1)] text-slate-900 font-black text-2xl uppercase hover:bg-amber-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all rounded-xl">
                      <GlitchText text="RSVP NOW" />
                    </Link>
                  </div>

                  <div className="flex-1 w-full aspect-square relative border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(30,41,59,1)] rounded-3xl overflow-hidden">
                    <Image
                      src="/assets/rocket-launch.jpg"
                      alt="Rocket Launch"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-amber-500/20 mix-blend-multiply pointer-events-none" />
                  </div>
                </div>
              </div>
            </section>
          )
        }

        {/* Leadership Reveal */}
        <section className="py-20 border-t-2 border-slate-900 bg-white/80 backdrop-blur-md">
          <div className="container-width">
            <h2 className="text-5xl font-black mb-16 text-slate-900 uppercase text-center">
              <ShinyText text="Command Team" speed={3} />
            </h2>

            <HoverReveal
              items={LEADERSHIP.map(l => ({
                id: l.id,
                title: l.name,
                subtitle: l.role,
                imageUrl: l.imageUrl
              }))}
              className="mb-16"
            />

            <div className="text-center">
              <Link href="/leadership" className="inline-block px-8 py-4 border-2 border-slate-900 text-slate-900 font-bold uppercase hover:bg-slate-900 hover:text-white transition-colors rounded-xl">
                <GlitchText text="View Full Roster" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
