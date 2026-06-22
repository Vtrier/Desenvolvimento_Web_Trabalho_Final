"use client";

import { useState } from "react";
import { Calendar, Pencil, Trash2, AlertCircle, Clock, CheckCircle2, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { Task } from "@/types/task";
import SubtaskList from "./SubtaskList";
import { calcProgress } from "./SubtaskList";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
  onSubtasksChange: (id: string, subtasks: Task["subtasks"]) => void;
}

const priorityConfig = {
  baixa: { label: "Baixa", dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/10" },
  media: { label: "Média", dot: "bg-yellow-400",  text: "text-yellow-400",  border: "border-yellow-500/20",  bg: "bg-yellow-500/10"  },
  alta:  { label: "Alta",  dot: "bg-red-400",     text: "text-red-400",     border: "border-red-500/20",     bg: "bg-red-500/10"     },
};

const statusConfig = {
  pendente:     { label: "Pendente",     icon: Clock,        color: "text-slate-400",   bg: "bg-slate-500/10",  border: "border-slate-500/20"  },
  em_progresso: { label: "Em progresso", icon: RotateCcw,    color: "text-blue-400",    bg: "bg-blue-500/10",   border: "border-blue-500/20"   },
  concluida:    { label: "Concluída",    icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10",border: "border-emerald-500/20" },
};

function isOverdue(dueDate: string, status: Task["status"]) {
  if (status === "concluida") return false;
  return new Date(dueDate + "T23:59:59") < new Date();
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, onSubtasksChange }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);

  const pCfg = priorityConfig[task.priority];
  const sCfg = statusConfig[task.status];
  const StatusIcon = sCfg.icon;
  const overdue = isOverdue(task.dueDate, task.status);
  const progress = calcProgress(task.subtasks ?? []);
  const hasSubtasks = (task.subtasks ?? []).length > 0;

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

      {/* Top row — badges + actions */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${pCfg.bg} ${pCfg.text} ${pCfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`} />
            {pCfg.label}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${sCfg.bg} ${sCfg.color} ${sCfg.border}`}>
            <StatusIcon size={11} />
            {sCfg.label}
          </span>
          {overdue && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
              <AlertCircle size={11} />
              Vencida
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => onEdit(task)} aria-label="Editar tarefa" className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
            <Pencil size={14} />
          </button>
          <button onClick={() => setConfirmDelete(true)} aria-label="Excluir tarefa" className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
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

      {/* Progress bar — sempre visível se tiver subtarefas */}
      {hasSubtasks && (
        <div className="mt-3 mb-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {(task.subtasks ?? []).filter((s) => s.completed).length}/{(task.subtasks ?? []).length} subtarefas
            </span>
            <span className={`font-medium ${progress === 100 ? "text-emerald-400" : progress >= 50 ? "text-indigo-400" : "text-yellow-400"}`}>
              {progress}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: progress === 100 ? "#22c55e" : progress >= 50 ? "#6366f1" : "#eab308",
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <div className={`flex items-center gap-1.5 text-xs ${overdue ? "text-red-400" : "text-slate-500"}`}>
          <Calendar size={12} />
          {formattedDate}
        </div>
        <div className="flex items-center gap-2">
          {hasSubtasks && (
            <button
              onClick={() => setShowSubtasks((p) => !p)}
              aria-expanded={showSubtasks}
              aria-label={showSubtasks ? "Ocultar subtarefas" : "Ver subtarefas"}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-400 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-500/10"
            >
              {showSubtasks ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              subtarefas
            </button>
          )}
          <button
            onClick={cycleStatus}
            className="text-xs text-slate-500 hover:text-indigo-400 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-500/10"
          >
            mudar status →
          </button>
        </div>
      </div>

      {/* Subtasks expandable section */}
      {showSubtasks && hasSubtasks && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <SubtaskList
            subtasks={task.subtasks ?? []}
            onChange={(updated) => onSubtasksChange(task.id, updated)}
          />
        </div>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="mt-3 pt-3 border-t border-red-500/20 flex items-center justify-between gap-3">
          <p className="text-xs text-red-400">Excluir esta tarefa?</p>
          <div className="flex gap-2">
            <button onClick={() => setConfirmDelete(false)} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-all">
              Não
            </button>
            <button onClick={() => onDelete(task.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all">
              Sim, excluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
