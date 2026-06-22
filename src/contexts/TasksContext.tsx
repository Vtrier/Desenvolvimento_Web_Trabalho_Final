"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { Task, TaskFormData, Subtask } from "@/types/task";
import {
  getTasks,
  createTask,
  updateTask,
  updateSubtasks,
  deleteTask,
} from "@/services/task.service";

interface TasksContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  create: (data: TaskFormData) => Promise<void>;
  update: (id: string, data: Partial<TaskFormData>) => Promise<void>;
  updateSubtasks: (id: string, subtasks: Subtask[]) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getTasks(user.uid);
      setTasks(data);
      setError(null);
    } catch {
      setError("Erro ao carregar tarefas.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) reload();
    else { setTasks([]); setLoading(false); }
  }, [user, reload]);

  async function create(data: TaskFormData) {
    if (!user) return;
    const task = await createTask(user.uid, data);
    setTasks((prev) => [task, ...prev]);
  }

  async function update(id: string, data: Partial<TaskFormData>) {
    await updateTask(id, data);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data, updatedAt: new Date() } : t))
    );
  }

  async function updateSubtasksCtx(id: string, subtasks: Subtask[]) {
    await updateSubtasks(id, subtasks);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, subtasks, updatedAt: new Date() } : t))
    );
  }

  async function remove(id: string) {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <TasksContext.Provider value={{
      tasks, loading, error, reload,
      create, update,
      updateSubtasks: updateSubtasksCtx,
      remove,
    }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksContext() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasksContext must be used inside TasksProvider");
  return ctx;
}
