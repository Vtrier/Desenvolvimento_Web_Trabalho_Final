"use client";

import { useState, KeyboardEvent } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { Subtask } from "@/types/task";

interface Props {
  subtasks: Subtask[];
  onChange: (subtasks: Subtask[]) => void;
  readOnly?: boolean;
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function calcProgress(subtasks: Subtask[]): number {
  if (!subtasks.length) return 0;
  return Math.round((subtasks.filter((s) => s.completed).length / subtasks.length) * 100);
}

export default function SubtaskList({ subtasks, onChange, readOnly = false }: Props) {
  const [newTitle, setNewTitle] = useState("");

  function addSubtask() {
    const title = newTitle.trim();
    if (!title) return;
    onChange([...subtasks, { id: generateId(), title, completed: false }]);
    setNewTitle("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); addSubtask(); }
  }

  function toggleSubtask(id: string) {
    onChange(subtasks.map((s) => s.id === id ? { ...s, completed: !s.completed } : s));
  }

  function removeSubtask(id: string) {
    onChange(subtasks.filter((s) => s.id !== id));
  }

  const progress = calcProgress(subtasks);
  const done = subtasks.filter((s) => s.completed).length;

  return (
    <div className="flex flex-col gap-3">

      {/* Progress bar — só aparece se tiver subtarefas */}
      {subtasks.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Progresso</span>
            <span className="text-slate-300 font-medium">{done}/{subtasks.length} · {progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: progress === 100
                  ? "#22c55e"
                  : progress >= 50
                  ? "#6366f1"
                  : "#eab308",
              }}
            />
          </div>
        </div>
      )}

      {/* Lista de subtarefas */}
      {subtasks.length > 0 && (
        <ul className="flex flex-col gap-1.5" role="list" aria-label="Subtarefas">
          {subtasks.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-2.5 group px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <button
                type="button"
                onClick={() => !readOnly && toggleSubtask(s.id)}
                aria-label={s.completed ? "Marcar como não concluída" : "Marcar como concluída"}
                aria-pressed={s.completed}
                className={`
                  flex-shrink-0 w-4.5 h-4.5 rounded border transition-all
                  flex items-center justify-center
                  ${s.completed
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-white/30 hover:border-indigo-400"}
                  ${readOnly ? "cursor-default" : "cursor-pointer"}
                `}
                style={{ width: 18, height: 18 }}
              >
                {s.completed && <Check size={11} className="text-white" strokeWidth={3} />}
              </button>
              <span className={`flex-1 text-sm transition-all ${s.completed ? "line-through text-slate-500" : "text-slate-200"}`}>
                {s.title}
              </span>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => removeSubtask(s.id)}
                  aria-label={`Remover subtarefa: ${s.title}`}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-0.5"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Input para nova subtarefa */}
      {!readOnly && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Adicionar subtarefa..."
            aria-label="Nova subtarefa"
            className="flex-1 px-3 py-2 rounded-lg text-sm text-slate-100 placeholder:text-slate-600 bg-white/5 border border-white/10 hover:border-white/20 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all"
          />
          <button
            type="button"
            onClick={addSubtask}
            disabled={!newTitle.trim()}
            aria-label="Adicionar subtarefa"
            className="px-3 py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <Plus size={15} />
          </button>
        </div>
      )}

      {subtasks.length === 0 && readOnly && (
        <p className="text-xs text-slate-600 italic">Nenhuma subtarefa.</p>
      )}
    </div>
  );
}
