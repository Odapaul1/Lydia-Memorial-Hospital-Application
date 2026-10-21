import { useEffect, useState } from "react";
import { createPage, fetchAdminContent, savePage, setPageStatus } from "../content/api";
import type { CmsPage, PageCategory, PageStatus } from "../content/types";
import { TextArea, TextField } from "./AdminField";
import { MediaPicker } from "./MediaPicker";

const emptyPage = (category: PageCategory, sortOrder: number): Omit<CmsPage, "id" | "updatedAt"> => ({
  slug: "",
  category,
  title: "",
  eyebrow: "",
  lead: "",
  bodyMarkdown: "",
  imageUrl: "",
  imageAlt: "",
  status: "draft",
  sortOrder,
});

export default function PagesPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [draft, setDraft] = useState<CmsPage | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAdminContent()
      .then((payload) => {
        setPages(payload.pages);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const startNew = async (category: PageCategory) => {
    setNotice("");
    try {
      const created = await createPage(emptyPage(category, pages.length));
      setPages((current) => [...current, created]);
      setDraft(created);
      setNotice("New draft page created. Fill in the details and save.");
    } catch {
      setNotice("Could not create a page.");
    }
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setNotice("");
    try {
      const saved = await savePage(draft);
      setPages((current) => current.map((item) => (item.id === saved.id ? saved : item)));
      setDraft(saved);
      setNotice("Page saved.");
    } catch {
      setNotice("Could not save this page. Check the slug and required fields.");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (page: CmsPage, next: PageStatus) => {
    try {
      await setPageStatus(page.id, next);
      setPages((current) => current.map((item) => (item.id === page.id ? { ...item, status: next } : item)));
      setDraft((value) => (value && value.id === page.id ? { ...value, status: next } : value));
      setNotice(next === "published" ? "Page published." : "Page status updated.");
    } catch {
      setNotice("Could not change that page’s status.");
    }
  };

  if (status === "loading") return <p className="admin-muted">Loading pages…</p>;
  if (status === "error") return <p className="admin-error">Could not load the pages.</p>;

  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <div>
          <h1>Pages</h1>
          <p className="admin-muted">About, services and every sub-page. Draft pages are hidden from the public site.</p>
        </div>
        <div className="admin-head-actions">
          <button type="button" className="admin-button" onClick={() => void startNew("about")}>New about page</button>
          <button type="button" className="admin-button" onClick={() => void startNew("service")}>New service page</button>
        </div>
      </div>
      {notice && <p className="admin-notice">{notice}</p>}

      <div className="admin-pages-layout">
        <ul className="admin-page-list">
          {pages.map((page) => (
            <li key={page.id}>
              <button
                type="button"
                className={`admin-page-link${draft?.id === page.id ? " is-active" : ""}`}
                onClick={() => { setDraft(page); setNotice(""); }}
              >
                <span>{page.title || page.slug || "Untitled"}</span>
                <small>{page.category === "about" ? "About" : "Services"} · {page.status}</small>
              </button>
            </li>
          ))}
        </ul>

        {draft ? (
          <div className="admin-page-editor">
            <div className="admin-grid">
              <TextField label="Title" value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
              <TextField
                label="Slug"
                value={draft.slug}
                hint="Lowercase letters, numbers and hyphens. Use “about” or “services” for the section landing page."
                onChange={(slug) => setDraft({ ...draft, slug })}
              />
              <label className="field">
                <span className="field-label">Section</span>
                <select className="field-input" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as PageCategory })}>
                  <option value="about">About LMH</option>
                  <option value="service">Care &amp; services</option>
                </select>
              </label>
              <label className="field">
                <span className="field-label">Status</span>
                <select className="field-input" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as PageStatus })}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
              <TextField label="Eyebrow" value={draft.eyebrow} onChange={(eyebrow) => setDraft({ ...draft, eyebrow })} />
              <TextField label="Sort order" type="text" value={String(draft.sortOrder)} onChange={(value) => setDraft({ ...draft, sortOrder: Number(value.replace(/[^\d]/g, "")) || 0 })} />
              <TextArea label="Lead paragraph" rows={3} value={draft.lead} onChange={(lead) => setDraft({ ...draft, lead })} />
              <MediaPicker
                label="Hero image"
                value={draft.imageUrl}
                alt={draft.imageAlt}
                onChange={(imageUrl) => setDraft({ ...draft, imageUrl })}
                onAltChange={(imageAlt) => setDraft({ ...draft, imageAlt })}
              />
              <TextArea
                label="Body (Markdown)"
                rows={16}
                hint="Standard Markdown with tables and lists. Images can be added with ![alt](url) using any media library URL."
                value={draft.bodyMarkdown}
                onChange={(bodyMarkdown) => setDraft({ ...draft, bodyMarkdown })}
              />
            </div>
            <div className="admin-save-bar">
              <span>{notice || "Remember to publish when the page is ready."}</span>
              <div className="admin-head-actions">
                <button type="button" className="admin-button" onClick={() => void changeStatus(draft, draft.status === "published" ? "draft" : "published")}>
                  {draft.status === "published" ? "Unpublish" : "Publish now"}
                </button>
                <button type="button" className="admin-button admin-button-primary" disabled={saving} onClick={() => void save()}>
                  {saving ? "Saving…" : "Save page"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="admin-muted">Select a page on the left, or create a new one.</p>
        )}
      </div>
    </section>
  );
}
