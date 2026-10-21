import { timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";
import { config } from "../config";
import type { AdminIdentity } from "../../src/content/types";
import { CSRF_COOKIE, SESSION_COOKIE, verifySessionToken } from "./session";

export async function resolveAdmin(cookieValue: unknown): Promise<AdminIdentity | null> {
  if (typeof cookieValue !== "string" || cookieValue.length < 20) return null;
  return verifySessionToken(cookieValue);
}

/** Rejects any request that does not carry a valid admin session cookie. */
export const requireAdmin: RequestHandler = async (req, res, next) => {
  const identity = await resolveAdmin(req.cookies?.[SESSION_COOKIE]);
  if (!identity) {
    res.status(401).json({ error: "admin_authentication_required" });
    return;
  }
  res.locals.admin = identity;
  next();
};

const sameOrigin = (req: Parameters<RequestHandler>[0]): boolean => {
  const origin = req.get("origin");
  if (!origin) return false;
  try {
    const originUrl = new URL(origin);
    if (config.appOrigin) return originUrl.origin === config.appOrigin;
    return originUrl.host === req.get("host");
  } catch {
    return false;
  }
};

/**
 * Double-submit CSRF protection: the token from the readable CSRF cookie must
 * match the `x-csrf-token` header, and the request must come from the site's
 * own origin.
 */
export const requireCsrf: RequestHandler = (req, res, next) => {
  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.get("x-csrf-token");
  if (typeof cookieToken !== "string" || typeof headerToken !== "string" || !sameOrigin(req)) {
    res.status(403).json({ error: "csrf_validation_failed" });
    return;
  }
  const expected = Buffer.from(cookieToken, "utf8");
  const received = Buffer.from(headerToken, "utf8");
  if (expected.length < 32 || expected.length !== received.length || !timingSafeEqual(expected, received)) {
    res.status(403).json({ error: "csrf_validation_failed" });
    return;
  }
  next();
};
