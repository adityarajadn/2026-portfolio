import re

def main():
    path = "app/dashboard/page.tsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract globalTechs
    global_tech_code = """
  const techsSetting = data.find(d => d.type === "setting" && d.title === "tech_stacks");
  const globalTechs = techsSetting && techsSetting.link ? techsSetting.link.split(",") : ["React", "Next.js", "Tailwind", "Node.js", "TypeScript", "Supabase", "PostgreSQL", "Unity", "C#", "Godot", "Figma", "UI/UX"];
"""
    content = content.replace(
        "  const globalCategories = categoriesSetting && categoriesSetting.link ? categoriesSetting.link.split(\",\") : [\"Web\", \"Game\", \"Mobile\", \"UI/UX\", \"Data Science\"];",
        "  const globalCategories = categoriesSetting && categoriesSetting.link ? categoriesSetting.link.split(\",\") : [\"Web\", \"Game\", \"Mobile\", \"UI/UX\", \"Data Science\"];\n" + global_tech_code
    )

    # Insert Tech Stack capsule manager UI right after Categories manager
    tech_ui = """
            {/* Pengaturan Tech Stack */}
            <div className="bg-[#111] p-8 rounded-2xl border border-white/5 shadow-2xl mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Pengaturan Tech Stack
              </h2>
              <p className="text-neutral-400 text-sm mb-6">
                Kelola daftar Tech Stack yang dapat dipilih pada saat menambahkan Proyek.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {globalTechs.map((tech, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-purple-600/20 text-purple-300 px-3 py-1.5 rounded-full text-sm font-medium border border-purple-500/30">
                    {tech}
                    <button type="button" onClick={async () => {
                      const newTechs = globalTechs.filter(t => t !== tech);
                      const existing = data.find(d => d.type === "setting" && d.title === "tech_stacks");
                      if (existing) {
                        await updateData("settings", existing.id, { value: newTechs.join(",") });
                      } else {
                        await insertData("settings", { key: "tech_stacks", value: newTechs.join(",") });
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
                const input = form.elements.namedItem("new_tech") as HTMLInputElement;
                if (!input.value.trim()) return;
                const newTech = input.value.trim();
                if (globalTechs.includes(newTech)) {
                   alert("Tech Stack sudah ada!"); return;
                }
                const newTechs = [...globalTechs, newTech];
                const existing = data.find(d => d.type === "setting" && d.title === "tech_stacks");
                if (existing) {
                  await updateData("settings", existing.id, { value: newTechs.join(",") });
                } else {
                  await insertData("settings", { key: "tech_stacks", value: newTechs.join(",") });
                }
                input.value = "";
                loadData();
              }} className="flex gap-3">
                <input type="text" name="new_tech" placeholder="Tech Stack baru (ex: Prisma)..." className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm" />
                <button type="submit" className="bg-purple-600 text-white font-medium rounded-xl px-6 py-3 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20 text-sm">
                  Tambah
                </button>
              </form>
            </div>
"""
    content = content.replace(
        "            <div className=\"bg-[#111] p-8 rounded-2xl border border-white/5 shadow-2xl\">\n              <h2 className=\"text-2xl font-bold text-white mb-2\">\n                Pengaturan Link Sosial Media\n              </h2>",
        tech_ui + "\n            <div className=\"bg-[#111] p-8 rounded-2xl border border-white/5 shadow-2xl\">\n              <h2 className=\"text-2xl font-bold text-white mb-2\">\n                Pengaturan Link Sosial Media\n              </h2>"
    )

    # Replace hardcoded array with `globalTechs` in the form modal
    old_array = """                  {[
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
                  ].map((tech) => ("""
    new_array = "                  {globalTechs.map((tech) => ("
    content = content.replace(old_array, new_array)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Refactored Dashboard Tech Stack!")


if __name__ == "__main__":
    main()
