import os
import shutil
import re

def main():
    root = "."

    # Files to move: mapping from old path to new path
    moves = {
        "app/page.tsx": "app/(main)/page.tsx",
        "app/projects/page.tsx": "app/(main)/projects/page.tsx",
        "app/experiences/page.tsx": "app/(main)/experiences/page.tsx",
        "app/certificates/page.tsx": "app/(main)/certificates/page.tsx",
        "app/dashboard/page.tsx": "app/(main)/dashboard/page.tsx",
        "app/dashboard/login/page.tsx": "app/login/page.tsx",
        
        "app/_components/PortfolioApp.tsx": "app/components/layout/PortfolioApp.tsx",
        "app/_components/Navbar.tsx": "app/components/layout/Navbar.tsx",
        
        "app/_components/views/HomeView.tsx": "app/components/sections/HomeSection.tsx",
        "app/_components/views/ProjectsView.tsx": "app/components/sections/ProjectsSection.tsx",
        "app/_components/views/ExperiencesView.tsx": "app/components/sections/ExperiencesSection.tsx",
        "app/_components/views/CertificatesView.tsx": "app/components/sections/CertificatesSection.tsx",
        
        "app/_components/AnimatedCounter.tsx": "app/components/ui/AnimatedCounter.tsx",
        "app/_components/Modal.tsx": "app/components/ui/Modal.tsx",
        "app/_components/TypingEffect.tsx": "app/components/ui/TypingEffect.tsx",
        "app/_components/ScrollReveal.tsx": "app/components/ui/ScrollReveal.tsx",
        "app/_components/ShapeGrid.tsx": "app/components/ui/ShapeGrid.tsx",
        
        "app/_components/GithubIcon.tsx": "app/components/icons/GithubIcon.tsx",
        "app/_components/InstagramIcon.tsx": "app/components/icons/InstagramIcon.tsx",
        "app/_components/ItchIcon.tsx": "app/components/icons/ItchIcon.tsx",
        "app/_components/LinkedinIcon.tsx": "app/components/icons/LinkedinIcon.tsx",
        
        "app/_components/Galaxy.tsx": "app/components/effects/Galaxy.tsx",
        
        "lib/supabase.ts": "app/lib/supabase.ts",
    }

    # Ensure target directories exist
    dirs_to_create = [
        "app/(main)/projects",
        "app/(main)/experiences",
        "app/(main)/certificates",
        "app/(main)/dashboard",
        "app/login",
        "app/components/layout",
        "app/components/sections",
        "app/components/ui",
        "app/components/icons",
        "app/components/effects",
        "app/lib",
        "app/hooks",
        "app/types",
    ]

    for d in dirs_to_create:
        os.makedirs(os.path.join(root, d), exist_ok=True)

    # Move files and load contents for updating
    file_contents = {}
    
    for old_path, new_path in moves.items():
        if os.path.exists(os.path.join(root, old_path)):
            with open(os.path.join(root, old_path), "r", encoding="utf-8") as f:
                file_contents[new_path] = f.read()
        else:
            print(f"Warning: {old_path} not found.")

    # Let's also load app/layout.tsx to update any imports if needed
    layout_path = "app/layout.tsx"
    if os.path.exists(layout_path):
        with open(layout_path, "r", encoding="utf-8") as f:
            file_contents[layout_path] = f.read()

    import_replacements = [
        (r'from\s+"(\.\./)+lib/supabase"', 'from "@/app/lib/supabase"'),
        (r'from\s+"\./_components/PortfolioApp"', 'from "@/app/components/layout/PortfolioApp"'),
        (r'from\s+"\.\./_components/PortfolioApp"', 'from "@/app/components/layout/PortfolioApp"'),
        
        (r'from\s+"\./views/HomeView"', 'from "@/app/components/sections/HomeSection"'),
        (r'from\s+"\./views/ProjectsView"', 'from "@/app/components/sections/ProjectsSection"'),
        (r'from\s+"\./views/ExperiencesView"', 'from "@/app/components/sections/ExperiencesSection"'),
        (r'from\s+"\./views/CertificatesView"', 'from "@/app/components/sections/CertificatesSection"'),
        
        (r'from\s+"\.\./_components/Navbar"', 'from "@/app/components/layout/Navbar"'),
        (r'from\s+"\./Navbar"', 'from "@/app/components/layout/Navbar"'),
        
        (r'from\s+"\.\./_components/AnimatedCounter"', 'from "@/app/components/ui/AnimatedCounter"'),
        (r'from\s+"\./AnimatedCounter"', 'from "@/app/components/ui/AnimatedCounter"'),
        (r'from\s+"\.\./_components/Modal"', 'from "@/app/components/ui/Modal"'),
        (r'from\s+"\./Modal"', 'from "@/app/components/ui/Modal"'),
        (r'from\s+"\.\./_components/TypingEffect"', 'from "@/app/components/ui/TypingEffect"'),
        (r'from\s+"\./TypingEffect"', 'from "@/app/components/ui/TypingEffect"'),
        (r'from\s+"\.\./_components/ScrollReveal"', 'from "@/app/components/ui/ScrollReveal"'),
        (r'from\s+"\./ScrollReveal"', 'from "@/app/components/ui/ScrollReveal"'),
        (r'from\s+"\.\./_components/ShapeGrid"', 'from "@/app/components/ui/ShapeGrid"'),
        (r'from\s+"\./ShapeGrid"', 'from "@/app/components/ui/ShapeGrid"'),
        
        (r'from\s+"\.\./_components/GithubIcon"', 'from "@/app/components/icons/GithubIcon"'),
        (r'from\s+"\./GithubIcon"', 'from "@/app/components/icons/GithubIcon"'),
        (r'from\s+"\.\./_components/InstagramIcon"', 'from "@/app/components/icons/InstagramIcon"'),
        (r'from\s+"\./InstagramIcon"', 'from "@/app/components/icons/InstagramIcon"'),
        (r'from\s+"\.\./_components/ItchIcon"', 'from "@/app/components/icons/ItchIcon"'),
        (r'from\s+"\./ItchIcon"', 'from "@/app/components/icons/ItchIcon"'),
        (r'from\s+"\.\./_components/LinkedinIcon"', 'from "@/app/components/icons/LinkedinIcon"'),
        (r'from\s+"\./LinkedinIcon"', 'from "@/app/components/icons/LinkedinIcon"'),
        
        (r'from\s+"\.\./_components/Galaxy"', 'from "@/app/components/effects/Galaxy"'),
        (r'from\s+"\./Galaxy"', 'from "@/app/components/effects/Galaxy"'),
    ]

    # Process and rewrite all files
    for filepath, content in file_contents.items():
        # Apply import replacements
        for pattern, replacement in import_replacements:
            content = re.sub(pattern, replacement, content)
            
        # Rename views to sections in code
        content = content.replace("HomeView", "HomeSection")
        content = content.replace("ProjectsView", "ProjectsSection")
        content = content.replace("ExperiencesView", "ExperiencesSection")
        content = content.replace("CertificatesView", "CertificatesSection")
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
            
    # Also create constants.ts, data.ts, utils.ts
    for f in ["constants.ts", "data.ts", "utils.ts"]:
        path = os.path.join(root, "app/lib", f)
        if not os.path.exists(path):
            with open(path, "w", encoding="utf-8") as file:
                file.write("// " + f)

    print("Structure refactoring complete!")

if __name__ == "__main__":
    main()
