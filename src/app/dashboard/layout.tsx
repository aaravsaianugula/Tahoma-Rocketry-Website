import { RadicalFluidBackground } from "@/components/ui/radical-fluid-background";
import { DotPattern } from "@/components/ui/dot-pattern";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative min-h-screen bg-[#FDFBF7] text-slate-900 overflow-hidden font-sans selection:bg-cyan-200 selection:text-cyan-900">
            {/* 1. Radical Background Layer (Always Visible) */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
                <RadicalFluidBackground />
            </div>

            {/* 2. Texture Overlay - Dot Pattern */}
            <DotPattern
                width={32}
                height={32}
                cx={2}
                cy={2}
                cr={2}
                className="fixed inset-0 z-0 opacity-[0.15] fill-slate-400 pointer-events-none"
            />

            {/* 3. Glass Overlay for Depth */}
            <div className="fixed inset-0 z-0 bg-white/30 backdrop-blur-3xl pointer-events-none" />

            {/* 4. Content Wrapper */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {children}
            </div>
        </div>
    );
}
