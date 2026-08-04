import re

def update_dashboard():
    with open("app/(main)/dashboard/page.tsx", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update PortfolioItem interface
    content = content.replace(
        "tech?: string[];",
        "tech?: string[];\n  external_links?: {label: string, url: string}[];"
    )

    # 2. Update formData state
    content = content.replace(
        "tech: [] as string[],",
        "tech: [] as string[],\n    external_links: [] as {label: string, url: string}[],"
    )

    # 3. Update loadData for projects and certificates
    old_p_map = "...pRes.map((p: any) => ({ id: p.id, type: 'proyek', title: p.title, position: p.category || '', category: p.category || '', description: p.description || '', link: p.demo_url || '', image: p.image_url || '', tech: p.tech_stack || [] })),"
    new_p_map = "...pRes.map((p: any) => ({ id: p.id, type: 'proyek', title: p.title, position: p.category || '', category: p.category || '', description: p.description || '', link: p.demo_url || '', image: p.image_url || '', tech: p.tech_stack || [], external_links: p.external_links || [] })),"
    content = content.replace(old_p_map, new_p_map)

    old_c_map = "...cRes.map((c: any) => ({ id: c.id, type: 'sertifikat', title: c.title, position: c.issuer || '', category: c.category || '', description: c.issuer || '', link: (c.sort_order || 0).toString(), image: c.image_url || '' })),"
    new_c_map = "...cRes.map((c: any) => ({ id: c.id, type: 'sertifikat', title: c.title, position: c.issuer || '', category: c.category || '', description: c.issuer || '', link: (c.sort_order || 0).toString(), image: c.image_url || '', external_links: c.external_links || [] })),"
    content = content.replace(old_c_map, new_c_map)

    # 4. Update handleSubmit payloads
    old_p_payload = "payload = { title: formData.title, category: formData.category, description: formData.description, demo_url: formData.link, image_url: imageUrl, tech_stack: formData.tech };"
    new_p_payload = "payload = { title: formData.title, category: formData.category, description: formData.description, demo_url: formData.link, image_url: imageUrl, tech_stack: formData.tech, external_links: formData.external_links };"
    content = content.replace(old_p_payload, new_p_payload)

    old_c_payload = "payload = { title: formData.title, category: formData.category, issuer: formData.position, image_url: imageUrl, sort_order: parseInt(formData.link || \"0\") };"
    new_c_payload = "payload = { title: formData.title, category: formData.category, issuer: formData.position, image_url: imageUrl, sort_order: parseInt(formData.link || \"0\"), external_links: formData.external_links };"
    content = content.replace(old_c_payload, new_c_payload)

    # 5. Update openModal reset
    old_reset = "tech: [],\n      file: null,"
    new_reset = "tech: [],\n      external_links: [],\n      file: null,"
    content = content.replace(old_reset, new_reset)

    # 6. Update handleEdit reset
    old_edit_reset = "tech: item.tech || [],\n      file: null,"
    new_edit_reset = "tech: item.tech || [],\n      external_links: item.external_links || [],\n      file: null,"
    content = content.replace(old_edit_reset, new_edit_reset)

    # 7. Update UI for the form to include Dynamic Links for Projects and Certificates
    # Find the old Link input
    old_link_ui = """            <div>
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
            </div>"""

    new_link_ui = """            {/* Dynamic Multi-Links for Proyek & Sertifikat */}
            {["proyek", "sertifikat"].includes(activeTab) ? (
              <div className="space-y-3">
                <label className="block text-sm text-neutral-400 mb-1">
                  Daftar Link (Opsional)
                </label>
                {formData.external_links.map((lnk, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={lnk.label}
                      onChange={(e) => {
                        const newLinks = [...formData.external_links];
                        newLinks[idx].label = e.target.value;
                        setFormData({ ...formData, external_links: newLinks });
                      }}
                      placeholder="Label (ex: Play Store)"
                      className="w-1/3 bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="url"
                      value={lnk.url}
                      onChange={(e) => {
                        const newLinks = [...formData.external_links];
                        newLinks[idx].url = e.target.value;
                        setFormData({ ...formData, external_links: newLinks });
                      }}
                      placeholder="https://..."
                      className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newLinks = formData.external_links.filter((_, i) => i !== idx);
                        setFormData({ ...formData, external_links: newLinks });
                      }}
                      className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, external_links: [...formData.external_links, { label: "Kunjungi", url: "" }] });
                  }}
                  className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium px-2 py-1 rounded-lg hover:bg-purple-500/10 transition-colors"
                >
                  <Plus size={16} /> Tambah Link Baru
                </button>
              </div>
            ) : (
              <div>
                <label className="block text-sm text-neutral-400 mb-1">
                  {activeTab === "pengalaman" ? "Sort Order" : "Link (Opsional)"}
                </label>
                <input
                  type={activeTab === "pengalaman" ? "number" : "text"}
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder={activeTab === "pengalaman" ? "0" : "https://..."}
                />
              </div>
            )}"""
    
    content = content.replace(old_link_ui, new_link_ui)

    with open("app/(main)/dashboard/page.tsx", "w", encoding="utf-8") as f:
        f.write(content)


def update_portfolio_app():
    with open("app/components/layout/PortfolioApp.tsx", "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update SelectedItem interface
    content = content.replace(
        "github_url?: string;",
        "github_url?: string;\n  external_links?: {label: string, url: string}[];"
    )

    # 2. Update Fetch logic for projects and certificates
    old_p_map = "github_url: item.github_url || \"\""
    new_p_map = "github_url: item.github_url || \"\",\n          external_links: item.external_links || []"
    content = content.replace(old_p_map, new_p_map)

    old_c_map = "issuer: item.issuer"
    new_c_map = "issuer: item.issuer,\n          external_links: item.external_links || []"
    content = content.replace(old_c_map, new_c_map)

    # 3. Update the Modal Rendering
    old_modal_buttons = """              <div className="flex flex-col sm:flex-row gap-3 w-full mt-auto">
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
              </div>"""
    
    new_modal_buttons = """              <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full mt-auto">
                {/* Legacy single demo_url fallback */}
                {selectedItem.demo_url && (!selectedItem.external_links || selectedItem.external_links.length === 0) && (
                  <a
                    href={selectedItem.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 min-w-[140px] bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-medium shadow-lg"
                  >
                    Kunjungi Proyek <ExternalLink size={16} />
                  </a>
                )}

                {/* Multiple Dynamic Links */}
                {selectedItem.external_links && selectedItem.external_links.map((lnk, idx) => (
                  <a
                    key={idx}
                    href={lnk.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 min-w-[140px] bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-medium shadow-lg"
                  >
                    {lnk.label} <ExternalLink size={16} />
                  </a>
                ))}

                {/* Legacy GitHub */}
                {selectedItem.github_url && (!selectedItem.demo_url && (!selectedItem.external_links || selectedItem.external_links.length === 0)) && (
                  <a
                    href={selectedItem.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 min-w-[140px] bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    Lihat GitHub <ExternalLink size={16} />
                  </a>
                )}
                <button
                  id="modal-close-btn"
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 min-w-[100px] bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl border border-white/10 transition-all"
                >
                  Close
                </button>
              </div>"""

    content = content.replace(old_modal_buttons, new_modal_buttons)

    with open("app/components/layout/PortfolioApp.tsx", "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    update_dashboard()
    update_portfolio_app()
    print("Multi-links feature injected!")
