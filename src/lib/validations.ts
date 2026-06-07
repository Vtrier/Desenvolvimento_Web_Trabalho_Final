import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nome deve ter ao menos 2 caracteres.")
      .max(60, "Nome muito longo."),
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
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Informe sua senha."),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
