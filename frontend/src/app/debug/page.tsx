"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Bug, Loader2, AlertTriangle, CheckCircle, Info } from "lucide-react";
import axios from "axios";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const PLACEHOLDER = `-- Paste your Luau script here
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
  local leaderstats = Instance.new("Folder")
  leaderstats.Name = "leaderstats"
  leaderstats.Parent = player
  
  local coins = Instance.new("IntValue")
  coins.Name = "Coins"
  coins.Value = 0
  coins.Parent = leaderstats
end)`;

export default function DebugPage() {
  const [script, setScript] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!script.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const prompt = `Analyze this Luau/Roblox script. Identify any bugs, errors, security issues, performance problems, and bad practices. Then suggest improvements and explain what the code does:\n\n\`\`\`luau\n${script}\n\`\`\``;
      const { data } = await axios.post(`${BACKEND}/api/chat`, { message: prompt });
      setResult(data.response);
    } catch {
      setResult("⚠️ Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-brand-600/20 border border-brand-600/30 rounded-xl flex items-center justify-center">
            <Bug className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h1 className="font-semibold text-white">Debug Tool</h1>
            <p className="text-xs text-slate-500">Paste your script and get instant AI analysis</p>
          </div>
        </div>

        {/* Info banner */}
        <div className="glass border border-brand-600/20 rounded-xl px-4 py-3 flex items-start gap-3 mb-6">
          <Info className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300">
            The AI will detect bugs, security vulnerabilities, performance issues, and suggest improvements for your Luau script.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-400">Your Script</label>
              <span className="text-xs text-slate-600">{script.length} chars</span>
            </div>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder={PLACEHOLDER}
              className="input-field font-mono text-xs resize-none h-96 leading-relaxed"
            />
            <button
              onClick={analyze}
              disabled={!script.trim() || loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Bug className="w-4 h-4" />
                  Analyze Script
                </>
              )}
            </button>
          </div>

          {/* Output */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-400 block">Analysis Result</label>
            <div className="glass rounded-xl h-96 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full gap-3 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-400" />
                  <span className="text-sm">Analyzing your script...</span>
                </div>
              ) : result ? (
                <div className="prose-dark text-sm">
                  <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed">{result}</pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-3">
                  <div className="flex gap-4">
                    <AlertTriangle className="w-6 h-6 opacity-30" />
                    <CheckCircle className="w-6 h-6 opacity-30" />
                  </div>
                  <p className="text-sm">Analysis will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
