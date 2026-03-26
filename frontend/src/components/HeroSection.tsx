"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Code2, Shield } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-brand-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-brand-400 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>Powered by Groq — Ultra-fast AI inference</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up leading-tight">
          The AI Platform for
          <br />
          <span className="gradient-text">Roblox Developers</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-slide-up">
          Expert AI assistance for Luau scripting, game systems architecture, multiplayer,
          DataStore, anti-cheat, and everything you need to build professional Roblox games.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up">
          <Link href="/ai" className="btn-primary text-base px-8 py-4">
            Start Developing
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/docs" className="btn-secondary text-base px-8 py-4">
            View Documentation
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in">
          {[
            { value: "50+", label: "Script Templates" },
            { value: "15+", label: "System Categories" },
            { value: "< 1s", label: "Response Time" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Preview card */}
        <div className="mt-16 max-w-3xl mx-auto glass rounded-2xl p-1 animate-fade-in">
          <div className="bg-dark-900 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-slate-500">AI Assistant — Luau Expert</span>
            </div>
            <div className="text-left space-y-3">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-brand-600/30 border border-brand-600/40 flex items-center justify-center flex-shrink-0">
                  <Code2 className="w-3 h-3 text-brand-400" />
                </div>
                <div className="glass rounded-lg px-4 py-2 text-sm text-slate-300 max-w-xs">
                  Create a secure DataStore system with retry logic and error handling
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <div className="bg-brand-600/20 border border-brand-600/30 rounded-lg px-4 py-2 text-sm text-slate-200 max-w-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-3 h-3 text-brand-400" />
                    <span className="text-xs text-brand-400 font-medium">Roblox Dev AI</span>
                  </div>
                  Here&apos;s a production-ready DataStore module with exponential backoff retry...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
