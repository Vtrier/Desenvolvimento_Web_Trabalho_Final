"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthError } from "firebase/auth";
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  loginWithGithub,
  logout,
  mapFirebaseError,
  deleteAccount
} from "@/services/auth.service";

export function useAuthActions() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function clearError() {
    setError(null);
  }

  async function handleRegister(
    name: string,
    email: string,
    password: string
  ): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      await registerWithEmail(name, email, password);
      return true;
    } catch (err) {
      setError(mapFirebaseError(err as AuthError));
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailLogin(
    email: string,
    password: string
  ): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithEmail(email, password);
      if (!user.emailVerified) {
        setError(
          "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada."
        );
        await logout();
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      setError(mapFirebaseError(err as AuthError));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError(mapFirebaseError(err as AuthError));
    } finally {
      setLoading(false);
    }
  }

  async function handleGithubLogin(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      await loginWithGithub();
      router.push("/dashboard");
    } catch (err) {
      setError(mapFirebaseError(err as AuthError));
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout(): Promise<void> {
    await logout();
    router.push("/login");
  }

  async function handleDeleteAccountAction(password?: string): Promise<boolean> {
    setLoading(true);
    setError(null);
    try {
      await deleteAccount(password);
      router.push("/");
      return true;
    } catch (err) {
      console.error("Erro ao apagar conta:", err);
      setError(mapFirebaseError(err as AuthError));
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    clearError,
    handleRegister,
    handleEmailLogin,
    handleGoogleLogin,
    handleGithubLogin,
    handleLogout,
    handleDeleteAccountAction
  };
}