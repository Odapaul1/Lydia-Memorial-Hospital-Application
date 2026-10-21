import { useEffect, useRef, useState } from "react";
import { listMedia, uploadMedia } from "../content/api";
import type { MediaAsset } from "../content/types";
import { Icon } from "../components/Icon";

interface MediaPickerProps {
  label: string;
  /** Current image URL stored on the settings/page being edited. */
  value: string;
  alt?: string;
  onChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
}

/**
 * Image slot editor. Every picture on the public site is edited through one of
 * these, and each one can pull from the shared media library or upload a new
 * file, so there is a single place that owns all imagery.
 */
export function MediaPicker({ label, value, alt, onChange, onAltChange }: MediaPickerProps) {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!libraryOpen) return;
    let cancelled = false;
    setError("");
    listMedia()
      .then((media) => {
        if (!cancelled) setAssets(media.filter((asset) => asset.status === "active"));
      })
      .catch(() => {
        if (!cancelled) setError("Could not load the media library.");
      });
    return () => {
      cancelled = true;
    };
  }, [libraryOpen]);

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const asset = await uploadMedia(file, alt ?? "");
      setAssets((current) => [asset, ...current]);
      onChange(asset.url);
      if (onAltChange && !alt) onAltChange(asset.altText);
      setLibraryOpen(false);
    } catch {
      setError("Upload failed. Use a JPEG, PNG, WebP, AVIF or GIF under 8 MB.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="media-field">
      <span className="field-label">{label}</span>
      <div className="media-field-row">
        <div className="media-field-preview">
          {value ? <img src={value} alt="" /> : <span className="media-field-empty">No image</span>}
        </div>
        <div className="media-field-controls">
          <input
            className="field-input"
            type="text"
            value={value}
            placeholder="/manus-storage/example.png or https://…"
            onChange={(event) => onChange(event.target.value)}
          />
          <div className="media-field-actions">
            <button type="button" className="admin-button" onClick={() => setLibraryOpen(true)}>Choose image</button>
            <button type="button" className="admin-button" disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? "Uploading…" : "Upload new"}
            </button>
            {value && <button type="button" className="admin-button admin-button-quiet" onClick={() => onChange("")}>Clear</button>}
          </div>
          <input
            ref={fileRef}
            className="visually-hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            onChange={(event) => void handleUpload(event.target.files?.[0])}
          />
        </div>
      </div>
      {onAltChange && (
        <label className="field">
          <span className="field-label">Alt text</span>
          <input className="field-input" type="text" value={alt ?? ""} onChange={(event) => onAltChange(event.target.value)} />
        </label>
      )}
      {error && <p className="admin-error">{error}</p>}

      {libraryOpen && (
        <div className="media-modal" role="dialog" aria-modal="true" aria-label={`${label} media library`}>
          <div className="media-modal-inner">
            <div className="media-modal-head">
              <h3>Media library</h3>
              <button type="button" className="admin-button admin-button-quiet" onClick={() => setLibraryOpen(false)}>
                <Icon name="close" size={18} /> Close
              </button>
            </div>
            {assets.length === 0 ? (
              <p className="admin-muted">No images yet. Use “Upload new” to add the first one.</p>
            ) : (
              <div className="media-modal-grid">
                {assets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    className={`media-modal-item${asset.url === value ? " is-selected" : ""}`}
                    onClick={() => {
                      onChange(asset.url);
                      if (onAltChange && asset.altText) onAltChange(asset.altText);
                      setLibraryOpen(false);
                    }}
                  >
                    <img src={asset.url} alt={asset.altText} loading="lazy" />
                    <span>{asset.altText || asset.storageKey.split("/").pop()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
