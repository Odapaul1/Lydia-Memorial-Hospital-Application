import type { Pool, RowDataPacket } from "mysql2/promise";
import { defaultPages } from "../../src/content/defaultPages";
import { defaultSiteSettings } from "../../src/content/defaultSiteSettings";

const migrationStatements = [
  `CREATE TABLE IF NOT EXISTS site_settings (
    setting_key VARCHAR(64) NOT NULL PRIMARY KEY,
    settings_json JSON NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by_email VARCHAR(254) NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS cms_pages (
    id CHAR(36) NOT NULL PRIMARY KEY,
    slug VARCHAR(100) NOT NULL,
    category ENUM('about','service') NOT NULL,
    title VARCHAR(200) NOT NULL,
    eyebrow VARCHAR(180) NOT NULL DEFAULT '',
    lead TEXT NOT NULL,
    body_markdown MEDIUMTEXT NOT NULL,
    image_url VARCHAR(1000) NOT NULL DEFAULT '',
    image_alt VARCHAR(500) NOT NULL DEFAULT '',
    status ENUM('published','draft','archived') NOT NULL DEFAULT 'draft',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by_email VARCHAR(254) NULL,
    UNIQUE KEY uq_cms_pages_category_slug (category, slug),
    KEY ix_cms_pages_status_sort (status, sort_order)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS cms_admins (
    open_id VARCHAR(128) NOT NULL PRIMARY KEY,
    email VARCHAR(254) NOT NULL,
    display_name VARCHAR(200) NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_cms_admins_email (email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS cms_revisions (
    id CHAR(36) NOT NULL PRIMARY KEY,
    entity_type VARCHAR(32) NOT NULL,
    entity_key VARCHAR(180) NOT NULL,
    snapshot_json JSON NOT NULL,
    created_by_email VARCHAR(254) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY ix_cms_revisions_entity (entity_type, entity_key, created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS media_assets (
    id CHAR(36) NOT NULL PRIMARY KEY,
    storage_key VARCHAR(255) NOT NULL,
    mime_type VARCHAR(80) NOT NULL,
    byte_size INT UNSIGNED NOT NULL,
    alt_text VARCHAR(500) NOT NULL,
    status ENUM('active','retired') NOT NULL DEFAULT 'active',
    created_by_email VARCHAR(254) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_media_assets_storage_key (storage_key),
    KEY ix_media_assets_status_created (status, created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS appointment_requests (
    id CHAR(36) NOT NULL PRIMARY KEY,
    patient_name VARCHAR(150) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    email VARCHAR(254) NULL,
    service_slug VARCHAR(100) NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(32) NOT NULL,
    status ENUM('new','contacted','confirmed','closed') NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY ix_appointment_requests_created (created_at),
    KEY ix_appointment_requests_status_created (status, created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

export async function migrateAndSeed(pool: Pool): Promise<void> {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version INT NOT NULL PRIMARY KEY,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT version FROM schema_migrations WHERE version = 1 LIMIT 1",
  );
  if (rows.length === 0) {
    for (const statement of migrationStatements) await pool.query(statement);
    await pool.query("INSERT IGNORE INTO schema_migrations (version) VALUES (1)");
  }

  const [settingsRows] = await pool.query<RowDataPacket[]>(
    "SELECT setting_key FROM site_settings WHERE setting_key = 'public' LIMIT 1",
  );
  if (settingsRows.length === 0) {
    await pool.execute(
      "INSERT INTO site_settings (setting_key, settings_json, updated_by_email) VALUES ('public', ?, 'system-seed')",
      [JSON.stringify(defaultSiteSettings)],
    );
  }

  const [pageCountRows] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS page_count FROM cms_pages",
  );
  if (Number(pageCountRows[0]?.page_count ?? 0) === 0) {
    const insert = `INSERT INTO cms_pages
      (id, slug, category, title, eyebrow, lead, body_markdown, image_url, image_alt, status, sort_order, updated_by_email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'system-seed')`;
    for (const page of defaultPages) {
      await pool.execute(insert, [
        page.id, page.slug, page.category, page.title, page.eyebrow, page.lead,
        page.bodyMarkdown, page.imageUrl, page.imageAlt, page.status, page.sortOrder,
      ]);
    }
  }
}
