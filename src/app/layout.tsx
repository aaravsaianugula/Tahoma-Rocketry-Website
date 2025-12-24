import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
// import { CustomCursor } from "@/components/ui/custom-cursor";
import { SoundManager } from "@/components/ui/sound-manager";
import { GlobalDock } from "@/components/global-dock";
import { CookieScrubber } from "@/components/cookie-scrubber";
import { PageTransition } from "@/components/page-transition";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";

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
      <body className={`${inter.className} bg-[#FDFBF7] text-slate-900 antialiased selection:bg-rose-200 selection:text-rose-900`} suppressHydrationWarning>
        <SmoothScroll>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ToastProvider>
              {/* <CustomCursor /> */}
              <CookieScrubber />
              <SoundManager />
              <Navbar />
              <GlobalDock />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
            </ToastProvider>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
