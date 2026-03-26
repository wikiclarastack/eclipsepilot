"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  Bot, Code2, BookOpen, Wand2, Bug, Package,
  LogOut, ChevronRight, Home,
} from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/ai", icon: Bot, label: "AI Assistant" },
  { href: "/docs", icon: BookOpen, label: "Documentation" },
  { href: "/generator", icon: Wand2, label: "Code Generator" },
  { href: "/debug", icon: Bug, label: "Debug Tool" },
  { href: "/library", icon: Package, label: "Script Library" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 glass border-r border-white/5 flex flex-col fixed h-full z-40">
        {/* Logo */}
        <div className="p-4 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600/20 border border-brand-600/30 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-brand-400" />
            </div>
            <span className="font-bold text-white text-sm">Roblox Dev AI</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          <Link href="/" className="sidebar-item text-sm">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <div className="pt-2 pb-1">
            <p className="text-xs text-slate-600 px-4 uppercase tracking-wider font-medium">Tools</p>
          </div>
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`sidebar-item text-sm ${pathname === href ? "active" : ""}`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {pathname === href && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-brand-600/30 rounded-full flex items-center justify-center">
                <Code2 className="w-4 h-4 text-brand-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{session.user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{session.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-slate-500 hover:text-white transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
