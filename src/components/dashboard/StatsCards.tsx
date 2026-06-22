"use client";

import { Clock, CheckCircle2, AlertCircle, ListTodo } from "lucide-react";
import { Task } from "@/types/task";

interface Props {
  tasks: Task[];
}

export default function StatsCards({ tasks }: Props) {
  const total      = tasks.length;
  const pendentes  = tasks.filter((t) => t.status === "pendente").length;
  const progresso  = tasks.filter((t) => t.status === "em_progresso").length;
  const concluidas = tasks.filter((t) => t.status === "concluida").length;
  const vencidas   = tasks.filter((t) => {
    if (t.status === "concluida") return false;
    return new Date(t.dueDate + "T23:59:59") < new Date();
  }).length;

  const pctConcluidas = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  const cards = [
    {
      label: "Total de tarefas",
      value: total,
      icon: ListTodo,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      sub: `${pctConcluidas}% concluídas`,
    },
    {
      label: "Pendentes",
      value: pendentes,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      sub: `${progresso} em progresso`,
    },
    {
      label: "Concluídas",
      value: concluidas,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      sub: `esta semana`,
    },
    {
      label: "Vencidas",
      value: vencidas,
      icon: AlertCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      sub: vencidas > 0 ? "requerem atenção" : "nenhuma vencida",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className={`rounded-2xl border ${c.border} ${c.bg} p-5 flex flex-col gap-3`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{c.label}</span>
              <div className={`p-2 rounded-lg bg-white/20`}>
                <Icon size={15} className={c.color} />
              </div>
            </div>
            <div>
              <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
              <p className="text-xs text-slate-500 mt-1">{c.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
