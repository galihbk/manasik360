import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all text-center inline-block";
  const variants = {
    primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] shadow-lg shadow-primary/20",
    secondary: "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-light)] shadow-lg shadow-accent/20",
    outline: "bg-white text-[var(--color-primary)] border-2 border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/30",
    ghost: "text-gray-600 hover:text-[var(--color-primary)] transition-colors",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClassName}>
      {children}
    </button>
  );
}
