/**
 * Central server configuration.
 *
 * Every environment value the API depends on is read here so the rest of the
 * server never touches `process.env` directly. Missing required values fail
 * loudly at boot with an actionable message instead of failing later mid-request.
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";

const envFile = resolve(process.cwd(), ".env");
if (existsSync(envFile)) process.loadEnvFile(envFile);

const read = (name: string, fallback = ""): string => (process.env[name] ?? fallback).trim();

const required = (name: string, hint: string): string => {
  const value = read(name);
  if (!value) throw new Error(`Missing required environment variable ${name}. ${hint}`);
  return value;
};

const bool = (name: string, fallback = false): boolean => {
  const value = read(name).toLowerCase();
  if (!value) return fallback;
  return value === "true" || value === "1" || value === "yes";
};

export type MediaDriver = "s3" | "local";
export type DatabaseSsl = "disable" | "require" | "verify";

export const config = {
  nodeEnv: read("NODE_ENV", "development"),
  port: Number(read("PORT", "3000")) || 3000,
  /** Public origin of the deployed site, used for CSRF origin checks. */
  appOrigin: read("APP_ORIGIN").replace(/\/+$/, ""),

  databaseUrl: required("DATABASE_URL", "Provide the MySQL connection string, e.g. mysql://user:pass@host:3306/lmh."),
  /**
   * TLS mode for the MySQL connection.
   * - `disable` — no TLS (typical for a local server).
   * - `require` — TLS without certificate verification (managed hosts that use
   *   self-signed certificates, e.g. Railway/Render).
   * - `verify`  — TLS with full certificate verification (a CA-signed host).
   */
  databaseSsl: (read("DATABASE_SSL", "require").toLowerCase() as DatabaseSsl),

  sessionSecret: required("SESSION_SECRET", "Provide a random string of at least 32 characters used to sign admin sessions."),
  adminEmail: required("ADMIN_EMAIL", "Provide the single email address allowed to sign in to the admin panel.").toLowerCase(),
  /** Preferred: scrypt hash produced by `pnpm admin:hash-password`. */
  adminPasswordHash: read("ADMIN_PASSWORD_HASH"),
  /** Fallback for quick local setup only. Ignored when a hash is present. */
  adminPassword: read("ADMIN_PASSWORD"),

  mediaDriver: (read("MEDIA_DRIVER", "s3").toLowerCase() === "local" ? "local" : "s3") as MediaDriver,
  /** Directory used by the local driver. */
  mediaLocalDir: read("MEDIA_LOCAL_DIR", ".media"),
  /** Absolute base URL (CDN / bucket website) used to build public media links. */
  mediaPublicBaseUrl: read("MEDIA_PUBLIC_BASE_URL").replace(/\/+$/, ""),

  s3: {
    endpoint: read("S3_ENDPOINT"),
    region: read("S3_REGION", "auto"),
    bucket: read("S3_BUCKET"),
    accessKeyId: read("S3_ACCESS_KEY_ID"),
    secretAccessKey: read("S3_SECRET_ACCESS_KEY"),
    forcePathStyle: bool("S3_FORCE_PATH_STYLE"),
  },
} as const;

export const isProduction = config.nodeEnv === "production";

export function assertServerConfig(): void {
  if (config.sessionSecret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters long.");
  }
  if (!config.adminPasswordHash && !config.adminPassword) {
    throw new Error("Set ADMIN_PASSWORD_HASH (preferred) or ADMIN_PASSWORD so the admin account can sign in.");
  }
  if (config.mediaDriver === "s3") {
    const { bucket, accessKeyId, secretAccessKey } = config.s3;
    if (!bucket || !accessKeyId || !secretAccessKey) {
      throw new Error(
        "MEDIA_DRIVER=s3 requires S3_BUCKET, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY. " +
          "Set MEDIA_DRIVER=local to store uploads on disk instead.",
      );
    }
  }
}
