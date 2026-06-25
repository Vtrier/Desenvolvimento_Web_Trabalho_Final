"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { loginSchema, LoginSchema } from "@/lib/validations";
import { useAuthActions } from "@/hooks/useAuthActions";
import { resendVerificationEmail } from "@/services/auth.service";
import AuthCard from "./AuthCard";
import InputField from "./InputField";
import SocialButton from "./SocialButton";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.7 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.5 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.7 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.7 36 24 36c-5.3 0-9.6-3-11.3-7.2l-6.5 5C9.7 39.6 16.3 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.2 5.2C37 38.4 44 33 44 24c0-1.3-.1-2.6-.4-3.9z"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export default function LoginForm() {
  const { loading, error, clearError, handleEmailLogin, handleGoogleLogin, handleGithubLogin } =
    useAuthActions();
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginSchema) {
    clearError();
    await handleEmailLogin(data.email, data.password);
  }

  async function handleSocial(provider: "google" | "github") {
    setSocialLoading(provider);
    clearError();
    try {
      if (provider === "google") await handleGoogleLogin();
      else await handleGithubLogin();
    } finally {
      setSocialLoading(null);
    }
  }

  async function handleResend() {
    try {
      await resendVerificationEmail();
      toast.success("E-mail de verificação reenviado!");
    } catch {
      toast.error("Erro ao reenviar e-mail. Faça login primeiro.");
    }
  }

  return (
    <AuthCard
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta para continuar"
      footer={{ text: "Não tem conta?", linkLabel: "Cadastre-se", href: "/register" }}
    >
      {/* Social logins */}
      <div className="flex flex-col gap-3">
        <SocialButton
          icon={<GoogleIcon />}
          label="Entrar com Google"
          loading={socialLoading === "google"}
          onClick={() => handleSocial("google")}
        />
        <SocialButton
          icon={<GithubIcon />}
          label="Entrar com GitHub"
          loading={socialLoading === "github"}
          onClick={() => handleSocial("github")}
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-slate-500 uppercase tracking-wider">ou</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Email form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
        aria-label="Formulário de login"
      >
        <InputField
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <InputField
          label="Senha"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Global error */}
        {error && (
          <div
            role="alert"
            className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400"
          >
            {error}
            {error.includes("Confirme seu e-mail") && (
              <button
                type="button"
                onClick={handleResend}
                className="ml-2 underline text-red-300 hover:text-red-200 text-xs"
              >
                Reenviar e-mail
              </button>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="
            flex items-center justify-center gap-2 w-full py-3 rounded-xl
            bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700
            text-white font-semibold text-sm transition-all duration-150
            disabled:opacity-60 disabled:cursor-not-allowed
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400
          "
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Entrar
        </button>
      </form>
    </AuthCard>
  );
}
