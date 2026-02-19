import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl border-0 bg-white dark:bg-black p-8 shadow-lg ${className}`}>
      {children}
    </div>
  );
}
