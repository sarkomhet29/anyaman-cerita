// Helper pure untuk mencocokkan alamat IP dengan aturan CIDR.
// Dipisah dari middleware.ts supaya bisa di-unit-test tanpa runtime Next.

function keBin(ip: string): string {
  return ip
    .split(".")
    .map((n) => parseInt(n, 10).toString(2).padStart(8, "0"))
    .join("");
}

/** Apakah ip berada dalam CIDR (misal "192.168.1.0/24") atau sama persis. */
export function ipDalamCidr(ip: string, cidr: string): boolean {
  const [net, bitsStr] = cidr.split("/");
  const bits = bitsStr ? parseInt(bitsStr, 10) : 32;
  const a = keBin(ip);
  const b = keBin(net);
  if (a.length !== 32 || b.length !== 32) return false;
  return a.slice(0, bits) === b.slice(0, bits);
}

/** Whitelist kosong = semua IP diizinkan. */
export function ipDiizinkan(ip: string, list: string[]): boolean {
  if (list.length === 0) return true;
  return list.some((rule) =>
    rule.includes("/") ? ipDalamCidr(ip, rule) : ip === rule
  );
}