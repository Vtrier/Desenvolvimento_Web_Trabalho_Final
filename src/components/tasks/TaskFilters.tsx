"use client";

import { Search, X } from "lucide-react";
import { FilterPriority, FilterStatus } from "@/hooks/useTasks";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  filterPriority: FilterPriority;
  onPriority: (v: FilterPriority) => void;
  filterStatus: FilterStatus;
  onStatus: (v: FilterStatus) => void;
  total: number;
  filtered: number;
}

const priorities: { value: FilterPriority; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "baixa", label: "🟢 Baixa" },
  { value: "media", label: "🟡 Média" },
  { value: "alta", label: "🔴 Alta" },
];

const statuses: { value: FilterStatus; label: string }[] = [
  { value: "todas", label: "Todos" },
  { value: "pendente", label: "Pendente" },
  { value: "em_progresso", label: "Em progresso" },
  { value: "concluida", label: "Concluída" },
];

export default function TaskFilters({ search, onSearch, filterPriority, onPriority, filterStatus, onStatus, total, filtered }: Props) {
  const hasFilters = filterPriority !== "todas" || filterStatus !== "todas" || search !== "";

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar tarefas..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all"
        />
        {search && (
          <button onClick={() => onSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter chips row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 mr-1">Prioridade:</span>
        {priorities.map((p) => (
          <button
            key={p.value}
            onClick={() => onPriority(p.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border
              ${filterPriority === p.value
                ? "bg-indigo-600 text-white border-indigo-500"
                : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200"
              }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 mr-1">Status:</span>
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => onStatus(s.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border
              ${filterStatus === s.value
                ? "bg-indigo-600 text-white border-indigo-500"
                : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200"
              }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Result count + clear */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {hasFilters ? `${filtered} de ${total} tarefas` : `${total} tarefa${total !== 1 ? "s" : ""}`}
        </p>
        {hasFilters && (
          <button
            onClick={() => { onPriority("todas"); onStatus("todas"); onSearch(""); }}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}
