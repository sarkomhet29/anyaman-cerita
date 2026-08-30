import { z } from "zod";

// Contoh schema validasi input — semua data dari user WAJIB divalidasi
// sebelum diproses/disimpan ke database.

export const registerSchema = z.object({
  email: z.string().email("Email tidak valid"),
  name: z.string().min(2, "Nama minimal 2 karakter").optional(),
  phone: z
    .string()
    .regex(/^[0-9+\s-]{8,20}$/, "Nomor WhatsApp tidak valid")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/[0-9]/, "Password harus mengandung angka"),
});

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
