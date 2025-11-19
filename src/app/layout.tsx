import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tahoma Rocketry Club | Inspire, Build, Launch",
    template: "%s | Tahoma Rocketry Club",
  },
  description:
    "Join Tahoma High School's premier rocketry club. Build and launch real rockets, compete in competitions, and develop STEM skills through hands-on aerospace engineering.",
  keywords: [
    "tahoma rocketry",
    "tahoma high school",
    "model rockets",
    "stem club",
    "aerospace engineering",
    "maple valley",
    "auburn washington",
  ],
  authors: [{ name: "Tahoma Rocketry Club" }],
  creator: "Tahoma Rocketry Club",
  publisher: "Tahoma Rocketry Club",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "Tahoma Rocketry Club | Inspire, Build, Launch",
    description:
      "Join Tahoma High School's premier rocketry club. Build and launch real rockets, compete in competitions, and develop STEM skills.",
    url: "/",
    siteName: "Tahoma Rocketry Club",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
