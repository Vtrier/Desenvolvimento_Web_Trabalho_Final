"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, AlertCircle, GripVertical } from "lucide-react";
import { Task } from "@/types/task";
import { calcProgress } from "@/components/tasks/SubtaskList";

interface Props {
  task: Task;
  onClick: (task: Task) => void;
}

const priorityConfig = {
  baixa: { dot: "bg-emerald-400", text: "text-emerald-400", label: "Baixa" },
  media: { dot: "bg-yellow-400",  text: "text-yellow-400",  label: "Média" },
  alta:  { dot: "bg-red-400",     text: "text-red-400",     label: "Alta"  },
};

function isOverdue(dueDate: string) {
  return new Date(dueDate + "T23:59:59") < new Date();
}

export default function KanbanCard({ task, onClick }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  const pCfg = priorityConfig[task.priority];
  const overdue = task.status !== "concluida" && isOverdue(task.dueDate);
  const hasSubtasks = (task.subtasks ?? []).length > 0;
  const progress = calcProgress(task.subtasks ?? []);

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onClick(task)}
      className={`
        group rounded-xl border bg-slate-800/80 p-3.5 cursor-pointer
        hover:border-white/20 hover:bg-slate-800 transition-all duration-150
        ${isDragging ? "shadow-2xl shadow-black/50 border-indigo-500/50" : "border-white/10"}
      `}
    >
      {/* Drag handle + priority */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`} />
          <span className={`text-xs font-medium ${pCfg.text}`}>{pCfg.label}</span>
        </div>
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 rounded text-slate-600 hover:text-slate-400"
          aria-label="Arrastar tarefa"
        >
          <GripVertical size={14} />
        </div>
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-slate-200 leading-snug mb-2 line-clamp-2">
        {task.title}
      </p>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-2">
          {task.description}
        </p>
      )}

      {/* Progress bar */}
      {hasSubtasks && (
        <div className="mb-2">
          <div className="flex justify-between text-xs text-slate-600 mb-1">
            <span>{(task.subtasks ?? []).filter(s => s.completed).length}/{(task.subtasks ?? []).length} subtarefas</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background: progress === 100 ? "#22c55e" : "#6366f1",
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <div className={`flex items-center gap-1 text-xs ${overdue ? "text-red-400" : "text-slate-600"}`}>
          <Calendar size={11} />
          {new Date(task.dueDate + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
        </div>
        {overdue && (
          <div className="flex items-center gap-1 text-xs text-red-400">
            <AlertCircle size={11} />
            Vencida
          </div>
        )}
      </div>
    </div>
  );
}
