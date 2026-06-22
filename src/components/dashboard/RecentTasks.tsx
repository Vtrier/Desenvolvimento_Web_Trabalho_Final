"use client";

import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle2, Clock, RotateCcw } from "lucide-react";
import { Task } from "@/types/task";
import { calcProgress } from "@/components/tasks/SubtaskList";

interface Props {
  tasks: Task[];
}

const statusIcon = {
  pendente:     <Clock size={13} className="text-yellow-400" />,
  em_progresso: <RotateCcw size={13} className="text-blue-400" />,
  concluida:    <CheckCircle2 size={13} className="text-emerald-400" />,
};

const priorityDot: Record<string, string> = {
  baixa: "bg-emerald-400",
  media: "bg-yellow-400",
  alta:  "bg-red-400",
};

export default function RecentTasks({ tasks }: Props) {
  const recent = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200">Tarefas recentes</h3>
        <Link
          href="/tasks"
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Ver todas <ArrowRight size={12} />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-slate-600">Nenhuma tarefa criada ainda.</p>
          <Link href="/tasks" className="mt-2 inline-block text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
            Criar primeira tarefa →
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {recent.map((task) => {
            const progress = calcProgress(task.subtasks ?? []);
            const hasSubtasks = (task.subtasks ?? []).length > 0;
            const overdue = task.status !== "concluida" && new Date(task.dueDate + "T23:59:59") < new Date();

            return (
              <li
                key={task.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                {/* Priority dot */}
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[task.priority]}`} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${task.status === "concluida" ? "line-through text-slate-500" : "text-slate-200"}`}>
                    {task.title}
                  </p>
                  {hasSubtasks && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-1 w-20 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${progress}%`,
                            background: progress === 100 ? "#22c55e" : "#6366f1",
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-600">{progress}%</span>
                    </div>
                  )}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs ${overdue ? "text-red-400" : "text-slate-600"} flex items-center gap-1`}>
                    <Calendar size={11} />
                    {new Date(task.dueDate + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </span>
                  {statusIcon[task.status]}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
