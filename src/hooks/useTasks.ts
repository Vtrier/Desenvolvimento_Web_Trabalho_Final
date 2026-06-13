"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, TaskFormData, Priority, Status } from "@/types/task";
import { getTasks, createTask, updateTask, deleteTask } from "@/services/task.service";

export type FilterPriority = Priority | "todas";
export type FilterStatus = Status | "todas";

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterPriority, setFilterPriority] = useState<FilterPriority>("todas");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("todas");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getTasks(userId);
      setTasks(data);
    } catch {
      setError("Erro ao carregar tarefas.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  async function create(data: TaskFormData) {
    if (!userId) return;
    const task = await createTask(userId, data);
    setTasks((prev) => [task, ...prev]);
  }

  async function update(id: string, data: Partial<TaskFormData>) {
    await updateTask(id, data);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data, updatedAt: new Date() } : t))
    );
  }

  async function remove(id: string) {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const filtered = tasks.filter((t) => {
    if (filterPriority !== "todas" && t.priority !== filterPriority) return false;
    if (filterStatus !== "todas" && t.status !== filterStatus) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return {
    tasks: filtered,
    allTasks: tasks,
    loading,
    error,
    filterPriority, setFilterPriority,
    filterStatus, setFilterStatus,
    search, setSearch,
    create, update, remove, reload: load,
  };
}
