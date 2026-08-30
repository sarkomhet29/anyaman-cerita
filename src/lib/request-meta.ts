// ============================================================
// Bantuan membaca alamat IP / user-agent dari header request.
// Dipakai untuk rate limiting & log login admin.
// ============================================================

export function ambilIPFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") || "unknown";
}

export function ambilUserAgentFromHeaders(headers: Headers): string {
  return headers.get("user-agent") || "";
}