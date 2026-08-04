"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Nanti kita ganti dengan validasi API sesungguhnya
    if (password === "rahasia123") {
      // Set cookie/session di sini nantinya
      router.push("/dashboard");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-white mb-2">Admin Access</h1>
        <p className="text-neutral-400 text-center text-sm mb-8">
          Silakan masukkan password untuk mengakses dashboard.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Password..."
              className={`w-full bg-[#1a1a1a] border ${
                error ? "border-red-500" : "border-white/10"
              } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors`}
            />
            {error && <p className="text-red-500 text-xs mt-2">Password salah!</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-semibold rounded-lg px-4 py-3 hover:bg-purple-500 transition-colors"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
