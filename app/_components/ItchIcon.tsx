"use client";

// Custom Itch.io SVG icon
interface ItchIconProps {
  size?: number;
  className?: string;
}

export default function ItchIcon({ size = 16, className = "" }: ItchIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4.605 2.5C3.39 2.5 2.41 3.48 2.41 4.695v11.758c0 1.215.98 2.195 2.195 2.195h1.794l3.185 3.186a1.21 1.21 0 0 0 1.712 0l3.186-3.186h1.795c1.215 0 2.195-.98 2.195-2.195V4.695c0-1.215-.98-2.195-2.195-2.195H4.605zm2.744 4.39c.671 0 1.215.544 1.215 1.215s-.544 1.215-1.215 1.215-1.215-.544-1.215-1.215.544-1.215 1.215-1.215zm9.302 0c.671 0 1.215.544 1.215 1.215s-.544 1.215-1.215 1.215-1.215-.544-1.215-1.215.544-1.215 1.215-1.215zM12 11.233c2.43 0 4.39 1.96 4.39 4.39h-8.78c0-2.43 1.96-4.39 4.39-4.39z" />
    </svg>
  );
}
