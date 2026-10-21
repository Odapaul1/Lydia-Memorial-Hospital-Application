import { randomUUID } from "node:crypto";
import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { MediaStatus } from "../../src/content/types";

export interface MediaRecord {
  id: string;
  storageKey: string;
  mimeType: string;
  byteSize: number;
  altText: string;
  status: MediaStatus;
  createdByEmail: string;
  createdAt: string;
}

interface MediaRow extends RowDataPacket {
  id: string;
  storage_key: string;
  mime_type: string;
  byte_size: number;
  alt_text: string;
  status: MediaStatus;
  created_by_email: string;
  created_at: string;
}

const mapMedia = (row: MediaRow): MediaRecord => ({
  id: row.id,
  storageKey: row.storage_key,
  mimeType: row.mime_type,
  byteSize: Number(row.byte_size),
  altText: row.alt_text,
  status: row.status,
  createdByEmail: row.created_by_email,
  createdAt: row.created_at,
});

const COLUMNS =
  "id, storage_key, mime_type, byte_size, alt_text, status, created_by_email, created_at";

export async function insertMediaAsset(
  pool: Pool,
  asset: { storageKey: string; mimeType: string; byteSize: number; altText: string; createdByEmail: string },
): Promise<MediaRecord> {
  const id = randomUUID();
  await pool.execute(
    `INSERT INTO media_assets (id, storage_key, mime_type, byte_size, alt_text, status, created_by_email)
     VALUES (?, ?, ?, ?, ?, 'active', ?)`,
    [id, asset.storageKey, asset.mimeType, asset.byteSize, asset.altText, asset.createdByEmail],
  );
  return {
    id,
    storageKey: asset.storageKey,
    mimeType: asset.mimeType,
    byteSize: asset.byteSize,
    altText: asset.altText,
    status: "active",
    createdByEmail: asset.createdByEmail,
    createdAt: new Date().toISOString(),
  };
}

export async function listMediaAssets(pool: Pool, includeRetired = true): Promise<MediaRecord[]> {
  const condition = includeRetired ? "" : "WHERE status = 'active'";
  const [rows] = await pool.query<MediaRow[]>(
    `SELECT ${COLUMNS} FROM media_assets ${condition} ORDER BY created_at DESC LIMIT 500`,
  );
  return rows.map(mapMedia);
}

export async function getMediaAsset(pool: Pool, id: string): Promise<MediaRecord | null> {
  const [rows] = await pool.execute<MediaRow[]>(
    `SELECT ${COLUMNS} FROM media_assets WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows[0] ? mapMedia(rows[0]) : null;
}

export async function getMediaByStorageKey(pool: Pool, storageKey: string): Promise<MediaRecord | null> {
  const [rows] = await pool.execute<MediaRow[]>(
    `SELECT ${COLUMNS} FROM media_assets WHERE storage_key = ? LIMIT 1`,
    [storageKey],
  );
  return rows[0] ? mapMedia(rows[0]) : null;
}

export async function setMediaStatus(pool: Pool, id: string, status: MediaStatus): Promise<MediaRecord | null> {
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE media_assets SET status = ? WHERE id = ?",
    [status, id],
  );
  if (result.affectedRows === 0) return null;
  return getMediaAsset(pool, id);
}

export async function updateMediaAltText(pool: Pool, id: string, altText: string): Promise<MediaRecord | null> {
  await pool.execute("UPDATE media_assets SET alt_text = ? WHERE id = ?", [altText, id]);
  return getMediaAsset(pool, id);
}
