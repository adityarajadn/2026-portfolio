"use client";

import { useState, useEffect } from "react";
import { fetchData, insertData, updateData, deleteData, uploadImage } from "@/app/lib/supabase";
import { Plus, Pencil, Trash2, GripVertical, ExternalLink } from "lucide-react";
import Modal from "@/app/components/ui/Modal";
import Image from "next/image";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [globalTechs, setGlobalTechs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    demo_url: "",
    github_url: "",
    tech: [] as string[],
    image: "",
    file: null as File | null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const pRes = await fetchData("projects") || [];
    const sRes = await fetchData("settings") || [];

    const techsSetting = sRes.find((s: any) => s.key === "tech_stacks");
    setGlobalTechs(techsSetting?.value?.split(",") || []);

    const normalized = pRes.map((p: any) => ({
      id: p.id,
      title: p.title,
      category: p.category || "",
      description: p.description || "",
      demo_url: p.demo_url || "",
      github_url: p.github_url || "",
      tech_stack: p.tech_stack || [],
      image_url: p.image_url || "",
      sort_order: p.sort_order || 0,
    }));
    setProjects(normalized.sort((a, b) => a.sort_order - b.sort_order));
    setIsLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl, file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = formData.image;
    if (formData.file) {
      const uploadRes = await uploadImage(formData.file);
      if (uploadRes.success && uploadRes.url) imageUrl = uploadRes.url;
    }

    const payload = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      demo_url: formData.demo_url,
      github_url: formData.github_url,
      tech_stack: formData.tech,
      image_url: imageUrl,
    };

    if (editingId) {
      await updateData("projects", editingId, payload);
    } else {
      await insertData("projects", payload);
    }

    setIsModalOpen(false);
    setEditingId(null);
    loadData();
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    await deleteData("projects", deleteConfirmId);
    setDeleteConfirmId(null);
    loadData();
  };

  const openModal = () => {
    setEditingId(null);
    setFormData({
      title: "",
      category: "",
      description: "",
      demo_url: "",
      github_url: "",
      tech: [],
      image: "",
      file: null,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      demo_url: item.demo_url,
      github_url: item.github_url,
      tech: item.tech_stack,
      image: item.image_url,
      file: null,
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Projects</h2>
            <p className="text-neutral-400 text-sm">Manage your projects</p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-purple-500/20"
          >
            <Plus size={18} />
            Add Project
          </button>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="bg-[#111] border border-white/5 rounded-2xl p-12 text-center text-neutral-500">
              Loading...
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-[#111] border border-white/5 rounded-2xl p-12 text-center text-neutral-500">
              No projects yet
            </div>
          ) : (
            projects.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", item.id.toString());
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  const draggedId = Number(e.dataTransfer.getData("text/plain"));
                  if (!draggedId || draggedId === item.id) return;

                  const draggedIdx = projects.findIndex((d) => d.id === draggedId);
                  const targetIdx = projects.findIndex((d) => d.id === item.id);

                  if (draggedIdx === -1 || targetIdx === -1) return;

                  const newProj = [...projects];
                  const draggedItem = newProj[draggedIdx];
                  newProj.splice(draggedIdx, 1);
                  newProj.splice(targetIdx, 0, draggedItem);

                  setProjects(newProj);

                  for (let i = 0; i < newProj.length; i++) {
                    await updateData("projects", newProj[i].id, { sort_order: i });
                  }
                }}
                className="flex items-center gap-4 p-4 bg-[#111] rounded-xl border border-white/5 cursor-move hover:border-purple-500/30 transition-colors"
              >
                <div className="text-neutral-500 hover:text-white transition-colors">
                  <GripVertical size={20} />
                </div>
                <div className="w-20 h-14 bg-[#1a1a1a] rounded-lg border border-white/5 overflow-hidden relative flex-shrink-0">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-500 text-xs">Img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white mb-1 truncate">{item.title}</p>
                  <p className="text-xs text-purple-400 truncate">{item.category}</p>
                  <p className="text-neutral-400 text-xs mt-1 line-clamp-1">{item.description}</p>
                  {item.tech_stack && item.tech_stack.length > 0 && (
                    <p className="text-[10px] text-neutral-500 mt-1">{item.tech_stack.join(", ")}</p>
                  )}
                </div>
                {item.demo_url && (
                  <a
                    href={item.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-lg bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                <div className="flex items-center gap-2">
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
              </div>
            ))
          )}
        </div>
      </div>

      {deleteConfirmId && (
        <Modal isOpen={true} onClose={() => setDeleteConfirmId(null)}>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Delete Project?</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 md:p-8 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">{editingId ? "Edit" : "Add"} Project</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-neutral-400 mb-1">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">Demo URL</label>
              <input
                type="url"
                value={formData.demo_url}
                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-1">GitHub URL</label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-2">Tech Stack</label>
              <div className="flex flex-wrap gap-2">
                {globalTechs.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => {
                      if (formData.tech.includes(tech)) {
                        setFormData({ ...formData, tech: formData.tech.filter((t) => t !== tech) });
                      } else {
                        setFormData({ ...formData, tech: [...formData.tech, tech] });
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

            <div>
              <label className="block text-sm text-neutral-400 mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
              >
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
