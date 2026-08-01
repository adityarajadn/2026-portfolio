"use client";

import { ArrowLeft } from "lucide-react";

interface Experience {
  id?: string;
  title: string;
  img: string;
  desc?: string;
  description?: string;
}

interface ExperiencesViewProps {
  experiences: Experience[];
  onBack: () => void;
  onSelect: (item: Experience) => void;
}

export default function ExperiencesView({ experiences, onBack, onSelect }: ExperiencesViewProps) {
  return (
    <section className="pt-40 pb-32 px-4 md:px-12 max-w-7xl mx-auto min-h-screen text-left">
      <button
        id="experiences-back-btn"
        onClick={onBack}
        className="group flex items-center gap-2 text-neutral-400 mb-12 hover:text-white transition-all bg-white/5 px-5 py-2.5 rounded-full w-fit border border-white/5"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Kembali
      </button>
      <h1 className="text-5xl md:text-6xl font-medium mb-12 text-white tracking-tight">Galeri</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            id={`exp-card-${idx}`}
            className="group relative rounded-[2rem] overflow-hidden aspect-square bg-white/5 backdrop-blur-xl border border-white/10 cursor-pointer shadow-2xl hover:shadow-purple-600/10"
            onClick={() => onSelect(exp)}
          >
            <img
              src={exp.img}
              alt={exp.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent p-8 flex flex-col justify-end">
              <h4 className="text-xl font-medium text-white">{exp.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
