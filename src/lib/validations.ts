import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter ao menos 2 caracteres.").max(60, "Nome muito longo."),
    email: z.string().email("E-mail inválido."),
    password: z
      .string()
      .min(8, "Senha deve ter ao menos 8 caracteres.")
      .regex(/[A-Z]/, "Deve conter ao menos uma letra maiúscula.")
      .regex(/[a-z]/, "Deve conter ao menos uma letra minúscula.")
      .regex(/[0-9]/, "Deve conter ao menos um número.")
      .regex(/[^A-Za-z0-9]/, "Deve conter ao menos um caractere especial."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Informe sua senha."),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório.").max(100, "Título muito longo."),
  description: z.string().max(500, "Descrição muito longa.").optional().default(""),
  priority: z.enum(["baixa", "media", "alta"], { required_error: "Selecione a prioridade." }),
  status: z.enum(["pendente", "em_progresso", "concluida"], { required_error: "Selecione o status." }),
  dueDate: z.string().min(1, "Data de vencimento é obrigatória."),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type TaskSchema = z.infer<typeof taskSchema>;
