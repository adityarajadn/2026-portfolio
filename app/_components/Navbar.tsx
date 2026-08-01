"use client";

import { Home, User, Folder, Award, Phone, Camera } from "lucide-react";

interface NavbarProps {
  isScrolled: boolean;
  currentView: string;
  onNavigate: (id: string) => void;
}

const navLinks = [
  { name: "Beranda", id: "home", icon: <Home size={18} /> },
  { name: "Profil", id: "about", icon: <User size={18} /> },
  { name: "Proyek", id: "projects", icon: <Folder size={18} /> },
  { name: "Galeri", id: "experiences", icon: <Camera size={18} /> },
  { name: "Pencapaian", id: "certificates", icon: <Award size={18} /> },
];

export default function Navbar({
  isScrolled,
  currentView,
  onNavigate,
}: NavbarProps) {
  return (
    <nav
      className={`fixed z-50 transition-all duration-300 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full flex items-center justify-center ${
        isScrolled ? "bg-neutral-950/80" : "bg-[#0a0a0a]/90"
      } 
      top-6 left-1/2 -translate-x-1/2 w-max px-4 py-2 flex-row gap-2
      md:top-1/2 md:left-6 md:-translate-x-0 md:-translate-y-1/2 md:flex-col md:px-3 md:py-4 md:h-max`}
    >
      <div className="flex flex-row md:flex-col items-center gap-1 md:gap-2">
        {navLinks.map((link) => (
          <button
            key={link.id}
            id={`nav-${link.id}`}
            onClick={() => onNavigate(link.id)}
            className={`relative p-2.5 rounded-full transition-all group ${
              currentView === link.id ||
              (currentView === "home" && link.id === "home")
                ? "text-purple-400 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                : "text-neutral-400 hover:text-purple-400 hover:bg-purple-500/10"
            }`}
            aria-label={link.name}
          >
            {link.icon}
            <span className="absolute px-2 py-1 bg-[#111] border border-white/10 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg
              top-full left-1/2 -translate-x-1/2 mt-4 
              md:top-1/2 md:left-full md:-translate-y-1/2 md:-translate-x-0 md:mt-0 md:ml-4"
            >
              {link.name}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
