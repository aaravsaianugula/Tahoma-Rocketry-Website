"use client";

import { usePathname } from "next/navigation";
import { RadicalDock } from "./ui/radical-dock";
import { Home, Rocket, Users, Calendar, Image as ImageIcon, Mail } from "lucide-react";
import { motion } from "framer-motion";

export function GlobalDock() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    if (pathname.startsWith("/dashboard")) return null;

    const dockItems = [
        { title: "Home", icon: <Home className="h-full w-full" />, href: "/" },
        { title: "Mission", icon: <Rocket className="h-full w-full" />, href: "/about" },
        { title: "Team", icon: <Users className="h-full w-full" />, href: "/leadership" },
        { title: "Events", icon: <Calendar className="h-full w-full" />, href: "/events" },
        { title: "Gallery", icon: <ImageIcon className="h-full w-full" />, href: "/gallery" },
        { title: "Contact", icon: <Mail className="h-full w-full" />, href: "/contact" },
    ];

    return (
        <motion.div
            layout
            className={`fixed z-50 transition-all duration-700 ease-in-out ${isHome
                ? "bottom-8 left-1/2 -translate-x-1/2 top-auto right-auto"
                : "left-8 top-1/2 -translate-y-1/2 bottom-auto right-auto"
                }`}
        >
            <RadicalDock
                key={isHome ? "home-dock" : "page-dock"}
                items={dockItems}
                orientation={isHome ? "horizontal" : "vertical"}
            />
        </motion.div>
    );
}
