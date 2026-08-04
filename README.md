# Aditya Rajadana - Personal Developer Portfolio

![Portfolio Preview](/public/png/me.jpg)

A modern, dynamic, and highly interactive personal portfolio website built with **Next.js**, **Tailwind CSS**, and **Supabase**. The platform not only showcases projects, experiences, and certificates but also includes a fully functional, secure **Admin Dashboard** allowing real-time content management without touching the codebase.

## ✨ Key Features

- **Dynamic Content Management (CMS):** Complete CRUD (Create, Read, Update, Delete) capabilities via a hidden Admin Dashboard for Projects, Experiences, Certificates, Organizations, and site-wide Settings.
- **Relational Database Architecture:** Powered by Supabase (PostgreSQL) with a fully normalized schema and robust Row Level Security (RLS).
- **Stunning UI/UX:** 
  - Custom "Galaxy" interactive background with mouse repulsion physics.
  - Smooth scroll reveals, typing effects, and animated number counters.
  - Modern "Glassmorphism" aesthetic with a refined dark-mode purple neon theme.
- **Interactive Timeline:** A scrollable, drag-and-drop sortable timeline for educational and professional history.
- **GitHub Integration:** Live GitHub contribution graph visualization using `react-github-calendar`.
- **Anti-Sleep Ping:** Automatically pings the Supabase database on every visit to prevent the free-tier project from being paused due to inactivity.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database / Backend:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** Vercel (Recommended)

## 📁 Project Structure (App Router)

Following the latest best practices, this project utilizes Next.js Route Groups and modular component design:

```
app/
├── (main)/                     # Main public routes
│   ├── page.tsx                # Home Page
│   ├── projects/               # Projects Gallery
│   ├── experiences/            # Experience Timeline
│   ├── certificates/           # Certificates Showcase
│   └── dashboard/              # Admin CMS Dashboard
├── login/                      # Admin Authentication
├── components/                 # Reusable UI Components
│   ├── layout/                 # Navbar, App Layouts
│   ├── sections/               # Home, Projects, etc.
│   ├── ui/                     # Modals, Counters, Reveals
│   ├── icons/                  # SVG Custom Icons
│   └── effects/                # Interactive Canvas (Galaxy)
└── lib/                        # Utilities & Supabase Client
```

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/adityarajadn/2026-portfolio.git
cd 2026-portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Supabase
1. Create a new project on [Supabase](https://supabase.com/).
2. Run the SQL scripts provided in the root directory via the Supabase SQL Editor:
   - Run `supabase_schema_v2.sql` to generate the normalized tables, set up RLS, and handle policies.
   - Run `supabase_seed.sql` to inject dummy data for immediate testing.
3. Setup a storage bucket named `portfolio-images` and make it public.

### 4. Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the site.

## 🔒 Accessing the Dashboard

To manage your portfolio content:
1. Navigate to `/login`.
2. Enter the admin credentials (configured in your database/authentication logic).
3. Access `/dashboard` to add new projects, manage tech stacks, categories, and adjust the timeline via drag-and-drop.

## 💡 Developer Notes
- **Keep-Alive Mechanism:** The `PortfolioApp.tsx` component automatically upserts a `last_active_ping` key to the `settings` table on mount. This ensures your Supabase Hobby Plan database registers write activity and does not get paused.
- **Dynamic Settings:** Features like social media links, available tech stacks, and project categories are stored as comma-separated values in the `settings` table and can be manipulated directly from the Dashboard UI.

---
*Designed & Built by [Aditya Rajadana](https://github.com/adityarajadn)*
