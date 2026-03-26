import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Roblox Dev AI — Professional AI for Roblox Developers",
  description:
    "Enterprise-grade AI platform for Roblox Studio developers. Get expert help with Luau, scripting, systems architecture, and game development.",
  keywords: "Roblox, Luau, AI, game development, Roblox Studio, scripting",
  openGraph: {
    title: "Roblox Dev AI",
    description: "Professional AI platform for Roblox developers",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-dark-950 text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
