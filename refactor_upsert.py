import re

def main():
    path = "app/dashboard/page.tsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Add upsertData to imports
    if "upsertData" not in content:
        content = content.replace(
            "import { fetchData, insertData, updateData, deleteData, uploadImage }",
            "import { fetchData, insertData, updateData, deleteData, uploadImage, upsertData }"
        )

    # 1. Categories onClick
    old_cat_click = """                      const existing = data.find(d => d.type === "setting" && d.title === "categories");
                      if (existing) {
                        await updateData("settings", existing.id, { value: newCats.join(",") });
                      } else {
                        await insertData("settings", { key: "categories", value: newCats.join(",") });
                      }"""
    new_cat_click = """                      await upsertData("settings", { key: "categories", value: newCats.join(",") }, "key");"""
    content = content.replace(old_cat_click, new_cat_click)

    # 2. Categories onSubmit
    old_cat_submit = """                const existing = data.find(d => d.type === "setting" && d.title === "categories");
                if (existing) {
                  await updateData("settings", existing.id, { value: newCats.join(",") });
                } else {
                  await insertData("settings", { key: "categories", value: newCats.join(",") });
                }"""
    new_cat_submit = """                await upsertData("settings", { key: "categories", value: newCats.join(",") }, "key");"""
    content = content.replace(old_cat_submit, new_cat_submit)

    # 3. Techs onClick
    old_tech_click = """                      const existing = data.find(d => d.type === "setting" && d.title === "tech_stacks");
                      if (existing) {
                        await updateData("settings", existing.id, { value: newTechs.join(",") });
                      } else {
                        await insertData("settings", { key: "tech_stacks", value: newTechs.join(",") });
                      }"""
    new_tech_click = """                      await upsertData("settings", { key: "tech_stacks", value: newTechs.join(",") }, "key");"""
    content = content.replace(old_tech_click, new_tech_click)

    # 4. Techs onSubmit
    old_tech_submit = """                const existing = data.find(d => d.type === "setting" && d.title === "tech_stacks");
                if (existing) {
                  await updateData("settings", existing.id, { value: newTechs.join(",") });
                } else {
                  await insertData("settings", { key: "tech_stacks", value: newTechs.join(",") });
                }"""
    new_tech_submit = """                await upsertData("settings", { key: "tech_stacks", value: newTechs.join(",") }, "key");"""
    content = content.replace(old_tech_submit, new_tech_submit)

    # 5. Social Media Updates
    old_social_updates = """                  for (const u of updates) {
                    const existing = settings.find((s) => s.title === u.title);
                    if (existing) {
                      if (existing.link !== u.link) {
                        await updateData("settings", existing.id, {
                          value: u.link,
                        });
                      }
                    } else {
                      await insertData("settings", {
                        key: u.title, value: u.link
                      });
                    }
                  }"""
    new_social_updates = """                  for (const u of updates) {
                    await upsertData("settings", { key: u.title, value: u.link }, "key");
                  }"""
    content = content.replace(old_social_updates, new_social_updates)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Refactored Dashboard to use upsertData!")

if __name__ == "__main__":
    main()
