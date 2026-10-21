import { useEffect, useState } from "react";
import { fetchAdminContent, saveSiteSettings } from "../content/api";
import type { Doctor, GalleryItem, HeroSlide, SiteSettings } from "../content/types";
import { ItemControls, TextArea, TextField, moveItem, slugify } from "./AdminField";
import { MediaPicker } from "./MediaPicker";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAdminContent()
      .then((payload) => {
        setSettings(payload.settings);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") return <p className="admin-muted">Loading site content…</p>;
  if (status === "error" || !settings) return <p className="admin-error">Could not load the site content.</p>;

  const current = settings;
  const patch = (partial: Partial<SiteSettings>) => setSettings((value) => (value ? { ...value, ...partial } : value));
  const patchHome = (partial: Partial<SiteSettings["home"]>) => setSettings((value) => (value ? { ...value, home: { ...value.home, ...partial } } : value));

  const setSlides = (slides: HeroSlide[]) => patchHome({ heroSlides: slides });
  const setDoctors = (doctors: Doctor[]) => patch({ doctors });
  const setGallery = (gallery: GalleryItem[]) => patch({ gallery });

  const save = async () => {
    setSaving(true);
    setNotice("");
    try {
      const saved = await saveSiteSettings(current);
      setSettings(saved);
      setNotice("Saved. The public pages now use these images and text.");
    } catch {
      setNotice("Could not save. Check the values and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <div>
          <h1>Site content</h1>
          <p className="admin-muted">This is the single place that owns every picture and headline on the public site.</p>
        </div>
        <button type="button" className="admin-button admin-button-primary" disabled={saving} onClick={() => void save()}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
      {notice && <p className="admin-notice">{notice}</p>}

      <h2 className="admin-block-title">Branding &amp; contact</h2>
      <div className="admin-grid">
        <MediaPicker label="Hospital logo" value={current.branding.logoUrl} onChange={(logoUrl) => patch({ branding: { ...current.branding, logoUrl } })} />
        <TextField label="Hospital name" value={current.branding.name} onChange={(name) => patch({ branding: { ...current.branding, name } })} />
        <TextField label="Motto" value={current.branding.motto} onChange={(motto) => patch({ branding: { ...current.branding, motto } })} />
        <TextField label="Registration number" value={current.branding.registrationNumber} onChange={(registrationNumber) => patch({ branding: { ...current.branding, registrationNumber } })} />
        <TextField label="Phone" type="tel" value={current.contact.phone} onChange={(phone) => patch({ contact: { ...current.contact, phone } })} />
        <TextField label="Email" type="email" value={current.contact.email} onChange={(email) => patch({ contact: { ...current.contact, email } })} />
        <TextField label="Address" value={current.contact.address} onChange={(address) => patch({ contact: { ...current.contact, address } })} />
      </div>

      <h2 className="admin-block-title">Home page hero slides</h2>
      <div className="admin-list">
        {current.home.heroSlides.map((slide, index) => (
          <article className="admin-card" key={index}>
            <div className="admin-card-head">
              <h3>Slide {index + 1}</h3>
              <ItemControls
                index={index}
                total={current.home.heroSlides.length}
                onMove={(from, to) => setSlides(moveItem(current.home.heroSlides, from, to))}
                onRemove={() => setSlides(current.home.heroSlides.filter((_, i) => i !== index))}
              />
            </div>
            <div className="admin-grid">
              <MediaPicker
                label="Background image"
                value={slide.imageUrl}
                alt={slide.imageAlt}
                onChange={(imageUrl) => setSlides(current.home.heroSlides.map((item, i) => (i === index ? { ...item, imageUrl } : item)))}
                onAltChange={(imageAlt) => setSlides(current.home.heroSlides.map((item, i) => (i === index ? { ...item, imageAlt } : item)))}
              />
              <TextField label="Kicker" value={slide.kicker} onChange={(kicker) => setSlides(current.home.heroSlides.map((item, i) => (i === index ? { ...item, kicker } : item)))} />
              <TextField label="Title" value={slide.title} onChange={(title) => setSlides(current.home.heroSlides.map((item, i) => (i === index ? { ...item, title } : item)))} />
              <TextField label="Emphasised line" value={slide.emphasis} onChange={(emphasis) => setSlides(current.home.heroSlides.map((item, i) => (i === index ? { ...item, emphasis } : item)))} />
              <TextField
                label="Caption shown over the photo"
                value={slide.imageNote}
                onChange={(imageNote) => setSlides(current.home.heroSlides.map((item, i) => (i === index ? { ...item, imageNote } : item)))}
              />
              <TextArea label="Description" rows={3} value={slide.description} onChange={(description) => setSlides(current.home.heroSlides.map((item, i) => (i === index ? { ...item, description } : item)))} />
            </div>
          </article>
        ))}
      </div>
      <button
        type="button"
        className="admin-button"
        onClick={() =>
          setSlides([
            ...current.home.heroSlides,
            { imageUrl: "", imageAlt: "", imageNote: "", kicker: "", title: "", emphasis: "", description: "" },
          ])
        }
      >
        Add slide
      </button>

      <h2 className="admin-block-title">Other home page images</h2>
      <div className="admin-grid">
        <MediaPicker
          label="“About” section image"
          value={current.home.aboutImageUrl}
          alt={current.home.aboutImageAlt}
          onChange={(aboutImageUrl) => patchHome({ aboutImageUrl })}
          onAltChange={(aboutImageAlt) => patchHome({ aboutImageAlt })}
        />
        <MediaPicker
          label="Gallery page hero image"
          value={current.home.galleryHeroImageUrl}
          alt={current.home.galleryHeroImageAlt}
          onChange={(galleryHeroImageUrl) => patchHome({ galleryHeroImageUrl })}
          onAltChange={(galleryHeroImageAlt) => patchHome({ galleryHeroImageAlt })}
        />
        <MediaPicker
          label="“Visit us” background image"
          value={current.home.visitImageUrl}
          alt={current.home.visitImageAlt}
          onChange={(visitImageUrl) => patchHome({ visitImageUrl })}
          onAltChange={(visitImageAlt) => patchHome({ visitImageAlt })}
        />
        <MediaPicker
          label="Founder portrait"
          value={current.home.founderImageUrl}
          alt={current.home.founderImageAlt}
          onChange={(founderImageUrl) => patchHome({ founderImageUrl })}
          onAltChange={(founderImageAlt) => patchHome({ founderImageAlt })}
        />
      </div>

      <h2 className="admin-block-title">Doctors</h2>
      <div className="admin-list">
        {current.doctors.map((doctor, index) => (
          <article className="admin-card" key={doctor.id}>
            <div className="admin-card-head">
              <h3>{doctor.name || `Doctor ${index + 1}`}</h3>
              <ItemControls
                index={index}
                total={current.doctors.length}
                onMove={(from, to) => setDoctors(moveItem(current.doctors, from, to))}
                onRemove={() => setDoctors(current.doctors.filter((_, i) => i !== index))}
              />
            </div>
            <div className="admin-grid">
              <MediaPicker
                label="Portrait"
                value={doctor.imageUrl}
                onChange={(imageUrl) => setDoctors(current.doctors.map((item, i) => (i === index ? { ...item, imageUrl } : item)))}
              />
              <TextField label="Name" value={doctor.name} onChange={(name) => setDoctors(current.doctors.map((item, i) => (i === index ? { ...item, name, slug: slugify(name) } : item)))} />
              <TextField label="Specialty" value={doctor.specialty} onChange={(specialty) => setDoctors(current.doctors.map((item, i) => (i === index ? { ...item, specialty } : item)))} />
              <TextField label="Role" value={doctor.role} onChange={(role) => setDoctors(current.doctors.map((item, i) => (i === index ? { ...item, role } : item)))} />
              <TextField label="Profile link slug" value={doctor.slug} hint="Lowercase letters, numbers and hyphens." onChange={(slug) => setDoctors(current.doctors.map((item, i) => (i === index ? { ...item, slug } : item)))} />
              <label className="field field-inline">
                <input
                  type="checkbox"
                  checked={doctor.isAvailable}
                  onChange={(event) => setDoctors(current.doctors.map((item, i) => (i === index ? { ...item, isAvailable: event.target.checked } : item)))}
                />
                <span>Shown as available</span>
              </label>
            </div>
          </article>
        ))}
      </div>
      <button
        type="button"
        className="admin-button"
        onClick={() =>
          setDoctors([...current.doctors, { id: crypto.randomUUID(), name: "", specialty: "", role: "", imageUrl: "", isAvailable: true, slug: "" }])
        }
      >
        Add doctor
      </button>

      <h2 className="admin-block-title">Gallery &amp; videos</h2>
      <div className="admin-list">
        {current.gallery.map((item, index) => (
          <article className="admin-card" key={item.id}>
            <div className="admin-card-head">
              <h3>{item.title || `Item ${index + 1}`}</h3>
              <ItemControls
                index={index}
                total={current.gallery.length}
                onMove={(from, to) => setGallery(moveItem(current.gallery, from, to))}
                onRemove={() => setGallery(current.gallery.filter((_, i) => i !== index))}
              />
            </div>
            <div className="admin-grid">
              <MediaPicker
                label="Thumbnail"
                value={item.imageUrl}
                onChange={(imageUrl) => setGallery(current.gallery.map((entry, i) => (i === index ? { ...entry, imageUrl } : entry)))}
              />
              <TextField label="Title" value={item.title} onChange={(title) => setGallery(current.gallery.map((entry, i) => (i === index ? { ...entry, title, slug: slugify(title) } : entry)))} />
              <label className="field">
                <span className="field-label">Type</span>
                <select className="field-input" value={item.type} onChange={(event) => setGallery(current.gallery.map((entry, i) => (i === index ? { ...entry, type: event.target.value as GalleryItem["type"] } : entry)))}>
                  <option value="photo">Photo story</option>
                  <option value="video">Video</option>
                </select>
              </label>
            </div>
          </article>
        ))}
      </div>
      <button
        type="button"
        className="admin-button"
        onClick={() => setGallery([...current.gallery, { id: crypto.randomUUID(), type: "photo", title: "", imageUrl: "", slug: "" }])}
      >
        Add gallery item
      </button>

      <div className="admin-save-bar">
        <span>{notice || "Changes remain unpublished until you save."}</span>
        <button type="button" className="admin-button admin-button-primary" disabled={saving} onClick={() => void save()}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </section>
  );
}
