"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuth } from "@/contexts/AuthContext"; // Para sabermos qual o provider
import { 
  CheckSquare, LayoutDashboard, ClipboardList, Kanban, 
  Calendar, Trash2, LogOut, X, Loader2, AlertCircle
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth(); // Precisamos do user para saber se ele fez login por password
  const { handleLogout, handleDeleteAccountAction, error } = useAuthActions(); 
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [password, setPassword] = useState(""); // Novo estado para a palavra-passe

  // Verifica se o utilizador fez login com email e palavra-passe
  const isPasswordUser = user?.providerData.some(p => p.providerId === "password");

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, active: pathname === "/dashboard" },
    { href: "/tasks", label: "Tarefas", icon: ClipboardList, active: pathname === "/tasks" },
    { href: "/kanban", label: "Kanban", icon: Kanban, active: pathname === "/kanban" },
    { href: "/calendar", label: "Calendário", icon: Calendar, active: pathname === "/calendar" },
  ];

  async function handleDeleteAccount() {
    setLoadingDelete(true);
    try {
      // Passa a palavra-passe apenas se for utilizador de email
      const success = await handleDeleteAccountAction(isPasswordUser ? password : undefined);
      if (success) {
        setShowDeleteModal(false);
      }
    } finally {
      setLoadingDelete(false);
    }
  }

  return (
    <>
      <nav className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30" aria-label="Navegação do sistema">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30">
                <CheckSquare size={18} className="text-indigo-400" />
              </div>
              <span className="text-base font-bold text-white">Task<span className="text-indigo-400">Flow</span></span>
            </div>
              <ThemeToggle />
            <div className="hidden sm:flex items-center gap-1" role="navigation">
              {navLinks.map(({ href, label, icon: Icon, active }) => (
                <Link key={href} href={href} aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${active ? "text-white bg-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                  <Icon size={14} /> {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowDeleteModal(true)} className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-red-500/20 text-sm font-medium transition-all">
              <Trash2 size={14} /> Excluir conta
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </nav>

      {/* MODAL DE ELIMINAÇÃO */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-slate-900 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Trash2 size={18} className="text-red-400" /> Excluir Conta
              </h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-slate-500 hover:text-slate-300">
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Tem a certeza de que deseja apagar a sua conta? Esta ação é <strong className="text-red-400">irreversível</strong> e apagará permanentemente todos os seus dados.
            </p>

            {/* Se o utilizador usa email, pede a palavra-passe para confirmar */}
            {isPasswordUser && (
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-300 font-medium">Confirme a sua palavra-passe:</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Introduza a sua palavra-passe"
                />
              </div>
            )}

            {/* Mensagem de Erro (caso a palavra-passe esteja errada) */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="flex gap-3 pt-2 border-t border-white/5">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-medium transition-all">
                Cancelar
              </button>
              <button 
                onClick={handleDeleteAccount} 
                disabled={loadingDelete || (isPasswordUser && !password)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
              >
                {loadingDelete ? <Loader2 size={14} className="animate-spin" /> : null}
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}