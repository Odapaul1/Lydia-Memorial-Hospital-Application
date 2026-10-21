import { randomUUID } from "node:crypto";
import { Router } from "express";
import type { Pool } from "mysql2/promise";
import { z } from "zod";
import { cmsPageSchema, pageCategorySchema, pageStatusSchema, settingsPayloadSchema, slugSchema } from "../../src/content/validation";
import { requireAdmin, requireCsrf } from "../auth/middleware";
import { getSiteSettings, listPages, publicSettings, savePage, saveSiteSettings, setPageStatus } from "../db/contentRepository";
import type { CmsPage } from "../../src/content/types";

const createPageSchema = z.object({
  slug: slugSchema,
  category: pageCategorySchema,
  title: z.string().min(1).max(200),
  eyebrow: z.string().max(180).default(""),
  lead: z.string().max(2000).default(""),
  bodyMarkdown: z.string().max(200_000).default(""),
  imageUrl: z.string().max(1000).default(""),
  imageAlt: z.string().max(500).default(""),
  status: pageStatusSchema.default("draft"),
  sortOrder: z.number().int().min(0).max(100_000).default(0),
});

const statusPayloadSchema = z.object({ status: pageStatusSchema });

export function createContentRouter(pool: Pool): Router {
  const router = Router();

  // Public: only published pages and the public-safe settings projection.
  router.get("/api/public/content", async (_req, res, next) => {
    try {
      const [settings, pages] = await Promise.all([getSiteSettings(pool), listPages(pool, true)]);
      res.setHeader("Cache-Control", "no-store");
      res.json({ settings: publicSettings(settings), pages });
    } catch (error) {
      next(error);
    }
  });

  // Admin: everything, including drafts and unpublished settings.
  router.get("/api/admin/content", requireAdmin, async (_req, res, next) => {
    try {
      const [settings, pages] = await Promise.all([getSiteSettings(pool), listPages(pool, false)]);
      res.setHeader("Cache-Control", "no-store, private");
      res.json({ settings, pages });
    } catch (error) {
      next(error);
    }
  });

  router.put("/api/admin/settings", requireAdmin, requireCsrf, async (req, res, next) => {
    try {
      const parsed = settingsPayloadSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "invalid_settings", issues: parsed.error.issues.slice(0, 20) });
        return;
      }
      await saveSiteSettings(pool, parsed.data.settings, res.locals.admin.email);
      res.json({ settings: parsed.data.settings });
    } catch (error) {
      next(error);
    }
  });

  router.post("/api/admin/pages", requireAdmin, requireCsrf, async (req, res, next) => {
    try {
      const parsed = createPageSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "invalid_page", issues: parsed.error.issues.slice(0, 20) });
        return;
      }
      const page: CmsPage = { ...parsed.data, id: randomUUID() };
      const saved = await savePage(pool, page, res.locals.admin.email);
      res.status(201).json({ page: saved });
    } catch (error) {
      next(error);
    }
  });

  router.put("/api/admin/pages/:id", requireAdmin, requireCsrf, async (req, res, next) => {
    try {
      const parsed = cmsPageSchema.safeParse({ ...req.body, id: String(req.params.id) });
      if (!parsed.success) {
        res.status(400).json({ error: "invalid_page", issues: parsed.error.issues.slice(0, 20) });
        return;
      }
      const saved = await savePage(pool, parsed.data as CmsPage, res.locals.admin.email);
      res.json({ page: saved });
    } catch (error) {
      next(error);
    }
  });

  router.post("/api/admin/pages/:id/status", requireAdmin, requireCsrf, async (req, res, next) => {
    try {
      const parsed = statusPayloadSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "invalid_status" });
        return;
      }
      await setPageStatus(pool, String(req.params.id), parsed.data.status, res.locals.admin.email);
      res.json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
