import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const EKSTENSI: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

/**
 * POST /api/upload
 * Unggah bukti transfer (gambar). Hanya user login.
 * Field multipart: file (gambar).
 */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dirUpload = path.join(process.cwd(), "public", "uploads");

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    const berkas = file as File;
    const tipe = berkas.type;

    if (!EKSTENSI[tipe]) {
      return NextResponse.json(
        { error: "Format harus JPG, PNG, atau WEBP" },
        { status: 400 }
      );
    }

    if (berkas.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5 MB" },
        { status: 400 }
      );
    }

    // Nama file unik + acak agar tidak tabrakan & tidak bisa ditebak
    const nama =
      `${Date.now()}-${Math.random().toString(36).slice(2, 10)}` +
      EKSTENSI[tipe];
    const alamat = path.join(dirUpload, nama);

    await fs.mkdir(dirUpload, { recursive: true });
    await fs.writeFile(alamat, Buffer.from(await berkas.arrayBuffer()));

    const url = `/uploads/${nama}`;

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}
