import { timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";
import { jwtVerify } from "jose";
import type { Pool } from "mysql2/promise";
import type { AdminIdentity } from "../../src/content/types";
import { isAllowlistedAdmin, findAdminByOpenId } from "../db/adminRepository";
import { fetchOAuthIdentity } from "./oauth";

export const SESSION_COOKIE = "webdev_app_session";
const CSRF_COOKIE = "lmh_csrf";

export function setSessionCookie(res: Parameters<RequestHandler>[1], accessToken: string): void {
  res.cookie(SESSION_COOKIE, `oauth.${accessToken}`, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 12 * 60 * 60 * 1000,
  });
}

export function clearSessionCookie(res: Parameters<RequestHandler>[1]): void {
  res.clearCookie(SESSION_COOKIE, { httpOnly: true, secure: true, sameSite: "none", path: "/" });
}

export function createCsrfTokenCookie(res: Parameters<RequestHandler>[1], token: string): void {
  res.cookie(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 1000,
  });
}

async function resolveSession(pool: Pool, token: string): Promise<AdminIdentity | null> {
  if (token.startsWith("oauth.")) {
    if (process.env.LMH_ADMIN_EMAILS?.trim().length === 0 || !process.env.LMH_ADMIN_EMAILS) return null;
    const identity = await fetchOAuthIdentity(token.slice("oauth.".length));
    return isAllowlistedAdmin(identity.email) ? identity : null;
  }

  const jwtSecret = process.env.MANUS_JWT_SECRET;
  const projectId = process.env.MANUS_PROJECT_ID;
  if (!jwtSecret || !projectId || token.split(".").length !== 3) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(jwtSecret), { algorithms: ["HS256"] });
    if (payload.appId !== projectId || typeof payload.openId !== "string") return null;
    return await findAdminByOpenId(pool, payload.openId);
  } catch {
    return null;
  }
}

export function requireAdmin(pool: Pool): RequestHandler {
  return async (req, res, next) => {
    const token = req.cookies?.[SESSION_COOKIE];
    if (typeof token !== "string" || token.length < 20) {
      res.status(401).json({ error: "admin_authentication_required" });
      return;
    }
    try {
      const identity = await resolveSession(pool, token);
      if (!identity || !isAllowlistedAdmin(identity.email)) {
        res.status(403).json({ error: "authorized_staff_only" });
        return;
      }
      res.locals.admin = identity;
      next();
    } catch {
      res.status(401).json({ error: "admin_session_invalid" });
    }
  };
}

export const requireCsrf: RequestHandler = (req, res, next) => {
  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.get("x-csrf-token");
  const origin = req.get("origin");
  const referer = req.get("referer");
  if (!origin || typeof cookieToken !== "string" || typeof headerToken !== "string") {
    res.status(403).json({ error: "csrf_validation_failed" });
    return;
  }
  try {
    const originUrl = new URL(origin);
    const refererOrigin = referer ? new URL(referer).origin : originUrl.origin;
    const expected = Buffer.from(cookieToken, "utf8");
    const received = Buffer.from(headerToken, "utf8");
    if (
      originUrl.protocol !== "https:" ||
      originUrl.origin !== refererOrigin ||
      expected.length < 32 ||
      received.length !== expected.length ||
      !timingSafeEqual(expected, received)
    ) {
      res.status(403).json({ error: "csrf_validation_failed" });
      return;
    }
  } catch {
    res.status(403).json({ error: "csrf_validation_failed" });
    return;
  }
  next();
};
