import re

def refactor_portfolio_app():
    path = "app/_components/PortfolioApp.tsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace the fetch Promise.all
    old_fetch = r"""        const \[pRes, eRes, cRes, coRes, sRes\] = await Promise\.all\(\[.*?\]\);"""
    
    new_fetch = """        const [pRes, eRes, cRes, coRes, sRes, oRes, tRes] = await Promise.all([
          supabase.from("projects").select("*").order("sort_order", { ascending: true }),
          supabase.from("experiences").select("*").order("sort_order", { ascending: true }),
          supabase.from("certificates").select("*").order("sort_order", { ascending: true }),
          supabase.from("companies").select("*").order("id", { ascending: true }),
          supabase.from("settings").select("*"),
          supabase.from("organizations").select("*").order("sort_order", { ascending: true }),
          supabase.from("timelines").select("*").order("sort_order", { ascending: true }),
        ]);"""
    
    content = re.sub(old_fetch, new_fetch, content, flags=re.DOTALL)

    # Replace the mapping logic
    old_mapping = r"""        const projs = \(pRes\.data \|\| \[\]\)\.map\(\(item\) => \{.*?setSettings\(sRes\.data \|\| \[\]\);"""
    
    new_mapping = """        const projs = (pRes.data || []).map((item) => ({
          ...item,
          img: item.image_url,
          desc: item.description,
          description: item.description,
          category: item.category || "Web",
          tech: item.tech_stack || [],
          demo_url: item.demo_url || "",
          github_url: item.github_url || ""
        }));
        setProjects(projs as any);

        const exps = (eRes.data || []).map((item) => ({
          ...item,
          img: item.image_url,
        }));
        setExperiences(exps as any);

        const certs = (cRes.data || []).map((item) => ({
          ...item,
          img: item.image_url,
          gambar_url: item.image_url,
          category: item.category,
          issuer: item.issuer
        }));
        setCertificates(certs as any);

        setCompanies(coRes.data || []);
        
        const combinedSettings = [
          ...(sRes.data || []).map((s: any) => ({ type: 'setting', title: s.key, link: s.value })),
          ...(oRes.data || []).map((o: any) => ({ type: 'organization', title: o.name, description: o.role, position: o.period, image: o.icon_url, link: o.sort_order?.toString() })),
          ...(tRes.data || []).map((t: any) => ({ type: 'timeline', title: t.name, position: t.period, link: t.sort_order?.toString() }))
        ];
        setSettings(combinedSettings as any);"""
    
    content = re.sub(old_mapping, new_mapping, content, flags=re.DOTALL)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Refactored PortfolioApp.tsx")


