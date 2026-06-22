"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Task } from "@/types/task";

interface Props {
  tasks: Task[];
}

const priorityLabel: Record<string, string> = {
  baixa: "Baixa",
  media: "Média",
  alta:  "Alta",
};

const priorityColor: Record<string, string> = {
  baixa: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  media: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  alta:  "text-red-400 bg-red-500/10 border-red-500/20",
};

export default function OverdueTasks({ tasks }: Props) {
  const overdue = tasks
    .filter((t) => t.status !== "concluida" && new Date(t.dueDate + "T23:59:59") < new Date())
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  if (overdue.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/15">
          <AlertCircle size={16} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-emerald-400">Tudo em dia!</p>
          <p className="text-xs text-slate-500 mt-0.5">Nenhuma tarefa vencida no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle size={15} className="text-red-400" />
          <h3 className="text-sm font-semibold text-red-400">
            Tarefas vencidas ({overdue.length})
          </h3>
        </div>
        <Link href="/tasks?status=pendente" className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors">
          Ver todas <ArrowRight size={12} />
        </Link>
      </div>
      <ul className="flex flex-col gap-2">
        {overdue.map((task) => (
          <li key={task.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-white/20">
            <p className="text-sm text-slate-300 truncate flex-1">{task.title}</p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColor[task.priority]}`}>
                {priorityLabel[task.priority]}
              </span>
              <span className="text-xs text-red-400">
                {new Date(task.dueDate + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
