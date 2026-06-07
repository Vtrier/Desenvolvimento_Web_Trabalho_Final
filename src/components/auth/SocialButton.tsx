"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  loading?: boolean;
}

export default function SocialButton({
  icon,
  label,
  loading,
  ...props
}: SocialButtonProps) {
  return (
    <button
      type="button"
      disabled={loading}
      aria-label={label}
      className="
        flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl
        bg-white/5 border border-white/10 text-slate-200 text-sm font-medium
        hover:bg-white/10 hover:border-white/20 active:scale-[0.98]
        transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
      "
      {...props}
    >
      {loading ? (
        <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        icon
      )}
      <span>{label}</span>
    </button>
  );
}
