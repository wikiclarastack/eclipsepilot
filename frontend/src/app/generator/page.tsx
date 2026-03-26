"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Wand2, Copy, Check, Loader2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import axios from "axios";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const templates = [
  { id: "inventory", label: "Inventory System", prompt: "Generate a complete player inventory system in Luau with add, remove, and display functions. Include DataStore persistence and a GUI." },
  { id: "shop", label: "Shop System", prompt: "Generate a complete in-game shop system in Luau with item catalog, purchase validation, currency check, and GUI." },
  { id: "admin", label: "Admin Panel", prompt: "Generate a secure admin panel in Luau with commands like kick, ban, teleport, and give items. Include permission levels." },
  { id: "anticheat", label: "Anti-Cheat System", prompt: "Generate a server-side anti-cheat system in Luau that detects speed hacks, fly hacks, and teleport hacks." },
  { id: "leaderboard", label: "Leaderboard", prompt: "Generate a leaderboard system in Luau using OrderedDataStore with top 10 players display and GUI." },
  { id: "gui", label: "GUI System", prompt: "Generate a professional main menu GUI system in Luau with animated transitions, settings panel, and play button." },
  { id: "datastore", label: "DataStore Module", prompt: "Generate a production-ready DataStore module in Luau with retry logic, session locking, and error handling." },
  { id: "combat", label: "Combat System", prompt: "Generate a server-authoritative combat system in Luau with hitbox validation, damage calculation, and cooldowns." },
];

export default function GeneratorPage() {
  const [selected, setSelected] = useState(templates[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    const prompt = customPrompt.trim() || selected.prompt;
    setLoading(true);
    setResult("");
    try {
      const { data } = await axios.post(`${BACKEND}/api/chat`, { message: prompt });
      setResult(data.response);
    } catch {
      setResult("⚠️ Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-brand-600/20 border border-brand-600/30 rounded-xl flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h1 className="font-semibold text-white">Code Generator</h1>
            <p className="text-xs text-slate-500">Generate complete Roblox systems instantly</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Templates */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Templates</h2>
            <div className="space-y-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setSelected(t); setCustomPrompt(""); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                    selected.id === t.id && !customPrompt
                      ? "bg-brand-600/20 border border-brand-600/40 text-white"
                      : "glass glass-hover text-slate-400 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-sm font-medium text-slate-400 block mb-2">Custom Request</label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe what you want to generate..."
                rows={4}
                className="input-field text-sm resize-none"
              />
            </div>

            <button
              onClick={generate}
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate Code
                </>
              )}
            </button>
          </div>

          {/* Right: Output */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Output</h2>
              {result && (
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy all"}
                </button>
              )}
            </div>

            <div className="glass rounded-xl min-h-[500px] overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-400" />
                  <span className="text-sm">Generating your script...</span>
                </div>
              ) : result ? (
                <div className="prose-dark p-4 text-sm">
                  <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed">{result}</pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-600">
                  <Wand2 className="w-8 h-8 mb-3 opacity-30" />
                  <p className="text-sm">Select a template and click Generate</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