def refactor_dashboard():
    path = "app/dashboard/page.tsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Replace PortfolioItem interface
    content = content.replace(
        """interface PortfolioItem {
  id: number;
  type: string;
  title: string;
  position: string;
  description: string;
  link: string;
  image: string;
}""",
        """interface PortfolioItem {
  id: number;
  type: string;
  title: string;
  position: string;
  description: string;
  link: string;
  image: string;
  tech?: string[];
}"""
    )
    
    # Replace loadData
    old_load = r"""  const loadData = async \(\) => \{
    setIsLoading\(true\);
    const result = await fetchData\("portfolio_items"\);
    if \(result\) setData\(result as PortfolioItem\[\]\);
    setIsLoading\(false\);
  \};"""
  
    new_load = """  const loadData = async () => {
    setIsLoading(true);
    const pRes = await fetchData("projects") || [];
    const eRes = await fetchData("experiences") || [];
    const cRes = await fetchData("certificates") || [];
    const oRes = await fetchData("organizations") || [];
    const tRes = await fetchData("timelines") || [];
    const sRes = await fetchData("settings") || [];

    const normalized = [
      ...pRes.map((p: any) => ({ id: p.id, type: 'proyek', title: p.title, position: p.category || '', description: p.description || '', link: p.demo_url || '', image: p.image_url || '', tech: p.tech_stack || [] })),
      ...eRes.map((e: any) => ({ id: e.id, type: 'pengalaman', title: e.title, position: '', description: e.description || '', link: (e.sort_order || 0).toString(), image: e.image_url || '' })),
      ...cRes.map((c: any) => ({ id: c.id, type: 'sertifikat', title: c.title, position: c.category || '', description: c.issuer || '', link: (c.sort_order || 0).toString(), image: c.image_url || '' })),
      ...oRes.map((o: any) => ({ id: o.id, type: 'organization', title: o.name, position: o.period || '', description: o.role || '', link: (o.sort_order || 0).toString(), image: o.icon_url || '' })),
      ...tRes.map((t: any) => ({ id: t.id, type: 'timeline', title: t.name, position: t.period || '', description: '', link: (t.sort_order || 0).toString(), image: '' })),
      ...sRes.map((s: any) => ({ id: s.id, type: 'setting', title: s.key, position: '', description: '', link: s.value || '', image: '' }))
    ];
    setData(normalized as PortfolioItem[]);
    setIsLoading(false);
  };"""
  
    content = re.sub(old_load, new_load, content)
    
    # Replace handleEdit
    old_edit = r"""  const handleEdit = \(item: PortfolioItem\) => \{.*?setIsModalOpen\(true\);\n  \};"""
    new_edit = """  const handleEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      position: item.position,
      description: item.description,
      link: item.link || "",
      image: item.image || "",
      tech: item.tech || [],
      file: null,
    });
    setIsModalOpen(true);
  };"""
    content = re.sub(old_edit, new_edit, content, flags=re.DOTALL)
    
    # Replace handleSubmit
    old_submit = r"""  const handleSubmit = async \(e: React\.FormEvent\) => \{.*?setFormData\(\{
      title: "",
      position: "",
      description: "",
      link: "",
      image: "",
      tech: \[\],
      file: null,
    \}\);\n  \};"""
    
    new_submit = """  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = formData.image;
    if (formData.file) {
      const uploadRes = await uploadImage(formData.file);
      if (uploadRes.success && uploadRes.url) imageUrl = uploadRes.url;
    }

    let tableName = "";
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
    }

    if (editingId) {
      await updateData(tableName, editingId, payload);
    } else {
      await insertData(tableName, payload);
    }

    setIsModalOpen(false);
    setEditingId(null);
    loadData();
  };"""
    content = re.sub(old_submit, new_submit, content, flags=re.DOTALL)
    
    # Replace Settings updates
    #   if (existing.link !== u.link) { await updateData("portfolio_items", existing.id, { link: u.link }); } 
    #   else { await insertData("portfolio_items", { type: "setting", title: u.title, link: u.link, ... }); }
    content = content.replace('updateData("portfolio_items", existing.id, {', 'updateData("settings", existing.id, {')
    content = content.replace('insertData("portfolio_items", {', 'insertData("settings", {')
    content = content.replace('type: "setting",\n                        title: u.title,\n                        link: u.link,\n                        position: "",\n                        description: "",\n                        image: "",', 'key: u.title, value: u.link')
    content = content.replace('link: u.link,', 'value: u.link,')
    
    # Replace Organizations updates
    content = content.replace('updateData("portfolio_items", editingOrg.id, {', 'updateData("organizations", editingOrg.id, {')
    content = content.replace('insertData("portfolio_items", {\n                      type: "organization",\n                      title: nama,\n                      position: tahun,\n                      image: icon,\n                      description: role,\n                      link: "",\n                    });', 'insertData("organizations", {\n                      name: nama,\n                      period: tahun,\n                      icon_url: icon,\n                      role: role,\n                      sort_order: 0,\n                    });')
    content = content.replace('title: nama,\n                      position: tahun,\n                      image: icon,\n                      description: role,', 'name: nama, period: tahun, icon_url: icon, role: role')
    
    # Replace Timelines updates
    content = content.replace('updateData("portfolio_items", editingTimeline.id, {', 'updateData("timelines", editingTimeline.id, {')
    content = content.replace('insertData("portfolio_items", {\n                      type: "timeline",\n                      title: nama,\n                      position: tahun,\n                      image: "",\n                      description: "",\n                      link: "",\n                    });', 'insertData("timelines", {\n                      name: nama,\n                      period: tahun,\n                      sort_order: 0,\n                    });')
    content = content.replace('title: nama,\n                      position: tahun,\n                      image: "",\n                      description: "",', 'name: nama, period: tahun')
    
    # Organization drag & drop updateData
    content = content.replace('updateData("portfolio_items", item.id, {\n                              link: i.toString(),', 'updateData("organizations", item.id, {\n                              sort_order: i,')
    
    # Timeline drag & drop updateData
    content = content.replace('updateData("portfolio_items", item.id, {\n                              link: i.toString(),', 'updateData("timelines", item.id, {\n                              sort_order: i,')

    # Replace confirmDelete logic 
    #   const res = await deleteData("portfolio_items", deleteConfirmId);
    # Needs to use the correct table. But wait! deleteData needs the tableName.
    # Where does it get the tableName? I need to store the item type to know which table to delete from!
    old_delete = r"""  const confirmDelete = async \(\) => \{
    if \(!deleteConfirmId\) return;
    const res = await deleteData\("portfolio_items", deleteConfirmId\);"""
    
    new_delete = """  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    const itemToDelete = data.find((d) => d.id === deleteConfirmId);
    if (!itemToDelete) return;
    let table = "";
    if (itemToDelete.type === "proyek") table = "projects";
    else if (itemToDelete.type === "pengalaman") table = "experiences";
    else if (itemToDelete.type === "sertifikat") table = "certificates";
    else if (itemToDelete.type === "organization") table = "organizations";
    else if (itemToDelete.type === "timeline") table = "timelines";
    else if (itemToDelete.type === "setting") table = "settings";

    const res = await deleteData(table, deleteConfirmId);"""
    content = re.sub(old_delete, new_delete, content)

    # In handleDelete, for timeline and organization, the state only passes id.
    # We should make sure the type is known. Yes, `data.find(d => d.id === deleteConfirmId)` works!
    # Because `data` has the `type` populated in `loadData`.

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Refactored dashboard page")


if __name__ == "__main__":
    refactor_portfolio_app()
    refactor_dashboard()
