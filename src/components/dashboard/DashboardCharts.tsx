"use client";

import {
  DonutChart,
  BarChart,
  AreaChart,
  Legend,
} from "@tremor/react";
import { Task } from "@/types/task";

interface Props {
  tasks: Task[];
}

const statusColors: Record<string, string> = {
  "Pendente":     "yellow",
  "Em progresso": "blue",
  "Concluída":    "emerald",
};

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-48 flex items-center justify-center">
      <p className="text-sm text-slate-600 text-center max-w-[200px] leading-relaxed">{message}</p>
    </div>
  );
}

function ChartCard({ title, children, fullWidth = false }: { title: string; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-slate-900/60 p-5 ${fullWidth ? "lg:col-span-2" : ""}`}>
      <p className="text-sm font-semibold text-slate-200 mb-4">{title}</p>
      {children}
    </div>
  );
}

export default function DashboardCharts({ tasks }: Props) {
  const isEmpty = tasks.length === 0;

  // ── Donut: por status ──────────────────────────────────────
  const statusData = [
    { name: "Pendente",     count: tasks.filter((t) => t.status === "pendente").length },
    { name: "Em progresso", count: tasks.filter((t) => t.status === "em_progresso").length },
    { name: "Concluída",    count: tasks.filter((t) => t.status === "concluida").length },
  ].filter((d) => d.count > 0);

  // ── Bar: por prioridade ────────────────────────────────────
  const priorityData = [
    {
      prioridade: "Baixa",
      Pendentes:  tasks.filter((t) => t.priority === "baixa" && t.status === "pendente").length,
      Concluídas: tasks.filter((t) => t.priority === "baixa" && t.status === "concluida").length,
    },
    {
      prioridade: "Média",
      Pendentes:  tasks.filter((t) => t.priority === "media" && t.status === "pendente").length,
      Concluídas: tasks.filter((t) => t.priority === "media" && t.status === "concluida").length,
    },
    {
      prioridade: "Alta",
      Pendentes:  tasks.filter((t) => t.priority === "alta" && t.status === "pendente").length,
      Concluídas: tasks.filter((t) => t.priority === "alta" && t.status === "concluida").length,
    },
  ];

  // ── Area: últimos 7 dias ───────────────────────────────────
  const last7 = getLast7Days();
  const areaData = last7.map((date) => {
    const label = new Date(date + "T00:00:00").toLocaleDateString("pt-BR", {
      day: "2-digit", month: "short",
    });
    return {
      data: label,
      "Tarefas criadas": tasks.filter((t) => {
        const d = t.createdAt instanceof Date ? t.createdAt : new Date(t.createdAt);
        return d.toISOString().split("T")[0] === date;
      }).length,
      "Tarefas concluídas": tasks.filter((t) => {
        const d = t.updatedAt instanceof Date ? t.updatedAt : new Date(t.updatedAt);
        return d.toISOString().split("T")[0] === date && t.status === "concluida";
      }).length,
    };
  });

  const tremorText = {
    className: "text-slate-300",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Donut — Status */}
      <ChartCard title="Distribuição por status">
        {isEmpty || statusData.length === 0 ? (
          <EmptyChart message="Crie tarefas para ver a distribuição por status" />
        ) : (
          <div className="dark">
            <DonutChart
              data={statusData}
              category="count"
              index="name"
              colors={statusData.map((d) => statusColors[d.name] ?? "slate")}
              showAnimation
              className="h-44"
              valueFormatter={(v) => `${v} tarefa${v !== 1 ? "s" : ""}`}
              noDataText="Sem dados"
            />
            <Legend
              categories={statusData.map((d) => d.name)}
              colors={statusData.map((d) => statusColors[d.name] ?? "slate")}
              className="mt-3 justify-center [&_*]:!text-slate-300"
            />
          </div>
        )}
      </ChartCard>

      {/* Bar — Prioridade */}
      <ChartCard title="Tarefas por prioridade">
        {isEmpty ? (
          <EmptyChart message="Crie tarefas para ver a distribuição por prioridade" />
        ) : (
          <div className="[&_.recharts-cartesian-axis-tick-value]:fill-slate-400 [&_.recharts-legend-item-text]:!text-slate-300 [&_.recharts-text]:fill-slate-400">
            <BarChart
              data={priorityData}
              index="prioridade"
              categories={["Pendentes", "Concluídas"]}
              colors={["yellow", "emerald"]}
              showAnimation
              showLegend
              className="h-44"
              valueFormatter={(v) => `${v}`}
            />
          </div>
        )}
      </ChartCard>

      {/* Area — Últimos 7 dias */}
      <ChartCard title="Atividade nos últimos 7 dias" fullWidth>
        {isEmpty ? (
          <EmptyChart message="Comece a criar tarefas para ver sua atividade ao longo do tempo" />
        ) : (
          <div className="[&_.recharts-cartesian-axis-tick-value]:fill-slate-400 [&_.recharts-legend-item-text]:!text-slate-300 [&_.recharts-text]:fill-slate-400">
            <AreaChart
              data={areaData}
              index="data"
              categories={["Tarefas criadas", "Tarefas concluídas"]}
              colors={["indigo", "emerald"]}
              showAnimation
              showLegend
              className="h-52"
              valueFormatter={(v) => `${v}`}
            />
          </div>
        )}
      </ChartCard>

    </div>
  );
}
