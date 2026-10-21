import { randomBytes, timingSafeEqual } from "node:crypto";
import { Router } from "express";
import type { Pool } from "mysql2/promise";
import { configuredAdminEmails, isAllowlistedAdmin, recordAdminLogin } from "../db/adminRepository";
import { clearSessionCookie, createCsrfTokenCookie, requireAdmin, requireCsrf, setSessionCookie } from "./middleware";
import { exchangeOAuthCode, fetchOAuthIdentity, getOAuthPortalUrl } from "./oauth";

interface OAuthState {
  redirectUri: string;
  nonce: string;
}
interface NonceCookie {
  origin: string;
  nonce: string;
}

const NONCE_COOKIE = "lmh_oauth_nonce";
const oauthStateSchema = (value: unknown): value is OAuthState =>
  Boolean(value && typeof value === "object" &&
    typeof (value as OAuthState).redirectUri === "string" &&
    typeof (value as OAuthState).nonce === "string");

const clearNonceCookie = (res: Parameters<typeof Router>[0] extends never ? never : import("express").Response): void => {
  res.clearCookie(NONCE_COOKIE, { httpOnly: true, secure: true, sameSite: "none", path: "/auth/callback" });
};

export function createAuthRouter(pool: Pool): Router {
  const router = Router();

  router.get("/api/security/csrf", (_req, res) => {
    const token = randomBytes(32).toString("hex");
    res.setHeader("Cache-Control", "no-store, private");
    createCsrfTokenCookie(res, token);
    res.json({ csrfToken: token });
  });

  router.get("/api/admin/session", requireAdmin(pool), (_req, res) => {
    res.setHeader("Cache-Control", "no-store, private");
    res.json({ admin: res.locals.admin });
  });

  router.post("/auth/start", (req, res) => {
    if (configuredAdminEmails().size === 0) {
      res.redirect(303, "/admin?auth=not-configured");
      return;
    }
    const originHeader = req.get("origin");
    const candidate = req.body?.origin;
    if (typeof candidate !== "string" || !originHeader) {
      res.status(400).json({ error: "oauth_origin_required" });
      return;
    }
    let origin: string;
    try {
      const url = new URL(candidate);
      if (url.protocol !== "https:" || url.origin !== originHeader || url.username || url.password) {
        res.status(400).json({ error: "oauth_origin_invalid" });
        return;
      }
      origin = url.origin;
    } catch {
      res.status(400).json({ error: "oauth_origin_invalid" });
      return;
    }
    const nonce = randomBytes(32).toString("hex");
    const redirectUri = `${origin}/auth/callback`;
    const state: OAuthState = { redirectUri, nonce };
    const cookie: NonceCookie = { origin, nonce };
    res.cookie(NONCE_COOKIE, Buffer.from(JSON.stringify(cookie)).toString("base64url"), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/auth/callback",
      maxAge: 5 * 60 * 1000,
    });
    const authorizationUrl = new URL(`${getOAuthPortalUrl()}/app-auth`);
    authorizationUrl.searchParams.set("appId", process.env.MANUS_PROJECT_ID ?? "");
    authorizationUrl.searchParams.set("redirectUri", redirectUri);
    authorizationUrl.searchParams.set("state", Buffer.from(JSON.stringify(state)).toString("base64"));
    authorizationUrl.searchParams.set("responseType", "code");
    res.redirect(302, authorizationUrl.toString());
  });

  router.get("/auth/callback", async (req, res) => {
    const clearState = (): void => clearNonceCookie(res);
    const goToAdmin = (origin: string, result: string): void => {
      clearState();
      res.redirect(303, `${origin}/admin?auth=${encodeURIComponent(result)}`);
    };

    const rawCookie = req.cookies?.[NONCE_COOKIE];
    const encodedState = typeof req.query.state === "string" ? req.query.state : "";
    const code = typeof req.query.code === "string" ? req.query.code : "";
    let nonceCookie: NonceCookie | null = null;
    let state: OAuthState | null = null;
    try {
      if (typeof rawCookie !== "string" || !encodedState) throw new Error("OAuth state is missing.");
      nonceCookie = JSON.parse(Buffer.from(rawCookie, "base64url").toString("utf8")) as NonceCookie;
      state = JSON.parse(Buffer.from(encodedState, "base64").toString("utf8")) as OAuthState;
      if (!oauthStateSchema(state) || typeof nonceCookie.origin !== "string" || typeof nonceCookie.nonce !== "string") throw new Error("OAuth state is invalid.");
      const callback = new URL(state.redirectUri);
      const nonceA = Buffer.from(state.nonce, "utf8");
      const nonceB = Buffer.from(nonceCookie.nonce, "utf8");
      if (
        callback.protocol !== "https:" || callback.pathname !== "/auth/callback" || callback.search || callback.hash ||
        callback.origin !== nonceCookie.origin || nonceA.length !== nonceB.length || !timingSafeEqual(nonceA, nonceB)
      ) throw new Error("OAuth state did not match the initiating browser.");
    } catch {
      clearState();
      res.redirect(303, "/admin?auth=invalid-state");
      return;
    }

    if (!nonceCookie || !state || !code) {
      clearState();
      res.redirect(303, "/admin?auth=cancelled");
      return;
    }
    try {
      const accessToken = await exchangeOAuthCode(code, state.redirectUri);
      const identity = await fetchOAuthIdentity(accessToken);
      if (!isAllowlistedAdmin(identity.email)) {
        clearSessionCookie(res);
        goToAdmin(nonceCookie.origin, "not-authorized");
        return;
      }
      await recordAdminLogin(pool, identity);
      setSessionCookie(res, accessToken);
      goToAdmin(nonceCookie.origin, "success");
    } catch {
      goToAdmin(nonceCookie.origin, "oauth-failed");
    }
  });

  router.post("/auth/logout", requireCsrf, (_req, res) => {
    clearSessionCookie(res);
    res.setHeader("Cache-Control", "no-store, private");
    res.status(200).json({ ok: true });
  });

  return router;
}
