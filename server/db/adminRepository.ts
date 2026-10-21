import type { Pool, RowDataPacket } from "mysql2/promise";
import type { AdminIdentity } from "../../src/content/types";

interface AdminRow extends RowDataPacket {
  open_id: string;
  email: string;
  display_name: string;
}

export const normalizeEmail = (value: string): string => value.trim().toLowerCase();

export function configuredAdminEmails(): Set<string> {
  return new Set(
    (process.env.LMH_ADMIN_EMAILS ?? "")
      .split(/[;,\s]+/)
      .map(normalizeEmail)
      .filter(Boolean),
  );
}

export function isAllowlistedAdmin(email: string): boolean {
  const allowlist = configuredAdminEmails();
  return allowlist.size > 0 && allowlist.has(normalizeEmail(email));
}

export async function recordAdminLogin(pool: Pool, identity: AdminIdentity): Promise<void> {
  await pool.execute(
    `INSERT INTO cms_admins (open_id, email, display_name, last_login_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON DUPLICATE KEY UPDATE email=VALUES(email), display_name=VALUES(display_name), last_login_at=CURRENT_TIMESTAMP`,
    [identity.openId, normalizeEmail(identity.email), identity.name],
  );
}

export async function findAdminByOpenId(pool: Pool, openId: string): Promise<AdminIdentity | null> {
  const [rows] = await pool.execute<AdminRow[]>(
    "SELECT open_id, email, display_name FROM cms_admins WHERE open_id = ? LIMIT 1",
    [openId],
  );
  const row = rows[0];
  if (!row || !isAllowlistedAdmin(row.email)) return null;
  return { openId: row.open_id, email: row.email, name: row.display_name };
}
