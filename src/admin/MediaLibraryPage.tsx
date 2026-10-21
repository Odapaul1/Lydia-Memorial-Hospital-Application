import { useEffect, useRef, useState } from "react";
import { listMedia, setMediaStatus, updateMediaAltText, uploadMedia } from "../content/api";
import type { MediaAsset } from "../content/types";

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listMedia()
      .then((media) => {
        setAssets(media);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setNotice("");
    try {
      for (const file of Array.from(files)) {
        const asset = await uploadMedia(file);
        setAssets((current) => [asset, ...current]);
      }
      setNotice("Upload complete.");
    } catch {
      setNotice("One or more uploads failed. Use JPEG, PNG, WebP, AVIF or GIF under 8 MB.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const saveAlt = async (asset: MediaAsset, altText: string) => {
    setAssets((current) => current.map((item) => (item.id === asset.id ? { ...item, altText } : item)));
    try {
      await updateMediaAltText(asset.id, altText);
    } catch {
      setNotice("Could not save that description.");
    }
  };

  const toggleStatus = async (asset: MediaAsset) => {
    const next = asset.status === "active" ? "retired" : "active";
    try {
      const updated = await setMediaStatus(asset.id, next);
      setAssets((current) => current.map((item) => (item.id === asset.id ? updated : item)));
    } catch {
      setNotice("Could not change that image’s status.");
    }
  };

  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <div>
          <h1>Media library</h1>
          <p className="admin-muted">Every image on the public site is served from here. Upload once, then pick it anywhere.</p>
        </div>
        <button type="button" className="admin-button admin-button-primary" disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? "Uploading…" : "Upload images"}
        </button>
        <input ref={fileRef} className="visually-hidden" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={(event) => void upload(event.target.files)} />
      </div>

      {notice && <p className="admin-notice">{notice}</p>}
      {status === "loading" && <p className="admin-muted">Loading images…</p>}
      {status === "error" && <p className="admin-error">Could not load the media library.</p>}
      {status === "ready" && assets.length === 0 && <p className="admin-muted">No images yet. Upload the first one to get started.</p>}

      <div className="admin-media-grid">
        {assets.map((asset) => (
          <article key={asset.id} className={`admin-media-card${asset.status === "retired" ? " is-retired" : ""}`}>
            <img src={asset.url} alt={asset.altText} loading="lazy" />
            <div className="admin-media-body">
              <input
                className="field-input"
                type="text"
                value={asset.altText}
                placeholder="Describe this image"
                onChange={(event) => setAssets((current) => current.map((item) => (item.id === asset.id ? { ...item, altText: event.target.value } : item)))}
                onBlur={(event) => void saveAlt(asset, event.target.value)}
              />
              <code className="admin-media-url">{asset.storageKey}</code>
              <div className="admin-media-actions">
                <button type="button" className="admin-button admin-button-quiet" onClick={() => void navigator.clipboard?.writeText(asset.url)}>Copy URL</button>
                <button type="button" className="admin-button admin-button-quiet" onClick={() => void toggleStatus(asset)}>
                  {asset.status === "active" ? "Retire" : "Restore"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
