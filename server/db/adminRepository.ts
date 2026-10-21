import type { Pool } from "mysql2/promise";

/**
 * Records the most recent successful admin sign-in for audit purposes.
 * The admin account itself is defined by ADMIN_EMAIL / password configuration.
 */
export async function recordAdminLogin(pool: Pool, email: string, name: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  await pool.execute(
    `INSERT INTO cms_admins (open_id, email, display_name, last_login_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON DUPLICATE KEY UPDATE email = VALUES(email), display_name = VALUES(display_name), last_login_at = CURRENT_TIMESTAMP`,
    [normalized, normalized, name],
  );
}
