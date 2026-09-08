import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', href, className, children, ...props }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-body text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none rounded-[8px] md:rounded-[10px]";
  
  const variants = {
    primary: "bg-orangeRed1 text-white hover:bg-[#E63E00] hover:-translate-y-[1px]",
    secondary: "bg-blackKnight text-white hover:bg-opacity-90",
    outline: "border border-border text-blackKnight hover:border-orangeRed1 hover:text-orangeRed1",
    ghost: "bg-transparent text-blackKnight hover:bg-blackKnight/5",
  };

  const sizes = "px-5 py-3 md:px-6 md:py-3.5";
  const classes = cn(baseClasses, variants[variant], sizes, className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
