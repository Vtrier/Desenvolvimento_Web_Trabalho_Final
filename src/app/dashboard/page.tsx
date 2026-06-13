"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useTasks } from "@/hooks/useTasks";
import { CheckSquare, LogOut, Trash2, Loader2, ClipboardList, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import DeleteAccountModal from "@/components/auth/DeleteAccountModal";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { handleLogout } = useAuthActions();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { allTasks, loading: tasksLoading } = useTasks(user?.uid);

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

  const pendentes  = allTasks.filter((t) => t.status === "pendente").length;
  const concluidas = allTasks.filter((t) => t.status === "concluida").length;
  const vencidas   = allTasks.filter((t) => {
    if (t.status === "concluida") return false;
    return new Date(t.dueDate + "T23:59:59") < new Date();
  }).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30">
                <CheckSquare size={18} className="text-indigo-400" />
              </div>
              <span className="text-base font-bold text-white">Task<span className="text-indigo-400">Flow</span></span>
            </div>
            <div className="flex items-center gap-1">
              <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white bg-white/5 text-sm transition-all">
                Dashboard
              </Link>
              <Link href="/tasks" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm transition-all">
                <ClipboardList size={14} />
                Tarefas
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-red-500/20 text-sm transition-all">
              <Trash2 size={14} />
              Excluir conta
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm transition-all">
              <LogOut size={14} />
              Sair
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Olá, {user.displayName?.split(" ")[0] ?? "usuário"}
          </h1>
          <p className="text-slate-400 text-sm mt-1">Aqui está um resumo das suas tarefas</p>
        </div>

        {/* Stats */}
        {tasksLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin text-indigo-400" size={24} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/15"><Clock size={20} className="text-yellow-400" /></div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">{pendentes}</p>
                <p className="text-sm text-slate-400">Pendentes</p>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/15"><CheckCircle2 size={20} className="text-emerald-400" /></div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">{concluidas}</p>
                <p className="text-sm text-slate-400">Concluídas</p>
              </div>
            </div>
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/15"><AlertCircle size={20} className="text-red-400" /></div>
              <div>
                <p className="text-2xl font-bold text-red-400">{vencidas}</p>
                <p className="text-sm text-slate-400">Vencidas</p>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <Link
          href="/tasks"
          className="flex items-center justify-between p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30">
              <ClipboardList size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-white font-medium">Gerenciar tarefas</p>
              <p className="text-slate-400 text-sm">Criar, editar e organizar suas tarefas</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}
    </main>
  );
}
