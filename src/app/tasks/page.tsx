"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { Plus, CheckSquare, LogOut, LayoutDashboard, Loader2, ClipboardList, Kanban, Calendar } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useTasksContext } from "@/contexts/TasksContext";
import { Task, Subtask, Priority, Status } from "@/types/task";
import { TaskSchema } from "@/lib/validations";
import TaskCard from "@/components/tasks/TaskCard";
import TaskFilters from "@/components/tasks/TaskFilters";
import TaskForm from "@/components/tasks/TaskForm";

type FilterPriority = Priority | "todas";
type FilterStatus = Status | "todas";

export default function TasksPage() {
  const { user, loading: authLoading } = useAuth();
  const { handleLogout } = useAuthActions();
  const router = useRouter();

  const { tasks: allTasks, loading, error, create, update, updateSubtasks, remove } = useTasksContext();

  const [filterPriority, setFilterPriority] = useState<FilterPriority>("todas");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("todas");
  const [search, setSearch] = useState("");

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

  const tasks = allTasks.filter((t) => {
    if (filterPriority !== "todas" && t.priority !== filterPriority) return false;
    if (filterStatus !== "todas" && t.status !== filterStatus) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function openCreate() { setEditingTask(undefined); setShowForm(true); }
  function openEdit(task: Task) { setEditingTask(task); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditingTask(undefined); }

  async function handleSubmit(data: TaskSchema, subtasks: Subtask[]) {
    setFormLoading(true);
    try {
      if (editingTask) {
        await update(editingTask.id, { ...data, subtasks });
        toast.success("Tarefa atualizada!");
      } else {
        await create({ ...data, subtasks });
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

  async function handleSubtasksChange(id: string, subtasks: Subtask[]) {
    try {
      await updateSubtasks(id, subtasks);
    } catch {
      toast.error("Erro ao atualizar subtarefas.");
    }
  }

  const total = allTasks.length;
  const pendentes = allTasks.filter((t) => t.status === "pendente").length;
  const concluidas = allTasks.filter((t) => t.status === "concluida").length;
  const vencidas = allTasks.filter((t) => {
    if (t.status === "concluida") return false;
    return new Date(t.dueDate + "T23:59:59") < new Date();
  }).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-500">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Minhas tarefas</h1>
            <p className="text-slate-400 text-sm mt-1">Gerencie e acompanhe suas tarefas</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all">
            <Plus size={16} />
            Nova tarefa
          </button>
        </div>

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

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 mb-6">
          <TaskFilters
            search={search} onSearch={setSearch}
            filterPriority={filterPriority} onPriority={setFilterPriority}
            filterStatus={filterStatus} onStatus={setFilterStatus}
            total={allTasks.length} filtered={tasks.length}
          />
        </div>

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
              {allTasks.length === 0 ? "Nenhuma tarefa criada ainda." : "Nenhuma tarefa com esses filtros."}
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
                onSubtasksChange={handleSubtasksChange}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <TaskForm task={editingTask} onSubmit={handleSubmit} onClose={closeForm} loading={formLoading} />
      )}
      <Footer />
    </main>
  );
}
