"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="absolute top-2 right-2 p-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-slate-400 hover:text-white"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function renderContent(content: string) {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let match;
  let i = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > last) {
      parts.push(<span key={i++} className="whitespace-pre-wrap">{content.slice(last, match.index)}</span>);
    }
    const lang = match[1] || "text";
    const code = match[2];
    parts.push(
      <div key={i++} className="relative my-2">
        <div className="flex items-center justify-between bg-dark-950 px-3 py-1.5 rounded-t-lg border border-white/10 border-b-0">
          <span className="text-xs text-slate-500 font-mono">{lang}</span>
          <CopyBtn text={code} />
        </div>
        <SyntaxHighlighter
          style={oneDark}
          language={lang}
          PreTag="div"
          customStyle={{ margin: 0, borderRadius: "0 0 8px 8px", border: "1px solid rgba(255,255,255,0.1)", borderTop: "none", fontSize: "0.8rem" }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
    last = match.index + match[0].length;
  }

  if (last < content.length) {
    parts.push(<span key={i++} className="whitespace-pre-wrap">{content.slice(last)}</span>);
  }

  return <div className="text-sm text-slate-300 leading-relaxed">{parts}</div>;
}

export default function MarkdownRenderer({ content }: { content: string }) {
  return renderContent(content);
}
