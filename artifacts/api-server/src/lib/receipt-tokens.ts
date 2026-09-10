import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function createReceiptUploadToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashReceiptUploadToken(token) };
}

export function hashReceiptUploadToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function matchesReceiptUploadToken(token: string, expectedHash: string | null): boolean {
  if (!expectedHash || !token) return false;
  const actual = Buffer.from(hashReceiptUploadToken(token), "utf8");
  const expected = Buffer.from(expectedHash, "utf8");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}