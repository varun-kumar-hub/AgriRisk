"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  onClick,
  disabled,
  ...props
}: ButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    if (onClick) {
      onClick(e);
    }
  };

  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-transform duration-75 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 select-none shadow-sm focus:outline-none focus:ring-2 focus:ring-crop/50";

  const variants = {
    primary: "bg-crop text-white hover:bg-crop/90 shadow-emerald-900/10",
    secondary: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950 shadow-none",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5"
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
}
