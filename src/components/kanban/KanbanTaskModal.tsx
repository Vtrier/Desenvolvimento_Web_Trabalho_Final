"use client";

import { X, Calendar, AlertCircle, Clock, RotateCcw, CheckCircle2 } from "lucide-react";
import { Task } from "@/types/task";
import SubtaskList from "@/components/tasks/SubtaskList";
import { calcProgress } from "@/components/tasks/SubtaskList";

interface Props {
  task: Task;
  onClose: () => void;
  onSubtasksChange: (id: string, subtasks: Task["subtasks"]) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
}

const priorityConfig = {
  baixa: { label: "Baixa", dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  media: { label: "Média", dot: "bg-yellow-400",  text: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "border-yellow-500/20"  },
  alta:  { label: "Alta",  dot: "bg-red-400",     text: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20"     },
};

const statusOptions: { value: Task["status"]; label: string; icon: any; color: string }[] = [
  { value: "pendente",     label: "A Fazer",       icon: Clock,        color: "text-slate-400"   },
  { value: "em_progresso", label: "Em Progresso",  icon: RotateCcw,    color: "text-blue-400"    },
  { value: "concluida",    label: "Concluída",      icon: CheckCircle2, color: "text-emerald-400" },
];

export default function KanbanTaskModal({ task, onClose, onSubtasksChange, onStatusChange }: Props) {
  const pCfg = priorityConfig[task.priority];
  const progress = calcProgress(task.subtasks ?? []);
  const overdue = task.status !== "concluida" && new Date(task.dueDate + "T23:59:59") < new Date();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kanban-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h2 id="kanban-modal-title" className="text-base font-semibold text-white leading-snug">
            {task.title}
          </h2>
          <button onClick={onClose} aria-label="Fechar" className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0 mt-0.5">
            <X size={18} />
          </button>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${pCfg.bg} ${pCfg.text} ${pCfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`} />
            {pCfg.label}
          </span>
          <div className={`flex items-center gap-1.5 text-xs ${overdue ? "text-red-400" : "text-slate-500"}`}>
            <Calendar size={12} />
            {new Date(task.dueDate + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
          </div>
          {overdue && (
            <span className="inline-flex items-center gap-1 text-xs text-red-400">
              <AlertCircle size={11} /> Vencida
            </span>
          )}
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
            {task.description}
          </p>
        )}

        {/* Status selector */}
        <div className="border-t border-white/5 pt-3">
          <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Mover para</p>
          <div className="flex gap-2">
            {statusOptions.map(({ value, label, icon: Icon, color }) => (
              <button
                key={value}
                onClick={() => onStatusChange(task.id, value)}
                className={`
                  flex-1 flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-medium transition-all
                  ${task.status === value
                    ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-400"
                    : "border-white/10 bg-white/5 text-slate-500 hover:border-white/20 hover:text-slate-300"
                  }
                `}
              >
                <Icon size={14} className={task.status === value ? "text-indigo-400" : color} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Subtasks + progress */}
        {(task.subtasks ?? []).length > 0 && (
          <div className="border-t border-white/5 pt-3">
            <div className="flex items-center justify-between text-xs mb-2">
              <p className="font-medium text-slate-400 uppercase tracking-wider">Subtarefas</p>
              <span className={`font-medium ${progress === 100 ? "text-emerald-400" : "text-indigo-400"}`}>{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden mb-3">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: progress === 100 ? "#22c55e" : "#6366f1" }}
              />
            </div>
            <SubtaskList
              subtasks={task.subtasks ?? []}
              onChange={(updated) => onSubtasksChange(task.id, updated)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
