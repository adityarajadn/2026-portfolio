import os
import re

def main():
    root = "app"
    
    import_replacements = [
        # UI components
        (r'from\s+"(\.\./)+AnimatedCounter"', 'from "@/app/components/ui/AnimatedCounter"'),
        (r'from\s+"(\.\./)+Modal"', 'from "@/app/components/ui/Modal"'),
        (r'from\s+"(\.\./)+TypingEffect"', 'from "@/app/components/ui/TypingEffect"'),
        (r'from\s+"(\.\./)+ScrollReveal"', 'from "@/app/components/ui/ScrollReveal"'),
        (r'from\s+"(\.\./)+ShapeGrid"', 'from "@/app/components/ui/ShapeGrid"'),
        
        # Icons
        (r'from\s+"(\.\./)+GithubIcon"', 'from "@/app/components/icons/GithubIcon"'),
        (r'from\s+"(\.\./)+InstagramIcon"', 'from "@/app/components/icons/InstagramIcon"'),
        (r'from\s+"(\.\./)+ItchIcon"', 'from "@/app/components/icons/ItchIcon"'),
        (r'from\s+"(\.\./)+LinkedinIcon"', 'from "@/app/components/icons/LinkedinIcon"'),
        
        # Effects
        (r'from\s+"(\.\./)+Galaxy"', 'from "@/app/components/effects/Galaxy"'),
        
        # Sections / Views
        (r'from\s+"(\.\./)+views/HomeView"', 'from "@/app/components/sections/HomeSection"'),
        (r'from\s+"(\.\./)+views/ProjectsView"', 'from "@/app/components/sections/ProjectsSection"'),
        (r'from\s+"(\.\./)+views/ExperiencesView"', 'from "@/app/components/sections/ExperiencesSection"'),
        (r'from\s+"(\.\./)+views/CertificatesView"', 'from "@/app/components/sections/CertificatesSection"'),
        
        # Layouts
        (r'from\s+"(\.\./)+PortfolioApp"', 'from "@/app/components/layout/PortfolioApp"'),
        (r'from\s+"(\.\./)+Navbar"', 'from "@/app/components/layout/Navbar"'),
    ]

    for dirpath, _, filenames in os.walk(root):
        for f in filenames:
            if f.endswith(".tsx") or f.endswith(".ts"):
                path = os.path.join(dirpath, f)
                with open(path, "r", encoding="utf-8") as file:
                    content = file.read()
                
                original = content
                for pattern, replacement in import_replacements:
                    content = re.sub(pattern, replacement, content)
                
                if original != content:
                    with open(path, "w", encoding="utf-8") as file:
                        file.write(content)
                    print(f"Fixed imports in {path}")

if __name__ == "__main__":
    main()
