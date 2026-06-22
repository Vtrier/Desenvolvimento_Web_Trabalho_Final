import type { Metadata } from "next";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { TasksProvider } from "@/contexts/TasksContext";
import VLibras from "@/components/VLibras";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskFlow — Gerencie suas tarefas",
  description: "Sistema moderno de gerenciamento de tarefas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider>
        <AuthProvider>
          <TasksProvider>
            {children}
            <Toaster richColors position="top-right" />
            <VLibras />
          </TasksProvider>
        </AuthProvider>
      </ThemeProvider>
      </body>
    </html>
  );
}