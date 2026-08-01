"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  fetchData,
  insertData,
  updateData,
  deleteData,
  uploadImage,
} from "../../lib/supabase";
import {
  Camera,
  Award,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  User,
  Upload,
  Settings,
  Briefcase,
  GripVertical,
} from "lucide-react";
import Modal from "../_components/Modal";
import Image from "next/image";

interface PortfolioItem {
  id: number;
  type: string;
  title: string;
  position: string;
  description: string;
  link: string;
  image: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pengaturan");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    position: "",
    description: "",
    link: "",
    image: "",
    tech: [] as string[],
    file: null as File | null,
  });

  const [data, setData] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingOrg, setEditingOrg] = useState<PortfolioItem | null>(null);
  const [editingTimeline, setEditingTimeline] = useState<PortfolioItem | null>(
    null,
  );

  // Load data dari Supabase saat komponen di-mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const result = await fetchData("portfolio_items");
    if (result) setData(result as PortfolioItem[]);
    setIsLoading(false);
  };

  const filteredData = data.filter((item) => item.type === activeTab);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Membuat URL sementara untuk preview gambar secara lokal
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl, file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = formData.image;

    // Jika ada file baru yang diunggah
    if (formData.file) {
      const uploadRes = await uploadImage(formData.file);
      if (uploadRes.success && uploadRes.url) {
        imageUrl = uploadRes.url;
      }
    }

    const finalDesc =
      activeTab === "proyek" && formData.tech.length > 0
        ? `${formData.description}|||TECH:${formData.tech.join(",")}`
        : formData.description;

    const payload = {
      type: activeTab,
      title: formData.title,
      position: formData.position,
      description: finalDesc,
      link: formData.link,
      image: imageUrl,
    };

    if (editingId) {
      const res = await updateData("portfolio_items", editingId, payload);
      if (res.success) {
        setData(
          data.map((item) =>
            item.id === editingId ? { ...item, ...payload } : item,
          ),
        );
      }
    } else {
      const res = await insertData("portfolio_items", payload);
      if (res.success && res.data) {
        setData([res.data[0] as PortfolioItem, ...data]);
      }
    }

    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      title: "",
      position: "",
      description: "",
      link: "",
      image: "",
      tech: [],
      file: null,
    });
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    const res = await deleteData("portfolio_items", deleteConfirmId);
    if (res.success) {
      setData(data.filter((item) => item.id !== deleteConfirmId));
    }
    setDeleteConfirmId(null);
  };

  const openModal = () => {
    setEditingId(null);
    setFormData({
      title: "",
      position: "",
      description: "",
      link: "",
      image: "",
      tech: [],
      file: null,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    const descParts = (item.description || "").split("|||TECH:");
    setFormData({
      title: item.title,
      position: item.position,
      description: descParts[0],
      link: item.link || "",
      image: item.image || "",
      tech: descParts[1] ? descParts[1].split(",") : [],
      file: null,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
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
          <button
            onClick={() => setActiveTab("pengalaman")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "pengalaman"
                ? "bg-purple-500/10 text-purple-400 font-medium"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Camera size={18} />
            <span className="text-sm">Galeri</span>
          </button>

          <button
            onClick={() => setActiveTab("sertifikat")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "sertifikat"
                ? "bg-purple-500/10 text-purple-400 font-medium"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Award size={18} />
            <span className="text-sm">Certificates</span>
          </button>

          <button
            onClick={() => setActiveTab("proyek")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "proyek"
                ? "bg-purple-500/10 text-purple-400 font-medium"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Briefcase size={18} />
            <span className="text-sm">Projects</span>
          </button>

          <button
            onClick={() => setActiveTab("pengaturan")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "pengaturan"
                ? "bg-purple-500/10 text-purple-400 font-medium"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings size={18} />
            <span className="text-sm">Pengaturan</span>
          </button>
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

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === "pengaturan" ? (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-[#111] p-8 rounded-2xl border border-white/5 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">
                Pengaturan Link Sosial Media
              </h2>
              <p className="text-neutral-400 text-sm mb-8">
                Atur link tujuan untuk icon sosmed yang tampil di halaman
                beranda.
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const github = (
                    form.elements.namedItem("github") as HTMLInputElement
                  ).value;
                  const linkedin = (
                    form.elements.namedItem("linkedin") as HTMLInputElement
                  ).value;
                  const instagram = (
                    form.elements.namedItem("instagram") as HTMLInputElement
                  ).value;
                  const email = (
                    form.elements.namedItem("email") as HTMLInputElement
                  ).value;

                  const settings = data.filter((d) => d.type === "setting");
                  const updates = [
                    { title: "github", link: github },
                    { title: "linkedin", link: linkedin },
                    { title: "instagram", link: instagram },
                    { title: "email", link: email },
                  ];

                  for (const u of updates) {
                    const existing = settings.find((s) => s.title === u.title);
                    if (existing) {
                      if (existing.link !== u.link) {
                        await updateData("portfolio_items", existing.id, {
                          link: u.link,
                        });
                      }
                    } else {
                      await insertData("portfolio_items", {
                        type: "setting",
                        title: u.title,
                        link: u.link,
                        position: "",
                        description: "",
                        image: "",
                      });
                    }
                  }
                  alert("Pengaturan berhasil disimpan!");
                  loadData();
                }}
                className="space-y-6"
              >
                {[
                  {
                    name: "github",
                    label: "GitHub URL",
                    placeholder: "https://github.com/...",
                  },
                  {
                    name: "linkedin",
                    label: "LinkedIn URL",
                    placeholder: "https://linkedin.com/in/...",
                  },
                  {
                    name: "instagram",
                    label: "Instagram URL",
                    placeholder: "https://instagram.com/...",
                  },
                  {
                    name: "email",
                    label: "Email Address",
                    placeholder: "mailto:...",
                  },
                ].map((field) => {
                  const existingValue =
                    data.find(
                      (d) => d.type === "setting" && d.title === field.name,
                    )?.link || "";
                  return (
                    <div key={field.name}>
                      <label className="block text-sm text-neutral-400 mb-1">
                        {field.label}
                      </label>
                      <input
                        name={field.name}
                        type="text"
                        defaultValue={existingValue}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder={field.placeholder}
                      />
                    </div>
                  );
                })}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-purple-600 text-white font-medium rounded-xl px-8 py-3 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20"
                  >
                    Simpan Link Sosmed
                  </button>
                </div>
              </form>
            </div>

            {/* Organisasi Panel */}
            <div className="bg-[#111] p-8 rounded-2xl border border-white/5 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">
                Organisasi & Komunitas
              </h2>
              <p className="text-neutral-400 text-sm mb-6">
                Add organizations or communities you have joined.
              </p>

              <form
                key={editingOrg?.id || "new"}
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const nama = (
                    form.elements.namedItem("org_name") as HTMLInputElement
                  ).value;
                  const role = (
                    form.elements.namedItem("org_role") as HTMLInputElement
                  ).value;
                  const tahun = (
                    form.elements.namedItem("org_year") as HTMLInputElement
                  ).value;
                  const icon = (
                    form.elements.namedItem("org_icon") as HTMLInputElement
                  ).value;

                  if (editingOrg) {
                    await updateData("portfolio_items", editingOrg.id, {
                      title: nama,
                      position: tahun,
                      image: icon,
                      description: role,
                    });
                    setEditingOrg(null);
                  } else {
                    await insertData("portfolio_items", {
                      type: "organization",
                      title: nama,
                      position: tahun,
                      image: icon,
                      description: role,
                      link: "",
                    });
                  }

                  form.reset();
                  loadData();
                }}
                className="flex flex-col gap-6 mb-8 p-6 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1.5">
                      Organization Name
                    </label>
                    <input
                      name="org_name"
                      required
                      type="text"
                      defaultValue={editingOrg?.title || ""}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Misal: Google Developer Student Clubs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1.5">
                      Posisi / Jabatan
                    </label>
                    <input
                      name="org_role"
                      required
                      type="text"
                      defaultValue={editingOrg?.description || ""}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Misal: Member / Ketua"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1.5">
                      Year Aktif
                    </label>
                    <input
                      name="org_year"
                      required
                      type="text"
                      defaultValue={editingOrg?.position || ""}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Misal: 2023 - Sekarang"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1.5">
                      URL Logo (Opsional)
                    </label>
                    <input
                      name="org_icon"
                      type="text"
                      defaultValue={editingOrg?.image || ""}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  {editingOrg && (
                    <button
                      type="button"
                      onClick={() => setEditingOrg(null)}
                      className="bg-white/10 text-white font-medium rounded-lg px-6 py-2.5 text-sm hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-purple-600 text-white font-medium rounded-lg px-6 py-2.5 text-sm hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20"
                  >
                    {editingOrg ? "Save Changes" : "Add Organization"}
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                {[...data]
                  .filter((d) => d.type === "organization")
                  .sort(
                    (a, b) =>
                      parseInt(a.link || "999") - parseInt(b.link || "999"),
                  )
                  .map((org) => (
                    <div
                      key={org.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", org.id.toString());
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const draggedId = Number(
                          e.dataTransfer.getData("text/plain"),
                        );
                        if (!draggedId || draggedId === org.id) return;

                        const currentOrg = [...data]
                          .filter((d) => d.type === "organization")
                          .sort(
                            (a, b) =>
                              parseInt(a.link || "999") -
                              parseInt(b.link || "999"),
                          );

                        const draggedIdx = currentOrg.findIndex(
                          (d) => d.id === draggedId,
                        );
                        const targetIdx = currentOrg.findIndex(
                          (d) => d.id === org.id,
                        );

                        if (draggedIdx === -1 || targetIdx === -1) return;

                        const draggedItemObj = currentOrg[draggedIdx];
                        currentOrg.splice(draggedIdx, 1);
                        currentOrg.splice(targetIdx, 0, draggedItemObj);

                        const newData = data.map((d) => {
                          if (d.type === "organization") {
                            const index = currentOrg.findIndex(
                              (t) => t.id === d.id,
                            );
                            return { ...d, link: index.toString() };
                          }
                          return d;
                        });
                        setData(newData);

                        Promise.all(
                          currentOrg.map((item, i) =>
                            updateData("portfolio_items", item.id, {
                              link: i.toString(),
                            }),
                          ),
                        );
                      }}
                      className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-white/5 cursor-move hover:border-purple-500/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-neutral-500 hover:text-white transition-colors px-2">
                          <GripVertical size={20} />
                        </div>
                        {org.image ? (
                          <img
                            src={org.image}
                            alt={org.title}
                            className="w-10 h-10 rounded-full object-cover bg-white/10 p-1 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold shrink-0">
                            {org.title.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-white font-medium">
                            {org.title}
                          </h4>
                          {org.description && (
                            <p className="text-xs text-purple-400 mb-0.5">
                              {org.description}
                            </p>
                          )}
                          <p className="text-[10px] text-neutral-500">
                            {org.position}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingOrg(org);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="text-blue-400 hover:bg-blue-500/20 p-2 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(org.id)}
                          className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Timeline Panel */}
            <div className="bg-[#111] p-8 rounded-2xl border border-white/5 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">
                Riwayat Pendidikan
              </h2>
              <p className="text-neutral-400 text-sm mb-6">
                Tambahkan pengalaman karir atau perjalanan yang akan muncul di
                timeline horizontal.
              </p>

              <form
                key={editingTimeline?.id || "new"}
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const nama = (
                    form.elements.namedItem("tl_name") as HTMLInputElement
                  ).value;
                  const tahun = (
                    form.elements.namedItem("tl_year") as HTMLInputElement
                  ).value;

                  if (editingTimeline) {
                    await updateData("portfolio_items", editingTimeline.id, {
                      title: nama,
                      position: tahun,
                      image: "",
                      description: "",
                    });
                    setEditingTimeline(null);
                  } else {
                    await insertData("portfolio_items", {
                      type: "timeline",
                      title: nama,
                      position: tahun,
                      image: "",
                      description: "",
                      link: "",
                    });
                  }

                  form.reset();
                  loadData();
                }}
                className="flex flex-col gap-6 mb-8 p-6 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1.5">
                      Nama Pengalaman / Acara
                    </label>
                    <input
                      name="tl_name"
                      required
                      type="text"
                      defaultValue={editingTimeline?.title || ""}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Misal: Juara 1 Web Design"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1.5">
                      Waktu / Periode
                    </label>
                    <input
                      name="tl_year"
                      required
                      type="text"
                      defaultValue={editingTimeline?.position || ""}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Misal: 2026 - Sekarang"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  {editingTimeline && (
                    <button
                      type="button"
                      onClick={() => setEditingTimeline(null)}
                      className="bg-white/10 text-white font-medium rounded-lg px-6 py-2.5 text-sm hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-purple-600 text-white font-medium rounded-lg px-6 py-2.5 text-sm hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20"
                  >
                    {editingTimeline ? "Save Changes" : "Add Experience"}
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                {[...data]
                  .filter((d) => d.type === "timeline")
                  .sort(
                    (a, b) =>
                      parseInt(a.link || "999") - parseInt(b.link || "999"),
                  )
                  .map((tl) => (
                    <div
                      key={tl.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", tl.id.toString());
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const draggedId = Number(
                          e.dataTransfer.getData("text/plain"),
                        );
                        if (!draggedId || draggedId === tl.id) return;

                        const currentTimeline = [...data]
                          .filter((d) => d.type === "timeline")
                          .sort(
                            (a, b) =>
                              parseInt(a.link || "999") -
                              parseInt(b.link || "999"),
                          );

                        const draggedIdx = currentTimeline.findIndex(
                          (d) => d.id === draggedId,
                        );
                        const targetIdx = currentTimeline.findIndex(
                          (d) => d.id === tl.id,
                        );

                        if (draggedIdx === -1 || targetIdx === -1) return;

                        const draggedItemObj = currentTimeline[draggedIdx];
                        currentTimeline.splice(draggedIdx, 1);
                        currentTimeline.splice(targetIdx, 0, draggedItemObj);

                        const newData = data.map((d) => {
                          if (d.type === "timeline") {
                            const index = currentTimeline.findIndex(
                              (t) => t.id === d.id,
                            );
                            return { ...d, link: index.toString() };
                          }
                          return d;
                        });
                        setData(newData);

                        Promise.all(
                          currentTimeline.map((item, i) =>
                            updateData("portfolio_items", item.id, {
                              link: i.toString(),
                            }),
                          ),
                        );
                      }}
                      className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-white/5 cursor-move hover:border-purple-500/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-neutral-500 hover:text-white transition-colors px-2">
                          <GripVertical size={20} />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{tl.title}</h4>
                          <p className="text-[10px] text-purple-400 mt-1">
                            {tl.position}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingTimeline(tl);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="text-blue-400 hover:bg-blue-500/20 p-2 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(tl.id)}
                          className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 capitalize">
                  {activeTab}
                </h2>
                <p className="text-neutral-400 text-sm">
                  Kelola data {activeTab} Anda untuk ditampilkan di halaman
                  utama
                </p>
              </div>
              <button
                onClick={openModal}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-purple-500/20"
              >
                <Plus size={18} />
                Tambah{" "}
                {activeTab === "pengalaman"
                  ? "Galeri"
                  : activeTab === "sertifikat"
                    ? "Sertifikat"
                    : "Proyek"}
              </button>
            </div>

            {/* Table Area */}
            <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02] text-xs uppercase tracking-wider text-neutral-400">
                      <th className="px-6 py-4 font-medium">Gambar</th>
                      <th className="px-6 py-4 font-medium">Title & Posisi</th>
                      <th className="px-6 py-4 font-medium w-1/3">Description</th>
                      <th className="px-6 py-4 font-medium">Link</th>
                      <th className="px-6 py-4 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-neutral-500"
                        >
                          Memuat data...
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-neutral-500"
                        >
                          Belum ada data {activeTab}.
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-white/[0.01] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="w-16 h-12 bg-[#1a1a1a] rounded-lg border border-white/5 overflow-hidden relative">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-500 text-xs">
                                  Img
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-white mb-1">
                              {item.title}
                            </p>
                            <p className="text-xs text-purple-400">
                              {item.position}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-neutral-400 line-clamp-2">
                              {item.description}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            {item.link ? (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center p-2 rounded-lg bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
                              >
                                <ExternalLink size={16} />
                              </a>
                            ) : (
                              <span className="text-neutral-600">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-2 rounded-lg text-neutral-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Tambah Data */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? "Edit" : "Tambah"}{" "}
            {activeTab === "pengalaman"
              ? "Galeri"
              : activeTab === "sertifikat"
                ? "Sertifikat"
                : "Proyek"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Contoh: Juara 1 Web Design"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  {activeTab === "proyek"
                    ? "Category"
                    : activeTab === "sertifikat"
                      ? "Issuer / Penyelenggara"
                      : "Posisi / Peran"}
                </label>
                <input
                  type="text"
                  required
                  list="category-options"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder={
                    activeTab === "proyek"
                      ? "Contoh: Web, Game, Mobile, dll"
                      : activeTab === "sertifikat"
                        ? "Contoh: Dicoding, Coursera"
                        : "Contoh: Peserta, Programmer"
                  }
                />
                {activeTab === "proyek" && (
                  <datalist id="category-options">
                    <option value="Web" />
                    <option value="Game" />
                    <option value="Mobile" />
                    <option value="UI/UX" />
                    <option value="Data Science" />
                  </datalist>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Descriptionkan momen ini..."
              />
            </div>

            {activeTab === "proyek" && (
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Tech Stack (Opsional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "React",
                    "Next.js",
                    "Tailwind",
                    "Node.js",
                    "TypeScript",
                    "Supabase",
                    "PostgreSQL",
                    "Unity",
                    "C#",
                    "Godot",
                    "Figma",
                    "UI/UX",
                  ].map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => {
                        if (formData.tech.includes(tech)) {
                          setFormData({
                            ...formData,
                            tech: formData.tech.filter((t) => t !== tech),
                          });
                        } else {
                          setFormData({
                            ...formData,
                            tech: [...formData.tech, tech],
                          });
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        formData.tech.includes(tech)
                          ? "bg-purple-600 border-purple-500 text-white"
                          : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Link (Opsional)
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">
                Foto / Gambar
              </label>
              <label className="block border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer bg-[#1a1a1a]">
                {formData.image ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={24} className="text-neutral-500" />
                    <p className="text-sm text-neutral-400">
                      Klik untuk upload foto
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="pt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-medium text-neutral-400 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-600 text-white font-medium rounded-xl px-6 py-2.5 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal Konfirmasi Delete */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
      >
        <div className="p-6 md:p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
            <Trash2 size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-white">Delete Data</h2>
          <p className="text-neutral-400 mb-8">
            Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat
            dibatalkan.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-6 py-2.5 rounded-xl font-medium text-neutral-400 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="bg-red-500/10 text-red-400 font-medium rounded-xl px-6 py-2.5 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 hover:border-red-500"
            >
              Ya, Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
