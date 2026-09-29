"use client";

import { ArrowLeft } from "lucide-react";

interface Certificate {
  id?: string;
  title: string;
  issuer?: string;
  category?: string;
  gambar_url?: string;
  img?: string;
  desc?: string;
  description?: string;
}

interface CertificatesSectionProps {
  certificates: Certificate[];
  certFilter: string;
  onFilterChange: (f: string) => void;
  onBack: () => void;
  onSelect: (item: Certificate) => void;
}

export default function CertificatesSection({ certificates, certFilter, onFilterChange, onBack, onSelect }: CertificatesSectionProps) {
  const filtered = certFilter === "All" ? certificates : certificates.filter((c) => c.category === certFilter);

  return (
    <section className="pt-20 pb-32 px-4 md:px-12 max-w-7xl mx-auto min-h-screen text-left">
      <button
        id="certs-back-btn"
        onClick={onBack}
        className="group flex items-center gap-2 text-neutral-400 mb-12 hover:text-white transition-all bg-white/5 px-5 py-2.5 rounded-full w-fit border border-white/5"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
      </button>
      <h1 className="text-5xl md:text-6xl font-medium mb-12 text-white tracking-tight">Achievements</h1>
      <div className="flex flex-wrap gap-3 mb-16">
        {["All", "Lomba", "Sertifikasi"].map((cat) => (
          <button
            key={cat}
            id={`cert-filter-${cat.toLowerCase()}`}
            onClick={() => onFilterChange(cat)}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold transition-all border ${
              certFilter === cat
                ? "bg-purple-600 border-purple-600 text-white"
                : "bg-white/5 border-white/10 text-neutral-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((cert, idx) => (
          <div
            key={idx}
            id={`cert-card-${idx}`}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-900 border border-white/5 shadow-xl cursor-pointer"
            onClick={() => onSelect(cert)}
          >
            <img
              src={cert.gambar_url || cert.img}
              alt={cert.title}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6 flex flex-col justify-end z-10">
              <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                {cert.category && (
                  <span className="inline-block text-[10px] font-bold text-purple-400 bg-purple-500/20 px-2.5 py-1 rounded-md mb-2 uppercase">
                    {cert.category}
                  </span>
                )}
                <h4 className="text-xl font-medium text-white mb-1 group-hover:text-purple-400 transition-colors">{cert.title}</h4>
                <p className="text-sm text-neutral-400">{cert.issuer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
