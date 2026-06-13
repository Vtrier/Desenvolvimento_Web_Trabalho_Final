export type Priority = "baixa" | "media" | "alta";
export type Status = "pendente" | "em_progresso" | "concluida";

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string; // ISO date string YYYY-MM-DD
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
}
