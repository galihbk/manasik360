import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div 
      className={`card-premium rounded-2xl p-8 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
