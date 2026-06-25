"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  CheckSquare, LogOut, LayoutDashboard,
  ClipboardList, Kanban, Calendar, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useTasksContext } from "@/contexts/TasksContext";
import { Task } from "@/types/task";
import KanbanColumn from "@/components/kanban/KanbanColumn";
import KanbanCard from "@/components/kanban/KanbanCard";
import KanbanTaskModal from "@/components/kanban/KanbanTaskModal";

const COLUMNS: { id: Task["status"]; title: string; color: string; accent: string }[] = [
  { id: "pendente",     title: "A Fazer",   color: "border-slate-700/50 bg-slate-800/30",    accent: "bg-slate-400"   },
  { id: "em_progresso", title: "Fazendo",   color: "border-blue-500/20 bg-blue-500/5",       accent: "bg-blue-400"    },
  { id: "concluida",    title: "Concluído", color: "border-emerald-500/20 bg-emerald-500/5", accent: "bg-emerald-400" },
];

export default function KanbanPage() {
  const { user, loading: authLoading } = useAuth();
  const { handleLogout } = useAuthActions();
  const router = useRouter();
  const { tasks: allTasks, loading, update, updateSubtasks } = useTasksContext();

  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    setLocalTasks(allTasks);
  }, [allTasks]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  function getTasksByStatus(status: Task["status"]) {
    return localTasks.filter((t) => t.status === status);
  }

  function findTaskStatus(taskId: string): Task["status"] | undefined {
    return localTasks.find((t) => t.id === taskId)?.status;
  }

  function handleDragStart({ active }: DragStartEvent) {
    const task = localTasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Destination: either a column id or another card's column
    const destStatus: Task["status"] | undefined =
      (COLUMNS.find((c) => c.id === overId)?.id as Task["status"]) ??
      findTaskStatus(overId);

    if (!destStatus) return;

    const srcStatus = findTaskStatus(activeId);
    if (!srcStatus || srcStatus === destStatus) return;

    // Optimistically update status
    setLocalTasks((prev) =>
      prev.map((t) => (t.id === activeId ? { ...t, status: destStatus } : t))
    );
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const task = localTasks.find((t) => t.id === activeId);
    if (!task) return;

    // Reorder within same column
    if (activeId !== overId && findTaskStatus(overId) === task.status) {
      setLocalTasks((prev) => {
        const oldIndex = prev.findIndex((t) => t.id === activeId);
        const newIndex = prev.findIndex((t) => t.id === overId);
        if (oldIndex === -1 || newIndex === -1) return prev;
        return arrayMove(prev, oldIndex, newIndex);
      });
      return;
    }

    // Save new status to Firebase
    const originalStatus = allTasks.find((t) => t.id === activeId)?.status;
    if (task.status !== originalStatus) {
      try {
        await update(activeId, { status: task.status });
        toast.success(
          `Movida para "${COLUMNS.find((c) => c.id === task.status)?.title}"`
        );
      } catch {
        toast.error("Erro ao salvar. Revertendo.");
        setLocalTasks(allTasks);
      }
    }
  }

  async function handleStatusChange(id: string, status: Task["status"]) {
    try {
      await update(id, { status });
      setLocalTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
      setSelectedTask((prev) =>
        prev?.id === id ? { ...prev, status } : prev
      );
      toast.success("Status atualizado.");
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  }

  async function handleSubtasksChange(id: string, subtasks: Task["subtasks"]) {
    try {
      await updateSubtasks(id, subtasks);
      setLocalTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, subtasks } : t))
      );
      setSelectedTask((prev) =>
        prev?.id === id ? { ...prev, subtasks } : prev
      );
    } catch {
      toast.error("Erro ao atualizar subtarefas.");
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-indigo-400" size={32} />
      </div>
    );
  }

  return (
<main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-500">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Quadro Kanban</h1>
          <p className="text-slate-400 text-sm mt-1">
            Arraste as tarefas entre as colunas para mudar o status
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-indigo-400" size={28} />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              {COLUMNS.map((col) => (
                <KanbanColumn
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  color={col.color}
                  accent={col.accent}
                  tasks={getTasksByStatus(col.id)}
                  onCardClick={setSelectedTask}
                />
              ))}
            </div>

            <DragOverlay dropAnimation={null}>
              {activeTask && (
                <div className="rotate-2 scale-105 shadow-2xl shadow-black/50">
                  <KanbanCard task={activeTask} onClick={() => {}} />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {selectedTask && (
        <KanbanTaskModal
          task={localTasks.find((t) => t.id === selectedTask.id) ?? selectedTask}
          onClose={() => setSelectedTask(null)}
          onSubtasksChange={handleSubtasksChange}
          onStatusChange={handleStatusChange}
        />
      )}
      <Footer />
    </main>
  );
}
