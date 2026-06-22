export type Priority = "baixa" | "media" | "alta";
export type Status = "pendente" | "em_progresso" | "concluida";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  subtasks: Subtask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  subtasks: Subtask[];
}
