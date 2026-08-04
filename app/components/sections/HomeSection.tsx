"use client";

import {
  Code2,
  Quote,
  ArrowDown,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  MonitorSmartphone,
  Gamepad2,
  Database,
  Globe,
  Zap,
  Layout,
  Cpu,
  Flame,
  Terminal,
  Maximize2,
  Shield,
  Mail,
  PenTool,
} from "lucide-react";
import ScrollReveal from "@/app/components/ui/ScrollReveal";
import TypingEffect from "@/app/components/ui/TypingEffect";
import AnimatedCounter from "@/app/components/ui/AnimatedCounter";
import GithubIcon from "@/app/components/icons/GithubIcon";
import ItchIcon from "@/app/components/icons/ItchIcon";
import InstagramIcon from "@/app/components/icons/InstagramIcon";
import LinkedinIcon from "@/app/components/icons/LinkedinIcon";
import { GitHubCalendar } from "react-github-calendar";

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

interface Experience {
  id?: string;
  title: string;
  img: string;
}

interface Certificate {
  id?: string;
  title: string;
  issuer?: string;
  category?: string;
  gambar_url?: string;
  img?: string;
}

interface Company {
  id?: string;
  name: string;
  logo_url: string;
}

interface HomeSectionProps {
  projects: Project[];
  experiences: Experience[];
  certificates: Certificate[];
  companies: Company[];
  settings?: any[];
  onNavigate: (id: string) => void;
  onViewAll: (view: string) => void;
  onSelectItem: (item: unknown) => void;
}

const skillsData = [
  {
    title: "Web Development",
    icon: <MonitorSmartphone size={32} />,
    desc: "React, Next.js, dan Tailwind CSS.",
    tech: [
      { name: "React", icon: <Globe size={16} /> },
      { name: "Next.js", icon: <Zap size={16} /> },
      { name: "Tailwind", icon: <Layout size={16} /> },
      { name: "JS/TS", icon: <Code2 size={16} /> },
    ],
  },
  {
    title: "Game Development",
    icon: <Gamepad2 size={32} />,
    desc: "Unity, Godot, dan C# Logic.",
    tech: [
      { name: "Unity", icon: <Cpu size={16} /> },
      { name: "Godot", icon: <Flame size={16} /> },
      { name: "C#", icon: <Terminal size={16} /> },
      { name: "2D/3D", icon: <Maximize2 size={16} /> },
    ],
  },
  {
    title: "Backend & DB",
    icon: <Database size={32} />,
    desc: "Node.js, Supabase, dan SQL.",
    tech: [
      { name: "Node.js", icon: <Zap size={16} /> },
      { name: "Supabase", icon: <Shield size={16} /> },
      { name: "PostgreSQL", icon: <Database size={16} /> },
      { name: "REST API", icon: <ExternalLink size={16} /> },
    ],
  },
];

