"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  CheckSquare, LogOut, LayoutDashboard, ClipboardList,
  Kanban, Calendar as CalendarIcon, Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useTasksContext } from "@/contexts/TasksContext";
import { Task } from "@/types/task";
import { TaskSchema } from "@/lib/validations";
import CalendarView from "@/components/calendar/CalendarView";
import CalendarTaskModal from "@/components/calendar/CalendarTaskModal";
import TaskForm from "@/components/tasks/TaskForm";

export default function CalendarPage() {
  const { user, loading: authLoading } = useAuth();
  const { handleLogout } = useAuthActions();
  const router = useRouter();
  const { tasks, loading, update } = useTasksContext();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-indigo-400" size={32} />
      </div>
    );
  }

  function openTaskDetail(task: Task) {
    setSelectedTask(task);
  }

  function openEdit(task: Task) {
    setSelectedTask(null);
    setEditingTask(task);
  }

  async function handleFormSubmit(data: TaskSchema, subtasks: Task["subtasks"]) {
    if (!editingTask) return;
    setFormLoading(true);
    try {
      await update(editingTask.id, { ...data, subtasks });
      toast.success("Tarefa atualizada!");
      setEditingTask(null);
    } catch {
      toast.error("Erro ao salvar tarefa.");
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-500">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Calendário</h1>
          <p className="text-slate-400 text-sm mt-1">
            Visualize suas tarefas por data de vencimento
          </p>
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-4 mb-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Baixa
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-400" /> Média
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" /> Alta
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-indigo-400" size={28} />
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
            <CalendarView tasks={tasks} onEventClick={openTaskDetail} />
          </div>
        )}
      </div>

      {selectedTask && (
        <CalendarTaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={openEdit}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onClose={() => setEditingTask(null)}
          loading={formLoading}
        />
      )}

      <Footer />
    </main>
  );
}
