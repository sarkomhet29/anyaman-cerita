import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Halaman lama — digantikan daftar pesanan lengkap di /panel-kelola/pesanan.
export default function AdminVerifikasiRedirect() {
  redirect("/panel-kelola/pesanan");
}