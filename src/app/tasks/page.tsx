"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, CheckSquare, LogOut, LayoutDashboard, Loader2, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types/task";
import { TaskSchema } from "@/lib/validations";
import TaskCard from "@/components/tasks/TaskCard";
import TaskFilters from "@/components/tasks/TaskFilters";
import TaskForm from "@/components/tasks/TaskForm";

export default function TasksPage() {
  const { user, loading: authLoading } = useAuth();
  const { handleLogout } = useAuthActions();
  const router = useRouter();

  const {
    tasks, allTasks, loading, error,
    filterPriority, setFilterPriority,
    filterStatus, setFilterStatus,
    search, setSearch,
    create, update, remove,
  } = useTasks(user?.uid);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
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

  function openCreate() { setEditingTask(undefined); setShowForm(true); }
  function openEdit(task: Task) { setEditingTask(task); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditingTask(undefined); }

  async function handleSubmit(data: TaskSchema) {
    setFormLoading(true);
    try {
      if (editingTask) {
        await update(editingTask.id, data);
        toast.success("Tarefa atualizada!");
      } else {
        await create(data);
        toast.success("Tarefa criada!");
      }
      closeForm();
    } catch {
      toast.error("Erro ao salvar tarefa.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await remove(id);
      toast.success("Tarefa excluída.");
    } catch {
      toast.error("Erro ao excluir tarefa.");
    }
  }

  async function handleStatusChange(id: string, status: Task["status"]) {
    try {
      await update(id, { status });
      toast.success("Status atualizado.");
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  }

  // Stats
  const total = allTasks.length;
  const pendentes = allTasks.filter((t) => t.status === "pendente").length;
  const concluidas = allTasks.filter((t) => t.status === "concluida").length;
  const vencidas = allTasks.filter((t) => {
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
              <Link href="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm transition-all">
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              <Link href="/tasks" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white bg-white/5 text-sm transition-all">
                <ClipboardList size={14} />
                Tarefas
              </Link>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm transition-all"
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Minhas tarefas</h1>
            <p className="text-slate-400 text-sm mt-1">Gerencie e acompanhe suas tarefas</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all"
          >
            <Plus size={16} />
            Nova tarefa
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total", value: total, color: "text-white" },
            { label: "Pendentes", value: pendentes, color: "text-yellow-400" },
            { label: "Concluídas", value: concluidas, color: "text-emerald-400" },
            { label: "Vencidas", value: vencidas, color: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-slate-900/60 p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 mb-6">
          <TaskFilters
            search={search} onSearch={setSearch}
            filterPriority={filterPriority} onPriority={setFilterPriority}
            filterStatus={filterStatus} onStatus={setFilterStatus}
            total={allTasks.length} filtered={tasks.length}
          />
        </div>

        {/* Task list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-indigo-400" size={28} />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-400 text-sm">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16">
            <ClipboardList size={40} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">
              {allTasks.length === 0 ? "Nenhuma tarefa criada ainda." : "Nenhuma tarefa encontrada com esses filtros."}
            </p>
            {allTasks.length === 0 && (
              <button onClick={openCreate} className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm underline-offset-2 hover:underline transition-colors">
                Criar primeira tarefa
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onClose={closeForm}
          loading={formLoading}
        />
      )}
    </main>
  );
}
