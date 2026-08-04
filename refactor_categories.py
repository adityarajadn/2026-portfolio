import re

def main():
    path = "app/dashboard/page.tsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Add X icon to imports
    if "X," not in content and "X " not in content:
        content = content.replace("GripVertical,\n", "GripVertical,\n  X,\n")

    # 2. Add category to PortfolioItem
    content = content.replace(
        "  position: string;\n  description: string;",
        "  position: string;\n  category?: string;\n  description: string;"
    )

    # 3. Add category to formData state
    content = content.replace(
        "    position: \"\",\n    description: \"\",",
        "    position: \"\",\n    category: \"\",\n    description: \"\","
    )

    # 4. Modify loadData to include category
    content = content.replace(
        "...pRes.map((p: any) => ({ id: p.id, type: 'proyek', title: p.title, position: p.category || '', description: p.description || '', link: p.demo_url || '', image: p.image_url || '', tech: p.tech_stack || [] })),",
        "...pRes.map((p: any) => ({ id: p.id, type: 'proyek', title: p.title, position: p.category || '', category: p.category || '', description: p.description || '', link: p.demo_url || '', image: p.image_url || '', tech: p.tech_stack || [] })),"
    )
    content = content.replace(
        "...eRes.map((e: any) => ({ id: e.id, type: 'pengalaman', title: e.title, position: '', description: e.description || '', link: (e.sort_order || 0).toString(), image: e.image_url || '' })),",
        "...eRes.map((e: any) => ({ id: e.id, type: 'pengalaman', title: e.title, position: '', category: e.category || '', description: e.description || '', link: (e.sort_order || 0).toString(), image: e.image_url || '' })),"
    )
    content = content.replace(
        "...cRes.map((c: any) => ({ id: c.id, type: 'sertifikat', title: c.title, position: c.category || '', description: c.issuer || '', link: (c.sort_order || 0).toString(), image: c.image_url || '' })),",
        "...cRes.map((c: any) => ({ id: c.id, type: 'sertifikat', title: c.title, position: c.issuer || '', category: c.category || '', description: c.issuer || '', link: (c.sort_order || 0).toString(), image: c.image_url || '' })),"
    )

    # 5. Extract globalCategories inside the component
    # Find filteredData declaration and put it after
    global_cat_code = """
  const categoriesSetting = data.find(d => d.type === "setting" && d.title === "categories");
  const globalCategories = categoriesSetting && categoriesSetting.link ? categoriesSetting.link.split(",") : ["Web", "Game", "Mobile", "UI/UX", "Data Science"];
"""
    content = content.replace(
        "  const filteredData = data.filter((item) => item.type === activeTab);",
        "  const filteredData = data.filter((item) => item.type === activeTab);\n" + global_cat_code
    )

    # 6. Update handleEdit
    content = content.replace(
        "      title: item.title,\n      position: item.position,\n      description: item.description,",
        "      title: item.title,\n      position: item.position,\n      category: item.category || \"\",\n      description: item.description,"
    )

    # 7. Update handleSubmit to reset category
    content = content.replace(
        "      title: \"\",\n      position: \"\",\n      description: \"\",",
        "      title: \"\",\n      position: \"\",\n      category: \"\",\n      description: \"\","
    )

    # 8. Update handleSubmit payload saving
    old_payload = """    let tableName = "";
    let payload: any = {};
    if (activeTab === "proyek") {
      tableName = "projects";
      payload = { title: formData.title, category: formData.position, description: formData.description, demo_url: formData.link, image_url: imageUrl, tech_stack: formData.tech };
    } else if (activeTab === "pengalaman") {
      tableName = "experiences";
      payload = { title: formData.title, description: formData.description, image_url: imageUrl, sort_order: parseInt(formData.link || "0") };
    } else if (activeTab === "sertifikat") {
      tableName = "certificates";
      payload = { title: formData.title, category: formData.position, issuer: formData.description, image_url: imageUrl, sort_order: parseInt(formData.link || "0") };
    }"""

    new_payload = """    let tableName = "";
    let payload: any = {};
    if (activeTab === "proyek") {
      tableName = "projects";
      payload = { title: formData.title, category: formData.category, description: formData.description, demo_url: formData.link, image_url: imageUrl, tech_stack: formData.tech };
    } else if (activeTab === "pengalaman") {
      tableName = "experiences";
      payload = { title: formData.title, category: formData.category, description: formData.description, image_url: imageUrl, sort_order: parseInt(formData.link || "0") };
    } else if (activeTab === "sertifikat") {
      tableName = "certificates";
      payload = { title: formData.title, category: formData.category, issuer: formData.position, image_url: imageUrl, sort_order: parseInt(formData.link || "0") };
    }"""
    content = content.replace(old_payload, new_payload)

    # 9. Insert categories capsule section in settings tab
    cat_ui = """
            {/* Pengaturan Kategori */}
            <div className="bg-[#111] p-8 rounded-2xl border border-white/5 shadow-2xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Kategori Portofolio
              </h2>
              <p className="text-neutral-400 text-sm mb-6">
                Kelola daftar kategori yang dapat dipilih pada saat menambahkan Proyek, Sertifikat, dan Galeri.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {globalCategories.map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-purple-600/20 text-purple-300 px-3 py-1.5 rounded-full text-sm font-medium border border-purple-500/30">
                    {cat}
                    <button type="button" onClick={async () => {
                      const newCats = globalCategories.filter(c => c !== cat);
                      const existing = data.find(d => d.type === "setting" && d.title === "categories");
                      if (existing) {
                        await updateData("settings", existing.id, { value: newCats.join(",") });
                      } else {
                        await insertData("settings", { key: "categories", value: newCats.join(",") });
                      }
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
                if (globalCategories.includes(newCat)) {
                   alert("Kategori sudah ada!"); return;
                }
                const newCats = [...globalCategories, newCat];
                const existing = data.find(d => d.type === "setting" && d.title === "categories");
                if (existing) {
                  await updateData("settings", existing.id, { value: newCats.join(",") });
                } else {
                  await insertData("settings", { key: "categories", value: newCats.join(",") });
                }
                input.value = "";
                loadData();
              }} className="flex gap-3">
                <input type="text" name="new_category" placeholder="Kategori baru (ex: Backend)..." className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm" />
                <button type="submit" className="bg-purple-600 text-white font-medium rounded-xl px-6 py-3 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20 text-sm">
                  Tambah
                </button>
              </form>
            </div>
"""
    content = content.replace(
        "            <div className=\"bg-[#111] p-8 rounded-2xl border border-white/5 shadow-2xl\">\n              <h2 className=\"text-2xl font-bold text-white mb-2\">\n                Pengaturan Link Sosial Media\n              </h2>",
        cat_ui + "\n            <div className=\"bg-[#111] p-8 rounded-2xl border border-white/5 shadow-2xl\">\n              <h2 className=\"text-2xl font-bold text-white mb-2\">\n                Pengaturan Link Sosial Media\n              </h2>"
    )

    # 10. Update Modal form inputs
    old_position_field = """              <div>
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
              </div>"""

    new_position_field = """              {activeTab !== "proyek" && (
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">
                    {activeTab === "sertifikat" ? "Issuer / Penyelenggara" : "Posisi / Peran (Opsional)"}
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder={activeTab === "sertifikat" ? "Contoh: Dicoding, Coursera" : "Contoh: Peserta, Programmer"}
                  />
                </div>
              )}"""

    content = content.replace(old_position_field, new_position_field)

    category_field_ui = """
            {["proyek", "pengalaman", "sertifikat"].includes(activeTab) && (
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Kategori
                </label>
                <div className="flex flex-wrap gap-2">
                  {globalCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        formData.category === cat
                          ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                          : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
"""
    content = content.replace(
        "            <div>\n              <label className=\"block text-sm text-neutral-400 mb-1\">\n                Description",
        category_field_ui + "\n            <div>\n              <label className=\"block text-sm text-neutral-400 mb-1\">\n                Description"
    )

    # 11. Update Table Columns slightly
    content = content.replace(
        "                            <p className=\"text-xs text-purple-400\">\n                              {item.position}\n                            </p>",
        "                            <p className=\"text-xs text-purple-400\">\n                              {item.category ? item.category + (item.position ? ' - ' + item.position : '') : item.position}\n                            </p>"
    )

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Refactored Dashboard!")


if __name__ == "__main__":
    main()
