"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    const res = await fetch("/api/lab-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      const next = searchParams.get("next") || "/lab";
      router.push(next);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs">
      <h1 className="text-sm text-white/50 tracking-[0.15em] font-light mb-6">Lab</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        autoFocus
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3
                   text-sm text-white/80 placeholder:text-white/20
                   focus:outline-none focus:border-white/25 transition-colors"
      />
      {error && (
        <p className="text-xs text-red-400/70 mt-2">Wrong password</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-3 py-2.5 rounded-lg bg-white/10 text-xs text-white/60
                   hover:bg-white/15 hover:text-white/80 transition-all
                   disabled:opacity-50"
      >
        {loading ? "..." : "Enter"}
      </button>
    </form>
  );
}

export default function LabLoginPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
