"use client";

import { ArrowLeft, Search, ExternalLink, Globe, Zap, Layout, Database, Code2, Shield, Cpu, Flame, Terminal, PenTool } from "lucide-react";
import ScrollReveal from "../ScrollReveal";
import ItchIcon from "../ItchIcon";
import GithubIcon from "../GithubIcon";

interface Project {
  id: string;
  title: string;
  desc?: string;
  description?: string;
  img?: string;
  tech?: string[];
  category?: string;
  github_url?: string;
  demo_url?: string;
}

interface ProjectsViewProps {
  projects: Project[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  projectFilter: string;
  onFilterChange: (f: string) => void;
  onBack: () => void;
  onSelectItem?: (item: unknown) => void;
}

export default function ProjectsView({
  projects,
  searchQuery,
  onSearchChange,
  projectFilter,
  onFilterChange,
  onBack,
  onSelectItem,
}: ProjectsViewProps) {
  const filtered = projects.filter((proj) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      proj.title?.toLowerCase().includes(q) ||
      (proj.desc || proj.description)?.toLowerCase().includes(q) ||
      proj.tech?.some((t) => t.toLowerCase().includes(q));
    const matchesCategory = projectFilter === "All" || proj.category === projectFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="pt-40 pb-32 px-4 md:px-12 max-w-7xl mx-auto min-h-screen text-left">
      <ScrollReveal>
        <button
          id="projects-back-btn"
          onClick={onBack}
          className="group flex items-center gap-2 text-neutral-400 mb-12 hover:text-white transition-all bg-white/5 px-5 py-2.5 rounded-full w-fit border border-white/5 hover:border-purple-500/50"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-medium mb-4 text-white tracking-tight">Project Archive</h1>
            <p className="text-neutral-400 text-lg">A complete collection of technical explorations.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-3 flex items-center gap-3 w-full md:w-80 shadow-xl">
            <Search size={18} className="text-neutral-500" />
            <input
              id="projects-search"
              type="text"
              placeholder="Search projects...ech stack..."
              className="bg-transparent border-none outline-none text-sm w-full text-white"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mb-16">
          {["All", ...Array.from(new Set(projects.map(p => p.category || "Web")))].map((cat) => (
            <button
              key={cat}
              id={`filter-${cat.toLowerCase()}`}
              onClick={() => onFilterChange(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all border ${
                projectFilter === cat
                  ? "bg-purple-600 border-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:border-purple-500/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.length > 0 ? (
          filtered.map((proj, idx) => (
            <ScrollReveal key={proj.id} delay={idx * 100}>
              <div 
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-900 border border-white/5 shadow-xl cursor-pointer"
                onClick={() => onSelectItem?.(proj)}
              >
                <img
                  src={proj.img || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"}
                  alt={proj.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />

                {/* Background Gradient */}

                {/* Text Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6 flex flex-col justify-end z-10 pointer-events-none">
                  <div className="transform transition-transform duration-300 group-hover:-translate-y-12">
                    <h3 className="text-2xl font-medium mb-1 text-white group-hover:text-purple-400 transition-colors">{proj.title}</h3>
                    <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{proj.desc || proj.description}</p>
                    
                    {/* Tech Stack */}
                  {proj.tech && proj.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {proj.tech.map((t, i) => {
                        const getTechIcon = (tech: string) => {
                          const lower = tech.toLowerCase();
                          if (lower.includes("react")) return <Globe size={12} />;
                          if (lower.includes("next")) return <Zap size={12} />;
                          if (lower.includes("tailwind")) return <Layout size={12} />;
                          if (lower.includes("node") || lower.includes("sql")) return <Database size={12} />;
                          if (lower.includes("type") || lower.includes("script")) return <Code2 size={12} />;
                          if (lower.includes("supa")) return <Shield size={12} />;
                          if (lower.includes("unity")) return <Cpu size={12} />;
                          if (lower.includes("godot")) return <Flame size={12} />;
                          if (lower.includes("c#")) return <Terminal size={12} />;
                          if (lower.includes("figma") || lower.includes("ui")) return <PenTool size={12} />;
                          return <Code2 size={12} />;
                        };
                        
                        return (
                          <span
                            key={i}
                            className={`flex items-center gap-1.5 text-[10px] font-medium border px-2.5 py-1 rounded-full ${
                              searchQuery && t.toLowerCase().includes(searchQuery.toLowerCase())
                                ? "bg-purple-600/30 border-purple-500/50 text-purple-200"
                                : "bg-white/10 border-white/10 text-neutral-300"
                            }`}
                          >
                            {getTechIcon(t)}
                            {t}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto transform translate-y-4 group-hover:translate-y-0">
                    {proj.demo_url && (
                      <a href={proj.demo_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-lg transition-colors shadow-lg">
                        {proj.category === "Game" ? <ItchIcon size={14} /> : <ExternalLink size={14} />} Visit
                      </a>
                    )}
                    {proj.github_url && (
                      <a href={proj.github_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-medium rounded-lg transition-colors">
                        <GithubIcon size={14} /> GitHub
                      </a>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); onSelectItem?.(proj); }} 
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-300 hover:text-white text-xs font-medium rounded-lg transition-colors ml-auto"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-medium text-white mb-2">Project not found</h3>
            <p className="text-neutral-500">Try another keyword.</p>
          </div>
        )}
      </div>
    </section>
  );
}