export default function HomeSection({
  projects,
  experiences,
  certificates,
  companies,
  settings = [],
  onNavigate,
  onViewAll,
  onSelectItem,
}: HomeSectionProps) {
  const getSettingLink = (key: string, defaultUrl: string) => {
    const s = settings.find((x) => x.title === key);
    return s?.link || defaultUrl;
  };

  return (
    <>
      {/* HERO */}
      <section
        id="home"
        className="min-h-screen pt-40 pb-20 px-4 md:px-12 flex flex-col items-center justify-center relative text-center"
      >
        <ScrollReveal>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-white leading-[1.1] mb-6">
            Aditya Rajadana Hernadi
          </h1>
          <div className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-light mb-10 min-h-[3rem]">
            I am a{" "}
            <TypingEffect
              words={["UI/UX Designer", "Frontend Developer", "Game Developer"]}
              speed={100}
              delay={1500}
            />
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              id="hero-projects-btn"
              onClick={() => onNavigate("projects")}
              className="px-8 py-3.5 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              View Projects
            </button>
            <div className="flex items-center gap-3">
              <a
                href={getSettingLink("github", "#")}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:text-white transition-all shadow-lg"
                aria-label="Github"
              >
                <GithubIcon size={20} />
              </a>
              <a
                href={getSettingLink("linkedin", "#")}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:text-blue-400 transition-all shadow-lg"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={20} />
              </a>
              <a
                href={getSettingLink("instagram", "#")}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:text-pink-400 transition-all shadow-lg"
                aria-label="Instagram"
              >
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mt-24 w-full max-w-6xl mx-auto overflow-hidden relative">
            <div className="animate-marquee py-8">
              {(companies.length > 0 ? [...companies, ...companies] : []).map(
                (comp, idx) => (
                  <div
                    key={idx}
                    className="mx-8 md:mx-16 flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                  >
                    <img
                      src={comp.logo_url}
                      alt={comp.name}
                      className="h-8 md:h-10 w-auto object-contain"
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="py-32 px-4 md:px-12 max-w-7xl mx-auto border-t border-white/5"
      >
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
            {/* Kolom 1: Profil */}
            <div className="lg:col-span-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 relative overflow-hidden shadow-2xl flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-3xl rounded-full" />
              <img
                src="/png/me.jpg"
                alt="Profile"
                className="w-full h-64 rounded-2xl grayscale mb-6 object-cover border border-purple-500/20"
              />
              <h3 className="text-2xl font-semibold mb-2 text-white">
                Aditya Rajadana H
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed mb-8">
                Fokus pada pembuatan aplikasi backend yang scalable dan frontend
                yang interaktif.
              </p>
              <div className="flex gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex-1 text-center">
                  <h4 className="text-2xl font-bold text-white">
                    <AnimatedCounter end={projects.length} />
                  </h4>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
                    Proyek
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex-1 text-center">
                  <h4 className="text-2xl font-bold text-white">
                    <AnimatedCounter end={certificates.length} />
                  </h4>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
                    Sertifikat
                  </p>
                </div>
              </div>
            </div>
            {/* Kolom 2: Quote & GitHub */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-purple-900/10 backdrop-blur-2xl border border-purple-500/30 p-8 md:p-10 rounded-[2.5rem] rounded-tl-md relative shadow-2xl h-full flex flex-col justify-center overflow-hidden group">
                <div className="absolute -top-10 -right-10 text-purple-500/10 z-0 group-hover:scale-110 transition-transform duration-700">
                  <Code2 size={180} />
                </div>
                <h3 className="text-xl font-medium text-white mb-6 relative z-10 flex items-center gap-2">
                  <MonitorSmartphone size={20} className="text-purple-400" />{" "}
                  Skills
                </h3>
                <div className="flex flex-col gap-3 relative z-10">
                  <div className="flex flex-col bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-neutral-300 hover:bg-purple-600/20 hover:text-white hover:border-purple-500/50 transition-all duration-300 cursor-default shadow-sm group/badge overflow-hidden">
                    <div className="flex items-center gap-3">
                      <div className="text-purple-400 group-hover/badge:text-purple-300 transition-colors">
                        <Code2 size={18} />
                      </div>
                      <span className="text-sm font-medium">
                        Fullstack Development
                      </span>
                    </div>
                    <div className="grid grid-rows-[0fr] group-hover/badge:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                      <div className="overflow-hidden">
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/10">
                          <span className="text-[10px] px-2 py-1 bg-white/10 rounded-md font-medium">
                            Next.js
                          </span>
                          <span className="text-[10px] px-2 py-1 bg-white/10 rounded-md font-medium">
                            React
                          </span>
                          <span className="text-[10px] px-2 py-1 bg-white/10 rounded-md font-medium">
                            Node.js
                          </span>
                          <span className="text-[10px] px-2 py-1 bg-white/10 rounded-md font-medium">
                            PostgreSQL
                          </span>
                          <span className="text-[10px] px-2 py-1 bg-white/10 rounded-md font-medium">
                            Supabase
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-neutral-300 hover:bg-purple-600/20 hover:text-white hover:border-purple-500/50 transition-all duration-300 cursor-default shadow-sm group/badge overflow-hidden">
                    <div className="flex items-center gap-3">
                      <div className="text-purple-400 group-hover/badge:text-purple-300 transition-colors">
                        <PenTool size={18} />
                      </div>
                      <span className="text-sm font-medium">
                        UI / UX Design
                      </span>
                    </div>
                    <div className="grid grid-rows-[0fr] group-hover/badge:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                      <div className="overflow-hidden">
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/10">
                          <span className="text-[10px] px-2 py-1 bg-white/10 rounded-md font-medium">
                            Figma
                          </span>
                          <span className="text-[10px] px-2 py-1 bg-white/10 rounded-md font-medium">
                            Tailwind CSS
                          </span>
                          <span className="text-[10px] px-2 py-1 bg-white/10 rounded-md font-medium">
                            Prototyping
                          </span>
                          <span className="text-[10px] px-2 py-1 bg-white/10 rounded-md font-medium">
                            Wireframing
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-neutral-300 hover:bg-purple-600/20 hover:text-white hover:border-purple-500/50 transition-all duration-300 cursor-default shadow-sm group/badge overflow-hidden">
                    <div className="flex items-center gap-3">
                      <div className="text-purple-400 group-hover/badge:text-purple-300 transition-colors">
                        <GithubIcon size={18} />
                      </div>
                      <span className="text-sm font-medium">
                        Collaborate GitHub
                      </span>
                    </div>
                    <div className="grid grid-rows-[0fr] group-hover/badge:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                      <div className="overflow-hidden">
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/10">
                          <span className="text-[10px] px-2 py-1 bg-white/10 rounded-md font-medium">
                            Git
                          </span>
                          <span className="text-[10px] px-2 py-1 bg-white/10 rounded-md font-medium">
                            GitHub Actions
                          </span>
                          <span className="text-[10px] px-2 py-1 bg-white/10 rounded-md font-medium">
                            Vercel
                          </span>
                          <span className="text-[10px] px-2 py-1 bg-white/10 rounded-md font-medium">
                            CI/CD
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GitHub Contribution Graph */}
              <div className="bg-[#111]/50 border border-white/5 p-6 rounded-3xl overflow-x-auto shadow-2xl backdrop-blur-xl shrink-0">
                <h3 className="text-white text-sm font-medium mb-4 flex items-center gap-2">
                  <GithubIcon size={16} /> GitHub Contributions
                </h3>
                <div className="text-xs">
                  <GitHubCalendar
                    username="adityarajadn"
                    colorScheme="dark"
                    theme={{
                      light: [
                        "#161b22",
                        "#0e4429",
                        "#006d32",
                        "#26a641",
                        "#39d353",
                      ],
                      dark: [
                        "#161b22",
                        "#0e4429",
                        "#006d32",
                        "#26a641",
                        "#39d353",
                      ],
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Kolom 3: Organizations & Communities */}
            <div className="lg:col-span-3 bg-[#111]/50 border border-white/5 p-6 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col">
              <h3 className="text-white text-sm font-medium mb-6">
                Organizations & Communities
              </h3>
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                {settings.filter((s) => s.type === "organization").length >
                0 ? (
                  [...settings]
                    .filter((s) => s.type === "organization")
                    .sort(
                      (a, b) =>
                        parseInt(a.link || "999") - parseInt(b.link || "999"),
                    )
                    .map((org, i) => (
                      <div key={i} className="flex items-center gap-4">
                        {org.image ? (
                          <img
                            src={org.image}
                            alt={org.title}
                            className="w-12 h-12 rounded-xl object-cover bg-white/5 p-1 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg shrink-0">
                            {org.title.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-white font-medium text-sm leading-tight mb-1">
                            {org.title}
                          </h4>
                          {org.description && (
                            <p className="text-[11px] text-purple-400 font-medium mb-0.5">
                              {org.description}
                            </p>
                          )}
                          <p className="text-[10px] text-neutral-500">
                            {org.position}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-xs text-neutral-500 italic">
                    No organizations added yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* TIMELINE PENGALAMAN */}
      <section
        id="skills"
        className="py-24 px-4 md:px-12 max-w-7xl mx-auto border-t border-white/5 text-left overflow-hidden"
      >
        <ScrollReveal>
          <div className="mb-16">
            <span className="px-3 py-1 border border-purple-500/30 bg-purple-500/5 rounded-full text-xs text-purple-400 uppercase tracking-widest mb-4 inline-block">
              Perjalanan
            </span>
            <h2 className="text-4xl md:text-5xl font-medium text-white">
              Riwayat Pendidikan
            </h2>
          </div>

          <div className="relative mt-12 md:mt-20 mb-10 w-full overflow-hidden">
            {/* Garis Vertikal - Mobile */}
            <div className="md:hidden absolute top-0 left-8 bottom-0 w-1 bg-gradient-to-b from-purple-900/10 via-purple-500/30 to-purple-900/10 rounded-full"></div>

            <div className="flex flex-col md:flex-row md:overflow-x-auto gap-12 md:gap-8 md:pb-48 md:pt-48 timeline-scrollbar md:snap-x relative z-10">
              {/* Garis Horizontal Utama - Desktop (Inside scroll container so it spans the full scroll width) */}
              <div
                className="hidden md:block absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-900/10 via-purple-500/30 to-purple-900/10 transform -translate-y-1/2 rounded-full"
                style={{
                  minWidth: "100%",
                  width: "max-content",
                  right: "-100vw",
                }}
              ></div>

              {settings.filter((s) => s.type === "timeline").length > 0 ? (
                [...settings]
                  .filter((s) => s.type === "timeline")
                  .sort(
                    (a, b) =>
                      parseInt(a.link || "999") - parseInt(b.link || "999"),
                  )
                  .map((exp, idx) => {
                    const isTop = idx % 2 === 0;
                    return (
                      <div
                        key={idx}
                        className="relative w-full pl-20 md:pl-0 md:min-w-[340px] md:w-[340px] md:snap-center flex flex-col justify-center"
                      >
                        {/* Dot on the timeline - Desktop */}
                        <div className="hidden md:block absolute top-1/2 left-1/2 w-4 h-4 bg-purple-500 rounded-full border-4 border-[#0a0a0a] transform -translate-x-1/2 -translate-y-1/2 z-20 shadow-[0_0_15px_rgba(168,85,247,0.6)]"></div>

                        {/* Dot on the timeline - Mobile */}
                        <div className="md:hidden absolute top-8 left-8 w-4 h-4 bg-purple-500 rounded-full border-4 border-[#0a0a0a] transform -translate-x-1/2 z-20 shadow-[0_0_15px_rgba(168,85,247,0.6)]"></div>

                        {/* Garis Cabang Vertikal - Desktop */}
                        <div
                          className={`hidden md:block absolute left-1/2 w-px bg-gradient-to-b from-purple-500/50 to-transparent transform -translate-x-1/2 ${isTop ? "bottom-1/2 h-16 bg-gradient-to-t" : "top-1/2 h-16"}`}
                        ></div>

                        {/* Garis Cabang Horizontal - Mobile */}
                        <div className="md:hidden absolute top-[2.2rem] left-8 w-12 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>

                        {/* Card Konten */}
                        <div
                          className={`w-full bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 transform group md:absolute md:left-0 md:right-0 ${isTop ? "md:bottom-[calc(50%+2.5rem)]" : "md:top-[calc(50%+2.5rem)]"}`}
                        >
                          <div>
                            <span className="inline-block text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md mb-2">
                              {exp.position}
                            </span>
                            <h3 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors leading-tight">
                              {exp.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="w-full text-center text-neutral-500 italic py-10 md:absolute md:top-1/2 md:-translate-y-1/2">
                  Belum ada data pengalaman. Tambahkan di menu Pengaturan
                  dashboard.
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* PROJECTS PREVIEW */}
      <section
        id="projects"
        className="py-24 px-4 md:px-12 max-w-7xl mx-auto border-t border-white/5 text-center"
      >
        <ScrollReveal>
          <div className="mb-16">
            <span className="px-3 py-1 border border-purple-500/30 bg-purple-500/5 rounded-full text-xs text-purple-400 uppercase mb-4 inline-block">
              Portfolio
            </span>
            <h2 className="text-4xl font-medium text-white">Proyek Unggulan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {projects.slice(0, 2).map((proj) => (
              <div
                key={proj.id}
                className="group relative rounded-2xl overflow-hidden aspect-video bg-neutral-900 border border-white/5 shadow-xl cursor-pointer"
                onClick={() => onSelectItem(proj)}
              >
                <img
                  src={
                    proj.img ||
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={proj.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />

                {/* Background Gradient */}

                {/* Text Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 flex flex-col justify-end z-10 pointer-events-none">
                  <div className="transform transition-transform duration-300 group-hover:-translate-y-12">
                    <h4 className="text-white font-medium group-hover:text-purple-400 transition-colors text-xl">
                      {proj.title}
                    </h4>
                    <p className="text-neutral-400 text-sm line-clamp-2 mt-1">
                      {proj.desc || proj.description}
                    </p>

                    {/* Tech Stack */}
                    {proj.tech && proj.tech.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {proj.tech.slice(0, 3).map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium border px-2 py-0.5 rounded-full bg-white/10 border-white/10 text-neutral-300"
                          >
                            {t}
                          </span>
                        ))}
                        {proj.tech.length > 3 && (
                          <span className="text-[10px] font-medium border px-2 py-0.5 rounded-full bg-white/10 border-white/10 text-neutral-300">
                            +{proj.tech.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto transform translate-y-4 group-hover:translate-y-0">
                    {proj.demo_url && (
                      <a
                        href={proj.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-lg transition-colors shadow-lg"
                      >
                        {proj.category === "Game" ? (
                          <ItchIcon size={14} />
                        ) : (
                          <ExternalLink size={14} />
                        )}{" "}
                        Kunjungi
                      </a>
                    )}
                    {proj.github_url && (
                      <a
                        href={proj.github_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-medium rounded-lg transition-colors"
                      >
                        <GithubIcon size={14} /> GitHub
                      </a>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectItem?.(proj);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-300 hover:text-white text-xs font-medium rounded-lg transition-colors ml-auto"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <button
              id="home-all-projects-btn"
              onClick={() => {
                onViewAll("projects");
                window.scrollTo(0, 0);
              }}
              className="text-purple-400 flex items-center gap-2 mx-auto hover:gap-4 transition-all uppercase text-xs tracking-widest font-bold"
            >
              Semua Proyek <ChevronRight size={16} />
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* EXPERIENCES PREVIEW */}
      <section
        id="experiences"
        className="py-24 px-4 md:px-12 max-w-7xl mx-auto border-t border-white/5 text-center"
      >
        <ScrollReveal>
          <h2 className="text-4xl font-medium text-white mb-16">Galeri</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {experiences.slice(0, 4).map((exp, idx) => (
              <div
                key={idx}
                id={`home-exp-${idx}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-neutral-900 border border-white/5 cursor-pointer shadow-xl"
                onClick={() => onSelectItem(exp)}
              >
                <img
                  src={exp.img}
                  alt={exp.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
                  <h4 className="text-white font-medium group-hover:text-purple-400 transition-colors">
                    {exp.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
          <button
            id="home-all-exp-btn"
            onClick={() => {
              onViewAll("experiences");
              window.scrollTo(0, 0);
            }}
            className="mt-12 text-purple-400 uppercase text-xs tracking-widest font-bold"
          >
            View All Experience
          </button>
        </ScrollReveal>
      </section>

      {/* CERTIFICATES PREVIEW */}
      <section
        id="certificates"
        className="py-24 px-4 md:px-12 max-w-7xl mx-auto border-t border-white/5 text-center"
      >
        <ScrollReveal>
          <h2 className="text-4xl font-medium text-white mb-16">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {certificates.slice(0, 2).map((cert, idx) => (
              <div
                key={idx}
                id={`home-cert-${idx}`}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 flex items-center gap-6 group hover:border-purple-500/30 transition-all cursor-pointer shadow-2xl hover:shadow-purple-600/10"
                onClick={() => onSelectItem(cert)}
              >
                <div className="w-24 h-24 bg-neutral-900 rounded-xl overflow-hidden shrink-0 hidden sm:block">
                  <img
                    src={cert.gambar_url || cert.img}
                    alt={cert.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all"
                  />
                </div>
                <div>
                  <span className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-1 block">
                    {cert.category}
                  </span>
                  <h4 className="text-lg text-white font-medium mb-1 group-hover:text-purple-400 transition-colors">
                    {cert.title}
                  </h4>
                  <p className="text-xs text-neutral-500">{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            id="home-all-certs-btn"
            onClick={() => {
              onViewAll("certificates");
              window.scrollTo(0, 0);
            }}
            className="mt-12 text-purple-400 uppercase text-xs tracking-widest font-bold"
          >
            All Certificates
          </button>
        </ScrollReveal>
      </section>

      {/* CONTACT SECTION */}
      <section
        id="contact"
        className="py-24 px-4 md:px-12 max-w-4xl mx-auto text-center border-t border-white/5"
      >
        <ScrollReveal>
          <h2 className="text-4xl font-medium text-white mb-6">Contact Me</h2>
          <p className="text-neutral-400 mb-10 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Tertarik untuk berkolaborasi, berdiskusi, atau memiliki proyek
            menarik? Jangan ragu untuk menyapa melalui email atau terhubung di
            media sosial.
          </p>
          <div className="max-w-xl mx-auto mb-12">
            <form
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden text-left flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name");
                const message = formData.get("message");
                const subject = `Pesan dari ${name} via Portfolio`;
                window.location.href = `mailto:adityarajadana@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message as string)}`;
              }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />

              <div className="relative z-10">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 block">
                  Nama Anda
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name..."
                  required
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
                />
              </div>

              <div className="relative z-10">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 block">
                  Pesan
                </label>
                <textarea
                  name="message"
                  placeholder="Write your message or proposal..."
                  required
                  rows={4}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none shadow-inner"
                ></textarea>
              </div>

              <button
                type="submit"
                className="relative z-10 w-full bg-purple-600 text-white font-bold rounded-xl px-5 py-4 transition-all shadow-lg shadow-purple-500/25 mt-2 flex items-center justify-center gap-2 group"
              >
                <Mail
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                Send Message via Email
              </button>
            </form>
          </div>

          <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-6">
            Or Find Me On
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://linkedin.com/in/adityarajadana"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/50 text-neutral-300 hover:text-white px-5 py-2.5 rounded-full transition-all duration-300"
            >
              <LinkedinIcon size={16} />
              <span className="font-medium text-xs">LinkedIn</span>
            </a>
            <a
              href="https://github.com/adityarajadana"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/20 border border-white/10 hover:border-white/50 text-neutral-300 hover:text-white px-5 py-2.5 rounded-full transition-all duration-300"
            >
              <GithubIcon size={16} />
              <span className="font-medium text-xs">GitHub</span>
            </a>
            <a
              href="https://instagram.com/adityarajadana"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-white/5 hover:bg-pink-600/20 border border-white/10 hover:border-pink-500/50 text-neutral-300 hover:text-white px-5 py-2.5 rounded-full transition-all duration-300"
            >
              <InstagramIcon size={16} />
              <span className="font-medium text-xs">Instagram</span>
            </a>
          </div>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center border-t border-white/5 relative z-10 text-neutral-500 text-sm">
        <p>
          © {new Date().getFullYear()} Aditya Rajadana Hernadi. Powered by
          Next.js &amp; Supabase.
        </p>
      </footer>
    </>
  );
}
