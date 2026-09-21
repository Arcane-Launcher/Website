import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { AnimatedBackground } from "./components/animated-background";
import { AnimatedSteve } from "./components/animated-steve";
import { SmoothScroll } from "./components/smooth-scroll";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arcane Launcher",
  description: "A premium Minecraft launcher — instances, mods, skins, and safe version upgrades, all in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sora.variable} dark h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AnimatedBackground />
        <AnimatedSteve />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
