import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export const ADMIN_SESSION_COOKIE = "ihc_admin_session";

const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getSessionSecret(): string {
  const secret = process.env["SESSION_SECRET"];
  if (!secret) {
    throw new Error("SESSION_SECRET is required for admin authentication.");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env["NODE_ENV"] === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS * 1000,
  };
}

export function getAdminEmail(): string {
  return process.env["ADMIN_EMAIL"] ?? "admin@ivoryhealthclub.com";
}

export function createAdminSession(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      email,
      expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
    }),
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function getAdminSessionEmail(req: Request): string | null {
  const session = req.cookies?.[ADMIN_SESSION_COOKIE];
  if (typeof session !== "string") return null;

  const [payload, signature] = session.split(".");
  if (!payload || !signature || !safeEqual(sign(payload), signature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email?: unknown;
      expiresAt?: unknown;
    };

    if (
      typeof parsed.email !== "string" ||
      parsed.email !== getAdminEmail() ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt <= Date.now()
    ) {
      return null;
    }

    return parsed.email;
  } catch {
    return null;
  }
}

export function setAdminSession(res: Response, email: string): void {
  res.cookie(ADMIN_SESSION_COOKIE, createAdminSession(email), getCookieOptions());
}

export function clearAdminSession(res: Response): void {
  res.clearCookie(ADMIN_SESSION_COOKIE, getCookieOptions());
}

export function adminAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!getAdminSessionEmail(req)) {
    res.status(401).json({ error: "Admin authentication required" });
    return;
  }

  next();
}

export function verifyAdminPassword(password: string): boolean {
  const configuredPassword = process.env["ADMIN_PASSWORD"];
  if (!configuredPassword) return false;
  return safeEqual(configuredPassword, password);
}