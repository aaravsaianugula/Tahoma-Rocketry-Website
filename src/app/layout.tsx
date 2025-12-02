import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
// import { CustomCursor } from "@/components/ui/custom-cursor";
import { SoundManager } from "@/components/ui/sound-manager";
import { GlobalDock } from "@/components/global-dock";
import { PageTransition } from "@/components/page-transition";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tahoma Rocketry Club",
  description: "Official website of the Tahoma Rocketry Club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#020410] text-slate-100 antialiased selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]`} suppressHydrationWarning>
        <SmoothScroll>
          <ToastProvider>
            {/* <CustomCursor /> */}
            <SoundManager />
            <Navbar />
            <GlobalDock />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
