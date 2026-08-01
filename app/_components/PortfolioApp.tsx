"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Globe, Zap, Layout, Database, Code2, Shield, Cpu, Flame, Terminal, PenTool, ExternalLink } from "lucide-react";
import Navbar from "./Navbar";
import Modal from "./Modal";
import HomeView from "./views/HomeView";
import ProjectsView from "./views/ProjectsView";
import ExperiencesView from "./views/ExperiencesView";
import CertificatesView from "./views/CertificatesView";
import { supabase } from "../../lib/supabase";
import Galaxy from "./Galaxy";

type View = "home" | "projects" | "experiences" | "certificates";

interface SelectedItem {
  title: string;
  img?: string;
  gambar_url?: string;
  desc?: string;
  description?: string;
  tech?: string[];
  demo_url?: string;
  github_url?: string;
  [key: string]: unknown;
}

interface PortfolioAppProps {
  initialView?: View;
}

export default function PortfolioApp({ initialView = "home" }: PortfolioAppProps = {}) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const currentView = initialView;
  const [certFilter, setCertFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pRes, eRes, cRes, coRes, sRes] = await Promise.all([
          supabase
            .from("portfolio_items")
            .select("*")
            .eq("type", "proyek")
            .order("id", { ascending: false }),
          supabase
            .from("portfolio_items")
            .select("*")
            .eq("type", "pengalaman")
            .order("id", { ascending: true }),
          supabase.from("portfolio_items").select("*").eq("type", "sertifikat"),
          supabase
            .from("companies")
            .select("*")
            .order("id", { ascending: true }),
          supabase.from("portfolio_items").select("*").in("type", ["setting", "organization", "timeline"]),
        ]);
        const projs = (pRes.data || []).map((item) => {
          const descParts = (item.description || "").split("|||TECH:");
          return {
            ...item,
            img: item.image,
            desc: descParts[0],
            description: descParts[0],
            category: item.position || "Web",
            tech: descParts[1] ? descParts[1].split(",") : [],
            demo_url: item.link || "",
          };
        });
        setProjects(projs as any);

        // Map kolom 'image' ke 'img' agar sesuai dengan props komponen lama
        const exps = (eRes.data || []).map((item) => ({
          ...item,
          img: item.image,
        }));
        setExperiences(exps as any);

        const certs = (cRes.data || []).map((item) => ({
          ...item,
          img: item.image,
        }));
        setCertificates(certs as any);

        setCompanies(coRes.data || []);
        setSettings(sRes.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (currentView !== "home") {
      router.push(`/#${id}`);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goToView = (view: string) => {
    router.push(view === "home" ? "/" : `/${view}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-purple-400 gap-4">
        <Loader2 className="animate-spin" size={40} />
        <p className="font-mono text-sm animate-pulse tracking-widest uppercase">
          Connecting to Database...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-200 selection:bg-purple-500/30 overflow-x-hidden relative">
      {/* Background Interactive Galaxy */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Galaxy
          mouseRepulsion
          mouseInteraction
          density={0.5}
          glowIntensity={0.1}
          saturation={0}
          hueShift={10}
          twinkleIntensity={0.1}
          rotationSpeed={0.1}
          repulsionStrength={0.3}
          autoCenterRepulsion={0}
          starSpeed={0.005}
          speed={1}
        />
      </div>

      {/* Background glow overlay */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      <Navbar
        isScrolled={isScrolled}
        currentView={currentView}
        onNavigate={scrollToSection}
      />

      <main className="relative z-10">
        {currentView === "home" && (
          <HomeView
            projects={projects}
            experiences={experiences}
            certificates={certificates}
            companies={companies}
            settings={settings}
            onNavigate={scrollToSection}
            onViewAll={goToView}
            onSelectItem={(item) => setSelectedItem(item as SelectedItem)}
          />
        )}

        {currentView === "projects" && (
          <ProjectsView
            projects={projects}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            projectFilter={projectFilter}
            onFilterChange={setProjectFilter}
            onSelectItem={(item) => setSelectedItem(item as SelectedItem)}
            onBack={() => {
              router.push("/");
            }}
          />
        )}

        {currentView === "experiences" && (
          <ExperiencesView
            experiences={experiences}
            onBack={() => {
              router.push("/");
            }}
            onSelect={(item) => setSelectedItem(item as SelectedItem)}
          />
        )}

        {currentView === "certificates" && (
          <CertificatesView
            certificates={certificates}
            certFilter={certFilter}
            onFilterChange={setCertFilter}
            onBack={() => {
              router.push("/");
            }}
            onSelect={(item) => setSelectedItem(item as SelectedItem)}
          />
        )}
      </main>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>
        {selectedItem && (
          <div className="flex flex-col h-full">
            <div className="w-full bg-neutral-900 relative aspect-video">
              <img
                src={selectedItem.img || selectedItem.gambar_url}
                alt={selectedItem.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="w-full p-6 md:p-8 flex flex-col justify-center text-left">
              <h2 className="text-3xl font-bold text-white mb-4">
                {selectedItem.title}
              </h2>
              <p className="text-neutral-500 leading-relaxed text-sm mb-4">
                {selectedItem.desc ||
                  selectedItem.description ||
                  "Dokumentasi detail Adit."}
              </p>
              {selectedItem.tech && selectedItem.tech.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedItem.tech.map((t, i) => {
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
                        className="flex items-center gap-1.5 text-[10px] font-medium border px-2.5 py-1 rounded-full bg-purple-600/20 border-purple-500/30 text-purple-200"
                      >
                        {getTechIcon(t)}
                        {t}
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-auto">
                {selectedItem.demo_url && (
                  <a
                    href={selectedItem.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-medium shadow-lg"
                  >
                    Kunjungi Proyek <ExternalLink size={16} />
                  </a>
                )}
                {selectedItem.github_url && !selectedItem.demo_url && (
                  <a
                    href={selectedItem.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    Lihat GitHub <ExternalLink size={16} />
                  </a>
                )}
                <button
                  id="modal-close-btn"
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl border border-white/10 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
