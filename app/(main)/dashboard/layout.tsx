"use client";

import { usePathname, useRouter } from "next/navigation";
import { Camera, Award, LogOut, Settings, Briefcase } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      <aside className="w-64 bg-[#111] border-r border-white/5 flex flex-col">
        <div className="p-6">
          <button
            onClick={() => router.push("/")}
            className="text-xl font-bold text-white tracking-wider hover:opacity-80 transition-opacity text-left"
          >
            Portofolio<span className="text-purple-500">.</span>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/dashboard/gallery"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all block ${
              isActive("/dashboard/gallery")
                ? "bg-purple-500/10 text-purple-400 font-medium"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Camera size={18} />
            <span className="text-sm">Gallery</span>
          </Link>

          <Link
            href="/dashboard/certificates"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all block ${
              isActive("/dashboard/certificates")
                ? "bg-purple-500/10 text-purple-400 font-medium"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Award size={18} />
            <span className="text-sm">Certificates</span>
          </Link>

          <Link
            href="/dashboard/projects"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all block ${
              isActive("/dashboard/projects")
                ? "bg-purple-500/10 text-purple-400 font-medium"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Briefcase size={18} />
            <span className="text-sm">Projects</span>
          </Link>

          <Link
            href="/dashboard"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all block ${
              pathname === "/dashboard"
                ? "bg-purple-500/10 text-purple-400 font-medium"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings size={18} />
            <span className="text-sm">Pengaturan</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => router.push("/dashboard/login")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
