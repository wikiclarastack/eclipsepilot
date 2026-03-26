"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Bot, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/ai", label: "AI Assistant" },
  { href: "/docs", label: "Documentation" },
  { href: "/generator", label: "Code Generator" },
  { href: "/library", label: "Script Library" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600/20 border border-brand-600/30 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-brand-400" />
            </div>
            <span className="font-bold text-white">Roblox Dev AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">{session.user?.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/auth/signin" className="btn-primary text-sm py-2">
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/5 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!session && (
            <Link href="/auth/signin" className="btn-primary text-sm py-2 mt-2">
              Get Started
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
