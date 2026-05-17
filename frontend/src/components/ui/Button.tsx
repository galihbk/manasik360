import Link from "next/link";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  ...props
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
    <button type={type} onClick={onClick} className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
