import { randomBytes } from "node:crypto";
import type { Response } from "express";
import { SignJWT, jwtVerify } from "jose";
import { config, isProduction } from "../config";
import type { AdminIdentity } from "../../src/content/types";

export const SESSION_COOKIE = "lmh_admin_session";
export const CSRF_COOKIE = "lmh_csrf";

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const CSRF_TTL_MS = 60 * 60 * 1000;

const secretKey = (): Uint8Array => new TextEncoder().encode(config.sessionSecret);

export async function createSessionToken(admin: AdminIdentity): Promise<string> {
  return new SignJWT({ email: admin.email, name: admin.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(admin.openId)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<AdminIdentity | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    return {
      openId: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "Administrator",
    };
  } catch {
    return null;
  }
}

const baseCookie = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
};

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(SESSION_COOKIE, token, { ...baseCookie, maxAge: SESSION_TTL_MS });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, baseCookie);
}

export function createCsrfTokenCookie(res: Response, token: string): void {
  res.cookie(CSRF_COOKIE, token, { ...baseCookie, maxAge: CSRF_TTL_MS });
}

export function clearCsrfTokenCookie(res: Response): void {
  res.clearCookie(CSRF_COOKIE, baseCookie);
}

export const newCsrfToken = (): string => randomBytes(32).toString("hex");
