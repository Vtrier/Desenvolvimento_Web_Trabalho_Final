"use client";

import { X, Calendar, AlertCircle, Pencil } from "lucide-react";
import { Task } from "@/types/task";
import { calcProgress } from "@/components/tasks/SubtaskList";

interface Props {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

const priorityConfig = {
  baixa: { label: "Baixa", dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  media: { label: "Média", dot: "bg-yellow-400",  text: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "border-yellow-500/20"  },
  alta:  { label: "Alta",  dot: "bg-red-400",     text: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20"     },
};

const statusConfig = {
  pendente:     { label: "Pendente",      bg: "bg-slate-500/10",   text: "text-slate-400",   border: "border-slate-500/20"   },
  em_progresso: { label: "Em progresso",  bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20"    },
  concluida:    { label: "Concluída",     bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
};

export default function CalendarTaskModal({ task, onClose, onEdit }: Props) {
  const pCfg = priorityConfig[task.priority];
  const sCfg = statusConfig[task.status];
  const overdue = task.status !== "concluida" && new Date(task.dueDate + "T23:59:59") < new Date();
  const progress = calcProgress(task.subtasks ?? []);
  const hasSubtasks = (task.subtasks ?? []).length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cal-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-6 flex flex-col gap-4">

        <div className="flex items-start justify-between gap-3">
          <h2 id="cal-modal-title" className="text-base font-semibold text-white leading-snug">
            {task.title}
          </h2>
          <button onClick={onClose} aria-label="Fechar" className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${pCfg.bg} ${pCfg.text} ${pCfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`} />
            {pCfg.label}
          </span>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${sCfg.bg} ${sCfg.text} ${sCfg.border}`}>
            {sCfg.label}
          </span>
          {overdue && (
            <span className="inline-flex items-center gap-1 text-xs text-red-400">
              <AlertCircle size={11} /> Vencida
            </span>
          )}
        </div>

        <div className={`flex items-center gap-1.5 text-sm ${overdue ? "text-red-400" : "text-slate-400"}`}>
          <Calendar size={13} />
          {new Date(task.dueDate + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
        </div>

        {task.description && (
          <p className="text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
            {task.description}
          </p>
        )}

        {hasSubtasks && (
          <div className="border-t border-white/5 pt-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500">
                {(task.subtasks ?? []).filter((s) => s.completed).length}/{(task.subtasks ?? []).length} subtarefas
              </span>
              <span className={`font-medium ${progress === 100 ? "text-emerald-400" : "text-indigo-400"}`}>{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: progress === 100 ? "#22c55e" : "#6366f1" }}
              />
            </div>
          </div>
        )}

        <button
          onClick={() => onEdit(task)}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all mt-1"
        >
          <Pencil size={14} />
          Editar tarefa
        </button>
      </div>
    </div>
  );
}
