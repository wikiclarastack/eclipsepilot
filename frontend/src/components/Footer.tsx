import Link from "next/link";
import { Bot } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-brand-600/20 border border-brand-600/30 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-brand-400" />
              </div>
              <span className="font-bold text-white">Roblox Dev AI</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              Enterprise-grade AI platform for professional Roblox game developers.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Platform</h4>
            <ul className="space-y-2">
              {[
                { href: "/ai", label: "AI Assistant" },
                { href: "/docs", label: "Documentation" },
                { href: "/generator", label: "Code Generator" },
                { href: "/debug", label: "Debug Tool" },
                { href: "/library", label: "Script Library" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2">
              {[
                { href: "https://create.roblox.com/docs", label: "Roblox Docs" },
                { href: "https://luau.org", label: "Luau Language" },
                { href: "https://discord.gg", label: "Discord Community" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-xs text-slate-600 space-y-1 text-center sm:text-left">
            <p>© 2026 EclipseByte Softwares</p>
            <p>© 2026 Wind Rose Technologies</p>
            <p>All rights reserved.</p>
          </div>
          <p className="text-xs text-slate-600">
            Not affiliated with Roblox Corporation.
          </p>
        </div>
      </div>
    </footer>
  );
}
