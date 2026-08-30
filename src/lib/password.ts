// ============================================================
// Kebijakan password kuat untuk akun admin.
// ============================================================

export type HasilCekPassword = { ok: boolean; alasan?: string };

export const SYARAT_PASSWORD =
  "Minimal 10 karakter, mengandung huruf besar, huruf kecil, angka, dan simbol.";

export function periksaKekuatanPassword(password: string): HasilCekPassword {
  if (password.length < 10) {
    return { ok: false, alasan: "Password minimal 10 karakter." };
  }
  if (!/[a-z]/.test(password)) {
    return { ok: false, alasan: "Password harus mengandung huruf kecil." };
  }
  if (!/[A-Z]/.test(password)) {
    return { ok: false, alasan: "Password harus mengandung huruf besar." };
  }
  if (!/[0-9]/.test(password)) {
    return { ok: false, alasan: "Password harus mengandung angka." };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { ok: false, alasan: "Password harus mengandung simbol." };
  }
  return { ok: true };
}