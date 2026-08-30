import { test, expect } from "@playwright/test";

// ==================================================================
// Alur pembayaran end-to-end:
//   register klien → buat undangan → checkout manual → upload bukti
//   → admin verifikasi (setujui/tolak) → undangan aktif / reupload.
// Database di-reset via `node e2e/db.mjs seed` saat webServer start.
// Hubungan antar-test dijamin lewat email unik per run.
// ==================================================================

// 1x1 PNG transparan — cukup sebagai bukti transfer "asli".
const PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

const ADMIN_FLOW = { email: "adminflow@test.local", password: "Admin@12345" };

function hurufAcak() {
  return Math.random().toString(36).slice(2, 10);
}

function emailUnik() {
  return `klien-${Date.now()}-${hurufAcak()}@test.local`;
}

// ----------------------------- WARMUP -----------------------------
// next dev mengompilasi route secara on-demand. Test pertama yang memuat
// route baru bisa kena 10-30 detik compile. Test ini memuat semua halaman
// sekali (dengan sesi klien & admin asli) supaya test berikutnya berjalan
// di route yang sudah hangat.
test.describe("0. Warmup — kompilasi route dev", () => {
  test("klien & admin memuat semua halaman utama", async ({ browser }) => {
    test.setTimeout(420_000);

    const klien = await browser.newContext();
    const hlm = await klien.newPage();
    await registerKlien(hlm, emailUnik());
    for (const p of [
      "/",
      "/harga",
      "/tema",
      "/buat",
      "/buat/berhasil?slug=warmup",
      "/checkout",
      "/dashboard",
      "/u/slug-warmup",
    ]) {
      await hlm.goto(p);
    }
    await klien.close();

    const admin = await browser.newContext();
    const hlmAdmin = await admin.newPage();
    await loginAdmin(hlmAdmin);
    for (const p of [
      "/panel-kelola",
      "/panel-kelola/pesanan",
      "/panel-kelola/pesanan/000",
      "/panel-kelola/users",
      "/panel-kelola/transactions",
      "/panel-kelola/undangan",
      "/panel-kelola/paket",
      "/panel-kelola/contact",
      "/panel-kelola/verifikasi",
      "/panel-kelola/keamanan",
    ]) {
      await hlmAdmin.goto(p);
    }
    await admin.close();
  });
});

// ----------------------------- HELPERS -----------------------------

async function registerKlien(page, email) {
  await page.goto("/register");
  await page.fill('input[name="name"]', "Noval Client");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="phone"]', "081234567890");
  await page.fill('input[name="password"]', "Klien@12345");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard");
}

async function buatUndangan(page, nama = "Noval & Sita") {
  await page.goto("/buat");
  await page.selectOption('select[name="jenisAcara"]', "Pernikahan");
  await page.fill('input[name="namaUtama"]', nama);
  await page.fill('input[name="tanggalAcara"]', "2027-01-15");
  await page.fill('input[name="waktuAcara"]', "09.00 - selesai");
  await page.fill('input[name="lokasi"]', "Gedung Serbaguna Anggrek");
  await page.fill('textarea[name="alamatLengkap"]', "Jl. Contoh No. 10, Bogor");
  await page.fill(
    'textarea[name="pesanUndangan"]',
    "Dengan penuh syukur kami mengundang Anda."
  );
  await page.click('button:has-text("Buat Undangan")');
  await page.waitForURL(/\/buat\/berhasil\?slug=/);
  return new URL(page.url()).searchParams.get("slug");
}

