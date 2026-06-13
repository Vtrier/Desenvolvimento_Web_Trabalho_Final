"use client";

import { useState } from "react";
import { Calendar, Pencil, Trash2, AlertCircle, Clock, CheckCircle2, RotateCcw } from "lucide-react";
import { Task } from "@/types/task";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
}

const priorityConfig = {
  baixa:  { label: "Baixa",  dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/10" },
  media:  { label: "Média",  dot: "bg-yellow-400",  text: "text-yellow-400",  border: "border-yellow-500/20",  bg: "bg-yellow-500/10"  },
  alta:   { label: "Alta",   dot: "bg-red-400",     text: "text-red-400",     border: "border-red-500/20",     bg: "bg-red-500/10"     },
};

const statusConfig = {
  pendente:     { label: "Pendente",     icon: Clock,         color: "text-slate-400",  bg: "bg-slate-500/10",  border: "border-slate-500/20"  },
  em_progresso: { label: "Em progresso", icon: RotateCcw,     color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20"   },
  concluida:    { label: "Concluída",    icon: CheckCircle2,  color: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20" },
};

function isOverdue(dueDate: string, status: Task["status"]) {
  if (status === "concluida") return false;
  return new Date(dueDate + "T23:59:59") < new Date();
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const pCfg = priorityConfig[task.priority];
  const sCfg = statusConfig[task.status];
  const StatusIcon = sCfg.icon;
  const overdue = isOverdue(task.dueDate, task.status);

  const formattedDate = new Date(task.dueDate + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });

  function cycleStatus() {
    const order: Task["status"][] = ["pendente", "em_progresso", "concluida"];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    onStatusChange(task.id, next);
  }

  return (
    <div className={`
      group rounded-2xl border bg-slate-900/60 backdrop-blur-sm p-5
      transition-all duration-200 hover:border-white/20 hover:bg-slate-900/80
      ${task.status === "concluida" ? "border-white/5 opacity-70" : "border-white/10"}
    `}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${pCfg.bg} ${pCfg.text} ${pCfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`} />
            {pCfg.label}
          </span>
          {/* Status badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${sCfg.bg} ${sCfg.color} ${sCfg.border}`}>
            <StatusIcon size={11} />
            {sCfg.label}
          </span>
          {/* Overdue badge */}
          {overdue && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
              <AlertCircle size={11} />
              Vencida
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            aria-label="Editar tarefa"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            aria-label="Excluir tarefa"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className={`font-semibold text-base mb-1 leading-snug ${task.status === "concluida" ? "line-through text-slate-500" : "text-white"}`}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <div className={`flex items-center gap-1.5 text-xs ${overdue ? "text-red-400" : "text-slate-500"}`}>
          <Calendar size={12} />
          {formattedDate}
        </div>
        <button
          onClick={cycleStatus}
          className="text-xs text-slate-500 hover:text-indigo-400 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-500/10"
        >
          Mudar status →
        </button>
      </div>

      {/* Confirm delete overlay */}
      {confirmDelete && (
        <div className="mt-3 pt-3 border-t border-red-500/20 flex items-center justify-between gap-3">
          <p className="text-xs text-red-400">Excluir esta tarefa?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-all"
            >
              Não
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all"
            >
              Sim, excluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
