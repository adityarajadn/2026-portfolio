import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aditya Rajadana Hernadi — Portfolio",
  description:
    "Portfolio Aditya Rajadana Hernadi — Frontend Developer, Game Developer & Backend Enthusiast. Mahasiswa FILKOM Universitas Brawijaya.",
  keywords: ["portfolio", "frontend", "game developer", "React", "Next.js", "Universitas Brawijaya"],
  authors: [{ name: "Aditya Rajadana Hernadi" }],
  openGraph: {
    title: "Aditya Rajadana Hernadi — Portfolio",
    description: "Frontend Developer · Game Developer · Backend Enthusiast",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${bricolage.variable}`}>
      <body>{children}</body>
    </html>
  );
}
