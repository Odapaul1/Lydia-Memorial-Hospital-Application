import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { config, type MediaDriver } from "../config";

/** A stored binary plus the metadata needed to serve it back. */
export interface StoredObject {
  body: Buffer;
  contentType: string;
}

export interface ObjectStore {
  readonly driver: MediaDriver;
  put(storageKey: string, body: Buffer, contentType: string): Promise<void>;
  get(storageKey: string): Promise<StoredObject | null>;
  remove(storageKey: string): Promise<void>;
  /** Link safe to place in `src` / CSS. */
  publicUrl(storageKey: string): string;
}

/** Rejects keys that could escape the storage root or reference a remote host. */
export const isSafeStorageKey = (key: string): boolean =>
  key.length > 0 && key.length <= 255 && /^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(key) && !key.includes("..");

const s3Client = (): S3Client =>
  new S3Client({
    region: config.s3.region,
    ...(config.s3.endpoint ? { endpoint: config.s3.endpoint } : {}),
    forcePathStyle: config.s3.forcePathStyle,
    credentials: {
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: config.s3.secretAccessKey,
    },
  });

function createS3Store(): ObjectStore {
  const client = s3Client();
  const bucket = config.s3.bucket;
  return {
    driver: "s3",
    async put(storageKey, body, contentType) {
      await client.send(
        new PutObjectCommand({ Bucket: bucket, Key: storageKey, Body: body, ContentType: contentType, CacheControl: "public, max-age=31536000, immutable" }),
      );
    },
    async get(storageKey) {
      try {
        const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: storageKey }));
        if (!result.Body) return null;
        return { body: Buffer.from(await result.Body.transformToByteArray()), contentType: result.ContentType ?? "application/octet-stream" };
      } catch {
        return null;
      }
    },
    async remove(storageKey) {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: storageKey }));
    },
    publicUrl(storageKey) {
      if (config.mediaPublicBaseUrl) return `${config.mediaPublicBaseUrl}/${storageKey}`;
      // No public base configured: fall back to the app's own media route,
      // which streams the object back from the bucket.
      return `/media/${storageKey}`;
    },
  };
}

function createLocalStore(): ObjectStore {
  const root = resolve(process.cwd(), config.mediaLocalDir);
  const pathFor = (storageKey: string): string => resolve(root, storageKey);
  return {
    driver: "local",
    async put(storageKey, body) {
      const target = pathFor(storageKey);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, body);
    },
    async get(storageKey) {
      try {
        return { body: await readFile(pathFor(storageKey)), contentType: "application/octet-stream" };
      } catch {
        return null;
      }
    },
    async remove(storageKey) {
      try {
        await unlink(pathFor(storageKey));
      } catch {
        /* already gone */
      }
    },
    publicUrl(storageKey) {
      return `/media/${storageKey}`;
    },
  };
}

let cached: ObjectStore | null = null;

export function objectStore(): ObjectStore {
  if (!cached) cached = config.mediaDriver === "local" ? createLocalStore() : createS3Store();
  return cached;
}
