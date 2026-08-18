# Starter Project — Next.js + Tailwind + Prisma + PostgreSQL

Struktur fundamental untuk website yang kuat, aman, dan gratis — dirancang
untuk dijalankan di server pribadi (misalnya laptop + CasaOS + Cloudflare Tunnel).

## Struktur folder penting

```
myapp/
├── docker-compose.yml       # Jalankan PostgreSQL lokal
├── .env.example             # Contoh environment variable (salin jadi .env)
├── prisma/
│   └── schema.prisma        # Struktur/model database
├── src/
│   ├── middleware.ts        # Security header + rate limiting (jalan di semua request)
│   ├── lib/
│   │   ├── prisma.ts        # Koneksi database (singleton)
│   │   ├── validation.ts    # Schema validasi input (zod)
│   │   └── auth.ts          # Hashing password (bcrypt)
│   └── app/
│       └── api/register/route.ts  # Contoh API aman: validasi → cek → hash → simpan
```

## Cara menjalankan di laptop kamu

1. **Install dependency**
   ```bash
   npm install
   ```

2. **Jalankan PostgreSQL** (butuh Docker terpasang, atau pakai Postgres dari CasaOS App Store)
   ```bash
   docker compose up -d
   ```

3. **Siapkan environment variable**
   ```bash
   cp .env.example .env
   # lalu edit .env, ganti password dengan yang kuat
   ```

4. **Generate Prisma client & migrasi database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Jalankan development server**
   ```bash
   npm run dev
   ```
   Buka http://localhost:3000

## Checklist sebelum online lewat Cloudflare Tunnel

- [ ] Ganti semua password default di `.env` dan `docker-compose.yml`
- [ ] Aktifkan Cloudflare WAF (Security → WAF) di dashboard domain kamu
- [ ] Set `NODE_ENV=production` saat deploy
- [ ] Jalankan `npm run build` lalu `npm start` untuk mode production (lebih cepat & aman dari dev mode)
- [ ] Backup database berkala (`pg_dump`) ke cloud storage gratis
- [ ] Update dependency berkala: `npm audit fix`

## Kenapa pilihan ini?

- **Next.js**: frontend + backend jadi satu, hemat resource untuk laptop spek menengah
- **Prisma**: query otomatis aman dari SQL injection, schema mudah dibaca
- **zod**: memastikan semua input user tervalidasi sebelum diproses
- **bcrypt**: password tidak pernah disimpan dalam bentuk asli
- **middleware.ts**: security header + rate limit dasar tanpa perlu library tambahan
