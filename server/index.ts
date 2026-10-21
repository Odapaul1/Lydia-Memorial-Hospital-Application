import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import cookieParser from "cookie-parser";
import express, { type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import { createContentRouter } from "./api/contentRoutes";
import { createMediaRouter, createPublicMediaRouter } from "./api/mediaRoutes";
import { createAuthRouter } from "./auth/routes";
import { assertServerConfig, config, isProduction } from "./config";
import { migrateAndSeed, pool } from "./db";

async function createApp(): Promise<express.Express> {
  const app = express();
  if (isProduction) app.set("trust proxy", 1);

  app.disable("x-powered-by");
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use(createAuthRouter(pool));
  app.use(createContentRouter(pool));
  app.use(createMediaRouter(pool));
  app.use(createPublicMediaRouter(pool));

  if (isProduction) {
    const distDir = resolve(process.cwd(), "dist");
    if (existsSync(distDir)) {
      app.use(express.static(distDir, { index: false, maxAge: "1h" }));
    }
  } else {
    const { createServer } = await import("vite");
    const vite = await createServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  }

  // Unknown API routes must answer with JSON, never the SPA shell.
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "not_found" });
  });

  if (isProduction) {
    const distDir = resolve(process.cwd(), "dist");
    app.get(/.*/, (_req, res, next) => {
      const indexFile = join(distDir, "index.html");
      if (!existsSync(indexFile)) {
        next();
        return;
      }
      res.sendFile(indexFile);
    });
  }

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof multer.MulterError) {
      const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      res.status(status).json({ error: "upload_rejected", code: error.code });
      return;
    }
    console.error("[server] unhandled error", error);
    if (!res.headersSent) res.status(500).json({ error: "internal_error" });
  });

  return app;
}

async function main(): Promise<void> {
  assertServerConfig();
  try {
    await migrateAndSeed(pool);
  } catch (error) {
    if (isProduction) throw error;
    // Local front-end work should not require a database. The public site falls
    // back to the bundled defaults and the admin API reports real errors.
    console.warn("[server] database unavailable, serving bundled content only:", error instanceof Error ? error.message : error);
  }
  const app = await createApp();
  app.listen(config.port, () => {
    console.log(`[server] Lydia Memorial API + site listening on http://localhost:${config.port} (${config.nodeEnv})`);
  });
}

main().catch((error: unknown) => {
  console.error("[server] failed to start", error);
  process.exit(1);
});
