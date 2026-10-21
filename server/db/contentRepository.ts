import { randomUUID } from "node:crypto";
import type { Pool, RowDataPacket } from "mysql2/promise";
import { defaultSiteSettings } from "../../src/content/defaultSiteSettings";
import type { CmsPage, PageStatus, SiteSettings } from "../../src/content/types";

interface JsonRow extends RowDataPacket {
  settings_json: SiteSettings | string;
}
interface PageRow extends RowDataPacket {
  id: string;
  slug: string;
  category: "about" | "service";
  title: string;
  eyebrow: string;
  lead: string;
  body_markdown: string;
  image_url: string;
  image_alt: string;
  status: PageStatus;
  sort_order: number;
  updated_at: string;
}

const mapPage = (row: PageRow): CmsPage => ({
  id: row.id,
  slug: row.slug,
  category: row.category,
  title: row.title,
  eyebrow: row.eyebrow,
  lead: row.lead,
  bodyMarkdown: row.body_markdown,
  imageUrl: row.image_url,
  imageAlt: row.image_alt,
  status: row.status,
  sortOrder: row.sort_order,
  updatedAt: row.updated_at,
});

const parseSettings = (raw: SiteSettings | string): SiteSettings => {
  const parsed = typeof raw === "string" ? JSON.parse(raw) as SiteSettings : raw;
  return { ...defaultSiteSettings, ...parsed };
};

export async function getSiteSettings(pool: Pool): Promise<SiteSettings> {
  const [rows] = await pool.query<JsonRow[]>(
    "SELECT settings_json FROM site_settings WHERE setting_key = 'public' LIMIT 1",
  );
  return rows[0] ? parseSettings(rows[0].settings_json) : structuredClone(defaultSiteSettings);
}

export const appointmentRequestsReady = (settings: SiteSettings): boolean =>
  settings.appointment.requestEnabled === true &&
  settings.appointment.privacyStatement.trim().length > 0 &&
  settings.appointment.retentionPolicy.trim().length > 0 &&
  Boolean(settings.appointment.approvedAt && settings.appointment.approvedBy);

export function publicSettings(settings: SiteSettings): SiteSettings {
  const ready = appointmentRequestsReady(settings);
  return {
    ...settings,
    appointment: {
      requestEnabled: ready,
      privacyStatement: ready ? settings.appointment.privacyStatement : "",
      retentionPolicy: ready ? settings.appointment.retentionPolicy : "",
      approvedAt: ready ? settings.appointment.approvedAt : null,
      approvedBy: null,
    },
  };
}

export async function saveSiteSettings(pool: Pool, settings: SiteSettings, editorEmail: string): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query<JsonRow[]>(
      "SELECT settings_json FROM site_settings WHERE setting_key = 'public' FOR UPDATE",
    );
    if (rows[0]) {
      await connection.execute(
        `INSERT INTO cms_revisions (id, entity_type, entity_key, snapshot_json, created_by_email)
         VALUES (?, 'settings', 'public', ?, ?)`,
        [randomUUID(), JSON.stringify(rows[0].settings_json), editorEmail],
      );
    }
    await connection.execute(
      `INSERT INTO site_settings (setting_key, settings_json, updated_by_email) VALUES ('public', ?, ?)
       ON DUPLICATE KEY UPDATE settings_json = VALUES(settings_json), updated_by_email = VALUES(updated_by_email)`,
      [JSON.stringify(settings), editorEmail],
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function listPages(pool: Pool, publishedOnly = false): Promise<CmsPage[]> {
  const condition = publishedOnly ? "WHERE status = 'published'" : "";
  const [rows] = await pool.query<PageRow[]>(
    `SELECT id, slug, category, title, eyebrow, lead, body_markdown, image_url, image_alt, status, sort_order, updated_at
     FROM cms_pages ${condition} ORDER BY sort_order ASC, title ASC`,
  );
  return rows.map(mapPage);
}

export async function getPageByCategorySlug(pool: Pool, category: "about" | "service", slug: string): Promise<CmsPage | null> {
  const [rows] = await pool.execute<PageRow[]>(
    `SELECT id, slug, category, title, eyebrow, lead, body_markdown, image_url, image_alt, status, sort_order, updated_at
     FROM cms_pages WHERE category = ? AND slug = ? LIMIT 1`,
    [category, slug],
  );
  return rows[0] ? mapPage(rows[0]) : null;
}

export async function savePage(pool: Pool, page: CmsPage, editorEmail: string): Promise<CmsPage> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [oldRows] = await connection.execute<PageRow[]>(
      `SELECT id, slug, category, title, eyebrow, lead, body_markdown, image_url, image_alt, status, sort_order, updated_at
       FROM cms_pages WHERE id = ? FOR UPDATE`,
      [page.id],
    );
    if (oldRows[0]) {
      await connection.execute(
        `INSERT INTO cms_revisions (id, entity_type, entity_key, snapshot_json, created_by_email)
         VALUES (?, 'page', ?, ?, ?)`,
        [randomUUID(), oldRows[0].id, JSON.stringify(mapPage(oldRows[0])), editorEmail],
      );
      await connection.execute(
        `UPDATE cms_pages SET slug=?, category=?, title=?, eyebrow=?, lead=?, body_markdown=?, image_url=?, image_alt=?, status=?, sort_order=?, updated_by_email=? WHERE id=?`,
        [page.slug, page.category, page.title, page.eyebrow, page.lead, page.bodyMarkdown, page.imageUrl, page.imageAlt, page.status, page.sortOrder, editorEmail, page.id],
      );
    } else {
      await connection.execute(
        `INSERT INTO cms_pages (id, slug, category, title, eyebrow, lead, body_markdown, image_url, image_alt, status, sort_order, updated_by_email)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [page.id, page.slug, page.category, page.title, page.eyebrow, page.lead, page.bodyMarkdown, page.imageUrl, page.imageAlt, page.status, page.sortOrder, editorEmail],
      );
    }
    const saved = { ...page, updatedAt: new Date().toISOString() };
    await connection.execute(
      `INSERT INTO cms_revisions (id, entity_type, entity_key, snapshot_json, created_by_email)
       VALUES (?, 'page', ?, ?, ?)`,
      [randomUUID(), page.id, JSON.stringify(saved), editorEmail],
    );
    await connection.commit();
    return saved;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function setPageStatus(pool: Pool, id: string, status: PageStatus, editorEmail: string): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute<PageRow[]>(
      `SELECT id, slug, category, title, eyebrow, lead, body_markdown, image_url, image_alt, status, sort_order, updated_at
       FROM cms_pages WHERE id = ? FOR UPDATE`,
      [id],
    );
    if (!rows[0]) throw new Error("page_not_found");
    await connection.execute(
      `INSERT INTO cms_revisions (id, entity_type, entity_key, snapshot_json, created_by_email)
       VALUES (?, 'page', ?, ?, ?)`,
      [randomUUID(), id, JSON.stringify(mapPage(rows[0])), editorEmail],
    );
    await connection.execute("UPDATE cms_pages SET status=?, updated_by_email=? WHERE id=?", [status, editorEmail, id]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
