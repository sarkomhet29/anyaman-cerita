"use client";

import { useRouter } from "next/navigation";
import { reviewPembayaranAction } from "@/app/panel-kelola/actions";

export type BarisPesanan = {
  id: string;
  orderId: string;
  status: string;
  amount: number;
  buktiUrl: string | null;
  createdAt: string;
  userName: string | null;
  userEmail: string;
  paketNama: string;
  undanganNama: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  menunggu_verifikasi: "Menunggu Verifikasi",
  aktif: "Aktif",
  ditolak: "Ditolak",
  success: "Berhasil",
  failed: "Gagal",
  expired: "Kadaluarsa",
};

const STATUS_WARNA: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  menunggu_verifikasi: "bg-blue-100 text-blue-800",
  aktif: "bg-green-100 text-green-800",
  ditolak: "bg-red-100 text-red-800",
  success: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  expired: "bg-gray-200 text-gray-700",
};

export function PesananRow({ row }: { row: BarisPesanan }) {
  const router = useRouter();
  const menunggu = row.status === "menunggu_verifikasi";

  return (
    <tr
      onClick={() => router.push(`/panel-kelola/pesanan/${row.id}`)}
      className="cursor-pointer border-b border-line transition-colors hover:bg-surface-2/60"
    >
      {/* Klien */}
      <td className="py-4 px-4">
        <p className="font-medium text-ink">{row.userName || row.userEmail}</p>
        <p className="text-xs text-ink-soft">{row.userEmail}</p>
      </td>

      {/* Paket & harga */}
      <td className="py-4 px-4">
        <p className="text-sm font-medium text-ink">{row.paketNama}</p>
        <p className="text-xs text-ink-soft">
          Rp{row.amount.toLocaleString("id-ID")}
        </p>
      </td>

      {/* Tanggal */}
      <td className="py-4 px-4 whitespace-nowrap text-sm text-ink-soft">
        {new Date(row.createdAt).toLocaleString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            STATUS_WARNA[row.status] || "bg-gray-200 text-gray-700"
          }`}
        >
          {STATUS_LABEL[row.status] || row.status}
        </span>
      </td>

      {/* Thumbnail bukti */}
      <td className="py-4 px-4">
        {row.buktiUrl ? (
          <a
            href={row.buktiUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={row.buktiUrl}
              alt="Bukti transfer"
              className="h-12 w-16 rounded-lg border border-line object-cover"
            />
          </a>
        ) : (
          <span className="text-xs text-ink-soft">-</span>
        )}
      </td>

      {/* Aksi */}
      <td className="py-4 px-4">
        {menunggu ? (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <form action={reviewPembayaranAction}>
              <input type="hidden" name="transactionId" value={row.id} />
              <input type="hidden" name="keputusan" value="setujui" />
              <button
                type="submit"
                className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
              >
                Setujui
              </button>
            </form>
            <form action={reviewPembayaranAction}>
              <input type="hidden" name="transactionId" value={row.id} />
              <input type="hidden" name="keputusan" value="tolak" />
              <button
                type="submit"
                className="rounded-full border border-red-300 px-4 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
              >
                Tolak
              </button>
            </form>
          </div>
        ) : (
          <span className="text-xs text-accent">Detail →</span>
        )}
      </td>
    </tr>
  );
}