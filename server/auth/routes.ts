import { Router } from "express";
import rateLimit from "express-rate-limit";
import type { Pool } from "mysql2/promise";
import { z } from "zod";
import type { AdminIdentity } from "../../src/content/types";
import { recordAdminLogin } from "../db/adminRepository";
import { verifyAdminCredentials } from "./credentials";
import { requireAdmin, requireCsrf } from "./middleware";
import { clearCsrfTokenCookie, clearSessionCookie, createCsrfTokenCookie, createSessionToken, newCsrfToken, setSessionCookie } from "./session";

const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(200),
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "too_many_login_attempts" },
});

export function createAuthRouter(pool: Pool): Router {
  const router = Router();

  router.get("/api/security/csrf", (_req, res) => {
    const token = newCsrfToken();
    res.setHeader("Cache-Control", "no-store, private");
    createCsrfTokenCookie(res, token);
    res.json({ csrfToken: token });
  });

  router.get("/api/admin/session", requireAdmin, (_req, res) => {
    res.setHeader("Cache-Control", "no-store, private");
    res.json({ admin: res.locals.admin });
  });

  router.post("/api/admin/login", loginLimiter, async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "invalid_credentials_format" });
      return;
    }
    const valid = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
    if (!valid) {
      res.status(401).json({ error: "invalid_credentials" });
      return;
    }
    const admin: AdminIdentity = { openId: parsed.data.email.toLowerCase(), email: parsed.data.email.toLowerCase(), name: "Administrator" };
    const token = await createSessionToken(admin);
    const csrfToken = newCsrfToken();
    await recordAdminLogin(pool, admin.email, admin.name).catch(() => undefined);
    res.setHeader("Cache-Control", "no-store, private");
    setSessionCookie(res, token);
    createCsrfTokenCookie(res, csrfToken);
    res.json({ admin, csrfToken });
  });

  router.post("/api/admin/logout", requireCsrf, (_req, res) => {
    clearSessionCookie(res);
    clearCsrfTokenCookie(res);
    res.setHeader("Cache-Control", "no-store, private");
    res.status(200).json({ ok: true });
  });

  return router;
}
