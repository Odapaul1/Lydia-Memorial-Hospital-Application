import { randomUUID } from "node:crypto";
import { Router } from "express";
import { fileTypeFromBuffer } from "file-type";
import multer from "multer";
import type { Pool } from "mysql2/promise";
import { z } from "zod";
import type { MediaAsset } from "../../src/content/types";
import { requireAdmin, requireCsrf } from "../auth/middleware";
import { getMediaByStorageKey, insertMediaAsset, listMediaAssets, setMediaStatus, updateMediaAltText, type MediaRecord } from "../db/mediaRepository";
import { isSafeStorageKey, objectStore } from "../storage/objectStore";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 } });

const altSchema = z.object({ altText: z.string().max(500) });
const statusSchema = z.object({ status: z.enum(["active", "retired"]) });

const toMediaAsset = (record: MediaRecord): MediaAsset => ({
  id: record.id,
  storageKey: record.storageKey,
  url: objectStore().publicUrl(record.storageKey),
  mimeType: record.mimeType,
  byteSize: record.byteSize,
  altText: record.altText,
  status: record.status,
  createdAt: record.createdAt,
});

export function createMediaRouter(pool: Pool): Router {
  const router = Router();

  router.get("/api/admin/media", requireAdmin, async (_req, res, next) => {
    try {
      const assets = await listMediaAssets(pool);
      res.setHeader("Cache-Control", "no-store, private");
      res.json({ media: assets.map(toMediaAsset) });
    } catch (error) {
      next(error);
    }
  });

  router.post("/api/admin/media", requireAdmin, requireCsrf, upload.single("file"), async (req, res, next) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "file_required" });
        return;
      }
      const detected = await fileTypeFromBuffer(file.buffer);
      if (!detected || !ALLOWED_MIME_TYPES.has(detected.mime)) {
        res.status(415).json({ error: "unsupported_media_type" });
        return;
      }
      const now = new Date();
      const month = String(now.getUTCMonth() + 1).padStart(2, "0");
      const storageKey = `media/${now.getUTCFullYear()}/${month}/${randomUUID()}.${detected.ext}`;
      const altText = typeof req.body?.altText === "string" ? req.body.altText.slice(0, 500) : "";
      await objectStore().put(storageKey, file.buffer, detected.mime);
      const record = await insertMediaAsset(pool, {
        storageKey,
        mimeType: detected.mime,
        byteSize: file.size,
        altText,
        createdByEmail: res.locals.admin.email,
      });
      const asset = toMediaAsset(record);
      res.status(201).json({ asset });
    } catch (error) {
      next(error);
    }
  });

  router.patch("/api/admin/media/:id", requireAdmin, requireCsrf, async (req, res, next) => {
    try {
      const parsed = altSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "invalid_payload" });
        return;
      }
      const record = await updateMediaAltText(pool, String(req.params.id), parsed.data.altText);
      if (!record) {
        res.status(404).json({ error: "media_not_found" });
        return;
      }
      res.json({ asset: toMediaAsset(record) });
    } catch (error) {
      next(error);
    }
  });

  router.post("/api/admin/media/:id/status", requireAdmin, requireCsrf, async (req, res, next) => {
    try {
      const parsed = statusSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "invalid_payload" });
        return;
      }
      const record = await setMediaStatus(pool, String(req.params.id), parsed.data.status);
      if (!record) {
        res.status(404).json({ error: "media_not_found" });
        return;
      }
      res.json({ asset: toMediaAsset(record) });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

/**
 * Public media route. Streams objects for the local driver; for object storage
 * without a public CDN base it proxies the bytes back through the app.
 */
export function createPublicMediaRouter(pool: Pool): Router {
  const router = Router();

  router.get(/^\/media\//, async (req, res, next) => {
    try {
      const storageKey = decodeURIComponent(req.path.replace(/^\/media\//, ""));
      if (!isSafeStorageKey(storageKey)) {
        res.status(400).json({ error: "invalid_media_path" });
        return;
      }
      const [object, record] = await Promise.all([
        objectStore().get(storageKey),
        getMediaByStorageKey(pool, storageKey),
      ]);
      if (!object) {
        res.status(404).json({ error: "media_not_found" });
        return;
      }
      const contentType = object.contentType !== "application/octet-stream"
        ? object.contentType
        : record?.mimeType ?? "application/octet-stream";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.send(object.body);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
