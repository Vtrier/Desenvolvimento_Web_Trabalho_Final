import { ReactNode } from "react";
import Link from "next/link";
import { CheckSquare } from "lucide-react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: { text: string; linkLabel: string; href: string };
}

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div
      className="
        w-full max-w-md rounded-2xl border border-white/10
        bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-black/50
        p-8 flex flex-col gap-6
      "
      role="main"
    >
      {/* Logo */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30">
            <CheckSquare size={22} className="text-indigo-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Task<span className="text-indigo-400">Flow</span>
          </span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
        </div>
      </div>

      {children}

      {/* Footer link */}
      <p className="text-center text-sm text-slate-400">
        {footer.text}{" "}
        <Link
          href={footer.href}
          className="text-indigo-400 hover:text-indigo-300 font-medium underline-offset-2 hover:underline transition-colors"
        >
          {footer.linkLabel}
        </Link>
      </p>
    </div>
  );
}
