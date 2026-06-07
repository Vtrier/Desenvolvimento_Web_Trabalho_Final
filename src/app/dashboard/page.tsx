"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuthActions";
import { CheckSquare, LogOut, Trash2, Loader2 } from "lucide-react";
import DeleteAccountModal from "@/components/auth/DeleteAccountModal";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { handleLogout } = useAuthActions();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-indigo-400" size={32} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30">
              <CheckSquare size={22} className="text-indigo-400" />
            </div>
            <span className="text-xl font-bold text-white">
              Task<span className="text-indigo-400">Flow</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDeleteModal(true)}
              aria-label="Excluir conta"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 text-sm transition-all"
            >
              <Trash2 size={15} />
              Excluir conta
            </button>
            <button
              onClick={handleLogout}
              aria-label="Sair da conta"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 text-sm transition-all"
            >
              <LogOut size={15} />
              Sair
            </button>
          </div>
        </header>

        {/* Card de boas-vindas */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 text-center">
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="Foto de perfil"
              className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-indigo-500/30"
            />
          )}
          <p className="text-slate-400 text-sm mb-1">Bem-vindo,</p>
          <h1 className="text-2xl font-bold text-white mb-1">
            {user.displayName ?? user.email}
          </h1>
          <p className="text-slate-500 text-sm">{user.email}</p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            Login realizado com sucesso ✓
          </div>
        </div>

      </div>

      {/* Modal de exclusão */}
      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}
    </main>
  );
}
