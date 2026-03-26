"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Send, Bot, User, Trash2, Sparkles, Copy, Check } from "lucide-react";
import axios from "axios";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

const SUGGESTIONS = [
  "Create a DataStore system with retry logic",
  "Build a secure RemoteEvent handler",
  "Make an anti-cheat system for my game",
  "Create a player inventory system",
  "Build a shop GUI with Robux purchases",
  "Create a leaderboard system",
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-slate-400 hover:text-white">
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-slide-up`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-600/40 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-4 h-4 text-brand-400" />
        </div>
      )}
      <div className={`max-w-[80%]`}>
        <div className={`rounded-2xl px-4 py-3 ${isUser ? "bg-brand-600 text-white rounded-tr-sm" : "glass rounded-tl-sm"}`}>
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex justify-end">
                <CopyButton text={msg.content} />
              </div>
              <MarkdownRenderer content={msg.content} />
            </div>
          )}
        </div>
        <p className="text-xs text-slate-600 mt-1 px-1">
          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-4 h-4 text-slate-300" />
        </div>
      )}
    </div>
  );
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${BACKEND}/api/chat`, { message: text.trim() });
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: data.response, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const errorMsg = axios.isAxiosError(err) ? err.response?.data?.error || "Failed to get response." : "Failed to get response.";
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: `⚠️ ${errorMsg}`, timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen">
        <div className="glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600/20 border border-brand-600/30 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h1 className="font-semibold text-white">AI Assistant</h1>
              <p className="text-xs text-slate-500">Roblox & Luau Expert</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={() => setMessages([])} className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
              <Trash2 className="w-3.5 h-3.5" /> Clear chat
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
              <div className="w-16 h-16 bg-brand-600/20 border border-brand-600/30 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-brand-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Roblox Dev AI</h2>
              <p className="text-slate-400 text-sm max-w-md mb-8">
                Ask me anything about Roblox development — Luau scripting, game systems, optimization, security, and more.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => sendMessage(s)} className="glass glass-hover text-left px-4 py-3 rounded-xl text-sm text-slate-300 hover:text-white transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
          )}

          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-600/40 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-brand-400" />
              </div>
              <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="glass border-t border-white/5 px-6 py-4">
          <div className="flex gap-3 items-end max-w-4xl mx-auto">
            <div className="flex-1 glass rounded-xl border border-white/10 focus-within:border-brand-500/50 transition-colors">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Luau, scripting, game systems..."
                rows={1}
                className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none resize-none max-h-32"
                style={{ minHeight: "48px" }}
              />
            </div>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-11 h-11 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all flex-shrink-0"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-center text-xs text-slate-600 mt-2">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
