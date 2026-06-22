"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckSquare, LogOut, Trash2, Loader2,
  ClipboardList, LayoutDashboard, Calendar, Kanban,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useTasksContext } from "@/contexts/TasksContext";
import DeleteAccountModal from "@/components/auth/DeleteAccountModal";
import StatsCards from "@/components/dashboard/StatsCards";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import RecentTasks from "@/components/dashboard/RecentTasks";
import OverdueTasks from "@/components/dashboard/OverdueTasks";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { handleLogout } = useAuthActions();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { tasks: allTasks, loading: tasksLoading } = useTasksContext();

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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-500">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8">

        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-white">
            Olá, {user.displayName?.split(" ")[0] ?? "usuário"} 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        {tasksLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-indigo-400" size={28} />
          </div>
        ) : (
          <>
            {/* KPI cards */}
            <StatsCards tasks={allTasks} />

            {/* Charts */}
            <div>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Análise de tarefas
              </h2>
              <DashboardCharts tasks={allTasks} />
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentTasks tasks={allTasks} />
              <OverdueTasks tasks={allTasks} />
            </div>
          </>
        )}
      </div>

      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}

      <Footer />
    </main>
  );
}
