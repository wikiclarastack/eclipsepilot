"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/20 border border-red-500/30 rounded-2xl mb-4">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <h1 className="text-xl font-semibold text-white mb-2">Authentication Error</h1>
        <p className="text-slate-400 text-sm mb-6">
          Something went wrong during sign in. Please try again.
        </p>
        <Link href="/auth/signin" className="btn-primary justify-center">
          Try Again
        </Link>
      </div>
    </div>
  );
}
