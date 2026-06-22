"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "@/types/task";
import KanbanCard from "./KanbanCard";

interface Props {
  id: string;
  title: string;
  color: string;
  accent: string;
  tasks: Task[];
  onCardClick: (task: Task) => void;
}

export default function KanbanColumn({ id, title, color, accent, tasks, onCardClick }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col min-w-[300px] w-full">
      {/* Column header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-t-2xl border border-b-0 ${color}`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${accent}`} />
          <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-black/20 text-slate-400`}>
          {tasks.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 min-h-[400px] p-3 rounded-b-2xl border border-t-0 transition-colors duration-150
          ${color}
          ${isOver ? "bg-indigo-500/10 border-indigo-500/30" : ""}
        `}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2.5">
            {tasks.map((task) => (
              <KanbanCard key={task.id} task={task} onClick={onCardClick} />
            ))}
            {tasks.length === 0 && (
              <div className={`
                h-24 rounded-xl border-2 border-dashed flex items-center justify-center
                transition-colors duration-150
                ${isOver ? "border-indigo-500/50 bg-indigo-500/5" : "border-white/10"}
              `}>
                <p className="text-xs text-slate-600">
                  {isOver ? "Soltar aqui" : "Nenhuma tarefa"}
                </p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