async function checkoutManual(page) {
  await page.goto("/harga");
  const btnDasar = page.locator('button:has-text("Pilih Dasar")');
  await btnDasar.waitFor({ state: "visible" });
  await btnDasar.click();
  await page.waitForURL(/\/checkout\?paketId=/);
  await page.click('button:has-text("Lanjutkan Bayar Manual")');
  await page.waitForURL(/\/dashboard\/pembayaran\//);
  return new URL(page.url()).pathname.split("/").pop();
}

async function uploadBukti(page, { nama, mimeType, buffer, valid = true }) {
  await page.setInputFiles('input[type="file"]', { name: nama, mimeType, buffer });
  if (!valid) {
    await page.waitForSelector("text=Gagal mengunggah");
    return null;
  }
  await page.selectOption('select[name="undanganId"]', { index: 1 });
  await page.fill('input[name="phone"]', "081234567890");
  await page.click('button:has-text("Kirim Bukti Transfer")');
  // Server action + revalidatePath me-render ulang route; form diganti
  // tampilan "Menunggu Verifikasi Admin".
  await page.waitForSelector("text=Menunggu Verifikasi Admin");
  return true;
}

async function loginAdmin(page) {
  await page.goto("/panel-kelola/login");
  await page.fill('input[name="email"]', ADMIN_FLOW.email);
  await page.fill('input[name="password"]', ADMIN_FLOW.password);
  await page.click('button[type="submit"]');
  await page.waitForURL("**/panel-kelola");
}

async function keDetailPesanan(page, emailKlien) {
  await page.goto("/panel-kelola/pesanan");
  const baris = page.locator("tr", { hasText: emailKlien }).first();
  await baris.waitFor({ state: "visible" });
  await baris.click();
  await page.waitForURL(/\/panel-kelola\/pesanan\//);
}

// ----------------------------- POIN 1: HAPPY PATH -----------------------------

test.describe("1. Happy path: pesan → upload bukti → setujui → undangan aktif", () => {
  test("klien lunas & admin setujui → undangan bisa diakses", async ({
    browser,
  }) => {
    const klien = await browser.newContext();
    const hlm = await klien.newPage();
    const email = emailUnik();
    let slug = "";
    let txId = "";

    await registerKlien(hlm, email);
    slug = await buatUndangan(hlm);
    txId = await checkoutManual(hlm);
    await uploadBukti(hlm, {
      nama: "bukti.png",
      mimeType: "image/png",
      buffer: Buffer.from(PNG_BASE64, "base64"),
    });
    await hlm.waitForSelector("text=Menunggu Verifikasi Admin");
    expect(txId).toBeTruthy();

    const admin = await browser.newContext();
    const hlmAdmin = await admin.newPage();
    await loginAdmin(hlmAdmin);
    await hlmAdmin.goto("/panel-kelola/pesanan?tab=menunggu_verifikasi");
    await hlmAdmin.locator("tr", { hasText: email }).first().waitFor();
    await hlmAdmin.goto("/panel-kelola/pesanan");
    await keDetailPesanan(hlmAdmin, email);

    await expect(hlmAdmin.locator("span", { hasText: "Menunggu Verifikasi" })).toBeVisible();
    await hlmAdmin.fill('input[name="nominalBukti"]', "100000");
    await hlmAdmin.click('button[value="setujui"]');
    await expect(hlmAdmin.locator("span", { hasText: "Aktif" }).first()).toBeVisible();
    await expect(hlmAdmin.getByText("Diverifikasi oleh")).toBeVisible();

    // Undangan aktual muncul ke publik.
    await hlmAdmin.goto(`/u/${slug}`);
    await expect(hlmAdmin.locator("h1")).toContainText("Noval & Sita");

    // Klien melihat status disetujui di halaman pembayarannya.
    const hlmKlien = await klien.newPage();
    await hlmKlien.goto(`/dashboard/pembayaran/${txId}`);
    await expect(hlmKlien.getByText("Pembayaran Disetujui")).toBeVisible();
    await hlmKlien.goto("/dashboard");
    await expect(hlmKlien.locator("p", { hasText: "1 aktif" })).toBeVisible();

    await klien.close();
    await admin.close();
  });
});

// ----------------------------- POIN 1: TOLAK → REUPLOAD -----------------------------

test.describe("2. Alur tolak: bukti ditolak → klien unggah ulang → menunggu verifikasi", () => {
  test("admin tolak dengan catatan → klien upload ulang tanpa duplikat", async ({
    browser,
  }) => {
    const klien = await browser.newContext();
    const hlm = await klien.newPage();
    const email = emailUnik();

    await registerKlien(hlm, email);
    await buatUndangan(hlm);
    const txId = await checkoutManual(hlm);
    await uploadBukti(hlm, {
      nama: "bukti.png",
      mimeType: "image/png",
      buffer: Buffer.from(PNG_BASE64, "base64"),
    });
    await hlm.waitForSelector("text=Menunggu Verifikasi Admin");
    expect(txId).toBeTruthy();

    const admin = await browser.newContext();
    const hlmAdmin = await admin.newPage();
    await loginAdmin(hlmAdmin);
    await keDetailPesanan(hlmAdmin, email);
    await hlmAdmin.fill(
      'textarea[name="catatan"]',
      "Foto bukti buram, nominal tidak terbaca."
    );
    await hlmAdmin.click('button[value="tolak"]');
    await expect(hlmAdmin.locator("span", { hasText: "Ditolak" }).first()).toBeVisible();
    await expect(hlmAdmin.getByText("catatan", { exact: false })).toBeVisible();

    // Klien lihat status ditolak + form unggah ulang tersedia.
    await hlm.goto(`/dashboard/pembayaran/${txId}`);
    await expect(hlm.getByText("Pembayaran Ditolak")).toBeVisible();
    await uploadBukti(hlm, {
      nama: "bukti-v2.png",
      mimeType: "image/png",
      buffer: Buffer.from(PNG_BASE64, "base64"),
    });
    await hlm.waitForSelector("text=Menunggu Verifikasi Admin");

    // Transaksi tetap SATU (tidak ada duplikat) dan kembali menunggu verifikasi.
    await hlmAdmin.goto("/panel-kelola/pesanan?tab=menunggu_verifikasi");
    const barisSekarang = hlmAdmin.locator("tr", { hasText: email });
    await expect(barisSekarang).toHaveCount(1);

    await klien.close();
    await admin.close();
  });
});

// ----------------------------- POIN 2: INPUT TIDAK VALID -----------------------------

test.describe("3. Edge case input upload bukti", () => {
  test("file PDF / file >5MB ditolak; file valid diterima", async ({ browser }) => {
    const klien = await browser.newContext();
    const hlm = await klien.newPage();
    const email = emailUnik();

    await registerKlien(hlm, email);
    await buatUndangan(hlm);
    const txId = await checkoutManual(hlm);

    // .pdf → server tolak.
    await hlm.setInputFiles('input[type="file"]', {
      name: "bukti.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4\n%test hanya pengujian"),
    });
    await hlm.waitForSelector("text=Format harus JPG, PNG, atau WEBP");

    // >5 MB → server tolak.
    await hlm.setInputFiles('input[type="file"]', {
      name: "besar.png",
      mimeType: "image/png",
      buffer: Buffer.alloc(6 * 1024 * 1024, 1),
    });
    await hlm.waitForSelector("text=Ukuran file maksimal 5 MB");

    // Valid → sukses.
    await uploadBukti(hlm, {
      nama: "bukti.png",
      mimeType: "image/png",
      buffer: Buffer.from(PNG_BASE64, "base64"),
    });
    await hlm.waitForSelector("text=Menunggu Verifikasi Admin");
    expect(txId).toBeTruthy();

    await klien.close();
  });
});

// ----------------------------- POIN 2: KESENJANGAN YANG DIKETAHUI -----------------------------

test.describe("4. Kesenjangan yang perlu perbaikan (tidak dijalankan)", () => {
  // GAP #1: /u/[slug] tidak mengecek status/aktifSampai. Saat ini undangan
  // berstatus "draft" (belum bayar/daftar) tetap bisa dilihat publik.
  // Setelah diperbaiki, ubah test.fixme → test dan hapus komentar.
  test.fixme(
    "undangan draft (belum bayar) tidak boleh tampil ke publik",
    async ({ browser }) => {
      const klien = await browser.newContext();
      const hlm = await klien.newPage();
      await registerKlien(hlm, emailUnik());
      const slug = await buatUndangan(hlm);

      await hlm.goto(`/u/${slug}`);
      await expect(hlm.locator("h1")).toContainText("Noval & Sita");
      await klien.close();
    }
  );

  // GAP #2: POST /api/checkout tidak dedup. Dua request paralel dengan
  // paket yang sama menciptakan dua baris transaction (orderId unik = Date.now).
  // Setelah diperbaiki (misal locking per user/paket), ubah fixme → test.
  test.fixme("checkout ganda (double-submit) tidak membuat 2 transaksi", async ({
    browser,
  }) => {
    const klien = await browser.newContext();
    const hlm = await klien.newPage();
    await registerKlien(hlm, emailUnik());

    const paket = await (await hlm.request.get("/api/paket")).json();
    const dasar = paket.find((p) => p.nama === "Dasar");

    await Promise.all([
      hlm.request.post("/api/checkout", {
        data: { paketId: dasar.id, method: "manual" },
      }),
      hlm.request.post("/api/checkout", {
        data: { paketId: dasar.id, method: "manual" },
      }),
    ]);

    const res = await hlm.request.get("/api/fitur");
    await expect(res.ok()).toBeTruthy();
    await klien.close();
  });
});