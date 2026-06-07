"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, X, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { deleteAccount, mapFirebaseError } from "@/services/auth.service";
import { AuthError } from "firebase/auth";
import InputField from "./InputField";

const schema = z.object({
  confirm: z.string().refine((v) => v === "EXCLUIR", {
    message: 'Digite exatamente "EXCLUIR" para confirmar.',
  }),
  password: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
}

export default function DeleteAccountModal({ onClose }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = auth.currentUser;
  const isEmailProvider = user?.providerData.some((p) => p.providerId === "password");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  async function onSubmit(data: Schema) {
    setLoading(true);
    setError(null);
    try {
      await deleteAccount(data.password);
      toast.success("Conta excluída com sucesso.");
      router.push("/login");
    } catch (err) {
      setError(mapFirebaseError(err as AuthError));
    } finally {
      setLoading(false);
    }
  }

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-6 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30">
              <Trash2 size={18} className="text-red-400" />
            </div>
            <div>
              <h2 id="delete-modal-title" className="text-base font-semibold text-white">
                Excluir conta
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Esta ação é permanente e irreversível</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="text-slate-500 hover:text-slate-300 transition-colors mt-0.5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Warning */}
        <div className="flex gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300 leading-relaxed">
            Ao excluir sua conta, todos os seus dados serão permanentemente removidos,
            incluindo tarefas, subtarefas e histórico. Não será possível recuperar.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">

          {/* Senha (só para usuários email/senha) */}
          {isEmailProvider && (
            <InputField
              label="Sua senha atual"
              type="password"
              placeholder="Digite sua senha para confirmar"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />
          )}

          {/* Campo de confirmação */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">
              Digite <span className="text-red-400 font-mono font-bold">EXCLUIR</span> para confirmar
            </label>
            <input
              type="text"
              placeholder="EXCLUIR"
              autoComplete="off"
              aria-invalid={!!errors.confirm}
              className={`
                w-full px-4 py-3 rounded-xl text-sm text-slate-100 placeholder:text-slate-600
                bg-white/5 border transition-all duration-150 outline-none font-mono tracking-widest
                focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50
                ${errors.confirm ? "border-red-500/60 bg-red-500/5" : "border-white/10"}
              `}
              {...register("confirm")}
            />
            {errors.confirm && (
              <p role="alert" className="text-xs text-red-400">{errors.confirm.message}</p>
            )}
          </div>

          {/* Erro global */}
          {error && (
            <div role="alert" className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300
                hover:bg-white/5 text-sm font-medium transition-all
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500
              "
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="
                flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                bg-red-600 hover:bg-red-500 active:bg-red-700
                text-white text-sm font-semibold transition-all
                disabled:opacity-60 disabled:cursor-not-allowed
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400
              "
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              Excluir minha conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
