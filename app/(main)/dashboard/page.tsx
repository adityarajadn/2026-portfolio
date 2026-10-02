"use client";

import { useState, useEffect } from "react";
import { fetchData, updateData, insertData, deleteData, upsertData } from "@/app/lib/supabase";
import { Trash2, Pencil, X, Plus } from "lucide-react";

export default function DashboardSettingsPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingOrg, setEditingOrg] = useState<any | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const oRes = await fetchData("organizations") || [];
    const tRes = await fetchData("timelines") || [];
    const sRes = await fetchData("settings") || [];

    const normalized = [
      ...oRes.map((o: any) => ({ id: o.id, type: 'organization', title: o.name, position: o.period || '', description: o.role || '', link: '', sort_order: o.sort_order || 0, image: o.icon_url || '' })),
      ...tRes.map((t: any) => ({ id: t.id, type: 'timeline', title: t.name, position: t.period || '', description: '', link: '', sort_order: t.sort_order || 0, image: '' })),
      ...sRes.map((s: any) => ({ id: s.id, type: 'setting', title: s.key, position: '', description: '', link: s.value || '', sort_order: 0, image: '' }))
    ];
    setData(normalized);
    setIsLoading(false);
  };

  const categoriesSetting = data.find(d => d.type === "setting" && d.title === "categories");
  const globalCategories: string[] = categoriesSetting && categoriesSetting.link ? categoriesSetting.link.split(",") : ["Web", "Game", "Mobile", "UI/UX", "Data Science"];

  const techsSetting = data.find(d => d.type === "setting" && d.title === "tech_stacks");
  const globalTechs: string[] = techsSetting && techsSetting.link ? techsSetting.link.split(",") : ["React", "Next.js", "Tailwind", "Node.js", "TypeScript", "Supabase", "PostgreSQL", "Unity", "C#", "Godot", "Figma", "UI/UX"];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Pengaturan Kategori */}
      <div className="bg-[#111] p-8 rounded-2xl border border-white/5 shadow-2xl mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Kategori Portofolio</h2>
        <p className="text-neutral-400 text-sm mb-6">Kelola daftar kategori yang dapat dipilih pada saat menambahkan Proyek, Sertifikat, dan Galeri.</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {globalCategories.map((cat, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-purple-600/20 text-purple-300 px-3 py-1.5 rounded-full text-sm font-medium border border-purple-500/30">
              {cat}
              <button type="button" onClick={async () => {
                const newCats = globalCategories.filter(c => c !== cat);
                await upsertData("settings", { key: "categories", value: newCats.join(",") }, "key");
                loadData();
              }} className="hover:text-red-400 transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        
        <form onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const input = form.elements.namedItem("new_category") as HTMLInputElement;
          if (!input.value.trim()) return;
          const newCat = input.value.trim();
          if (globalCategories.includes(newCat)) { alert("Kategori sudah ada!"); return; }
          const newCats = [...globalCategories, newCat];
          await upsertData("settings", { key: "categories", value: newCats.join(",") }, "key");
          input.value = "";
          loadData();
        }} className="flex gap-3">
          <input type="text" name="new_category" placeholder="Kategori baru (ex: Backend)..." className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm" />
          <button type="submit" className="bg-purple-600 text-white font-medium rounded-xl px-6 py-3 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20 text-sm">
            Tambah
          </button>
        </form>
      </div>

      {/* Pengaturan Tech Stack */}
      <div className="bg-[#111] p-8 rounded-2xl border border-white/5 shadow-2xl mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Pengaturan Tech Stack</h2>
        <p className="text-neutral-400 text-sm mb-6">Kelola daftar Tech Stack yang dapat dipilih pada saat menambahkan Proyek.</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {globalTechs.map((tech, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-purple-600/20 text-purple-300 px-3 py-1.5 rounded-full text-sm font-medium border border-purple-500/30">
              {tech}
              <button type="button" onClick={async () => {
                const newTechs = globalTechs.filter(t => t !== tech);
                await upsertData("settings", { key: "tech_stacks", value: newTechs.join(",") }, "key");
                loadData();
              }} className="hover:text-red-400 transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        
        <form onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const input = form.elements.namedItem("new_tech") as HTMLInputElement;
          if (!input.value.trim()) return;
          const newTech = input.value.trim();
          if (globalTechs.includes(newTech)) { alert("Tech Stack sudah ada!"); return; }
          const newTechs = [...globalTechs, newTech];
          await upsertData("settings", { key: "tech_stacks", value: newTechs.join(",") }, "key");
          input.value = "";
          loadData();
        }} className="flex gap-3">
          <input type="text" name="new_tech" placeholder="Tech Stack baru (ex: Prisma)..." className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm" />
          <button type="submit" className="bg-purple-600 text-white font-medium rounded-xl px-6 py-3 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20 text-sm">
            Tambah
          </button>
        </form>
      </div>

      {/* Sosmed */}
      <div className="bg-[#111] p-8 rounded-2xl border border-white/5 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Pengaturan Link Sosial Media</h2>
        <p className="text-neutral-400 text-sm mb-8">Atur link tujuan untuk icon sosmed yang tampil di halaman beranda.</p>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const github = (form.elements.namedItem("github") as HTMLInputElement).value;
          const linkedin = (form.elements.namedItem("linkedin") as HTMLInputElement).value;
          const instagram = (form.elements.namedItem("instagram") as HTMLInputElement).value;
          const email = (form.elements.namedItem("email") as HTMLInputElement).value;

          const updates = [
            { title: "github", link: github },
            { title: "linkedin", link: linkedin },
            { title: "instagram", link: instagram },
            { title: "email", link: email },
          ];

          for (const u of updates) {
            await upsertData("settings", { key: u.title, value: u.link }, "key");
          }
          alert("Pengaturan berhasil disimpan!");
          loadData();
        }} className="space-y-6">
          {[
            { name: "github", label: "GitHub URL", placeholder: "https://github.com/..." },
            { name: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/..." },
            { name: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/..." },
            { name: "email", label: "Email Address", placeholder: "mailto:..." },
          ].map((field) => {
            const existingValue = data.find((d) => d.type === "setting" && d.title === field.name)?.link || "";
            return (
              <div key={field.name}>
                <label className="block text-sm text-neutral-400 mb-1">{field.label}</label>
                <input name={field.name} type="text" defaultValue={existingValue} className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors" placeholder={field.placeholder} />
              </div>
            );
          })}
          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-purple-600 text-white font-medium rounded-xl px-8 py-3 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20">
              Simpan Link Sosmed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
