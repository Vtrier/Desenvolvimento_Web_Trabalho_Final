"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { taskSchema, TaskSchema } from "@/lib/validations";
import { Task, Subtask } from "@/types/task";
import InputField from "@/components/auth/InputField";
import SubtaskList from "./SubtaskList";

interface Props {
  task?: Task;
  onSubmit: (data: TaskSchema, subtasks: Subtask[]) => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

export default function TaskForm({ task, onSubmit, onClose, loading }: Props) {
  const [subtasks, setSubtasks] = useState<Subtask[]>(task?.subtasks ?? []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "media",
      status: task?.status ?? "pendente",
      dueDate: task?.dueDate ?? "",
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate,
      });
      setSubtasks(task.subtasks ?? []);
    }
  }, [task, reset]);

  async function handleFormSubmit(data: TaskSchema) {
    await onSubmit(data, subtasks);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-form-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-6 flex flex-col gap-5 max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 id="task-form-title" className="text-base font-semibold text-white">
            {task ? "Editar tarefa" : "Nova tarefa"}
          </h2>
          <button onClick={onClose} aria-label="Fechar" className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="flex flex-col gap-4">

          {/* Título */}
          <InputField
            label="Título"
            type="text"
            placeholder="Ex: Criar tela de login"
            error={errors.title?.message}
            {...register("title")}
          />

          {/* Descrição */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Descrição</label>
            <textarea
              rows={3}
              placeholder="Detalhes da tarefa (opcional)"
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none"
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
          </div>

          {/* Prioridade + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Prioridade</label>
              <select
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 bg-slate-800 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                {...register("priority")}
              >
                <option value="baixa">🟢 Baixa</option>
                <option value="media">🟡 Média</option>
                <option value="alta">🔴 Alta</option>
              </select>
              {errors.priority && <p className="text-xs text-red-400">{errors.priority.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Status</label>
              <select
                className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 bg-slate-800 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                {...register("status")}
              >
                <option value="pendente">⏳ Pendente</option>
                <option value="em_progresso">🔄 Em progresso</option>
                <option value="concluida">✅ Concluída</option>
              </select>
              {errors.status && <p className="text-xs text-red-400">{errors.status.message}</p>}
            </div>
          </div>

          {/* Data de vencimento */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Data de vencimento</label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-xl text-sm text-slate-100 bg-slate-800 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
              {...register("dueDate")}
            />
            {errors.dueDate && <p className="text-xs text-red-400">{errors.dueDate.message}</p>}
          </div>

          {/* Subtarefas */}
          <div className="flex flex-col gap-2 pt-1 border-t border-white/5">
            <label className="text-sm font-medium text-slate-300">
              Subtarefas
              {subtasks.length > 0 && (
                <span className="ml-2 text-xs font-normal text-slate-500">
                  {subtasks.filter((s) => s.completed).length}/{subtasks.length} concluídas
                </span>
              )}
            </label>
            <SubtaskList subtasks={subtasks} onChange={setSubtasks} />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-medium transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {task ? "Salvar alterações" : "Criar tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
