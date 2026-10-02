"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthCookie } from "@/app/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        setAuthCookie();
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.message || "Password incorrect");
        setPassword("");
      }
    } catch (err) {
      setError("Error verifying password");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#111] border border-white/5 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-neutral-400 text-sm mb-8">Enter password to access</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Enter admin password"
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-purple-500/20"
            >
              {isLoading ? "Verifying..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
