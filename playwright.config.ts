import { defineConfig, devices } from "@playwright/test";

const PORT = 3107;
const TEST_DB = "postgresql://myapp:gantidenganpasswordkuat@localhost:5432/myapp_test";
// Secret khusus test di atas 16 karakter — TIDAK dipakai di production.
const TEST_SECRET = "kunci_e2e_test_acak_panjang_48_karakter_1234!";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1, // 1 worker: rate limiter in-memory + seed DB dipakai bersama
  retries: 0,
  timeout: 180_000,
  expect: { timeout: 15_000 },
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  webServer: {
    command: `node e2e/db.mjs seed && npx next dev -p ${PORT}`,
    port: PORT,
    reuseExistingServer: false,
    timeout: 300_000,
    env: {
      DATABASE_URL: TEST_DB,
      SESSION_SECRET: TEST_SECRET,
      NODE_ENV: "development",
      // Redirect manual checkout (api/checkout) memakai NEXT_PUBLIC_APP_URL;
      // tanpa ini browser test diarahkan ke localhost:3000 (host salah).
      NEXT_PUBLIC_APP_URL: `http://localhost:${PORT}`,
    },
  },
});