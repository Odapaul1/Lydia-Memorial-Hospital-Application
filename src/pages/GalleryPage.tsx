import { useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import { ButtonLink, Eyebrow, GradientHero, PageTransition, Reveal, SectionHeading } from "../components/siteUi";
import { useSiteSettings } from "../content/SiteContentProvider";
import type { GalleryItem } from "../content/types";

const typeLabel = (type: GalleryItem["type"]) => (type === "video" ? "Video" : "Photo story");

export default function GalleryPage() {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const { gallery, branding } = useSiteSettings();

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <PageTransition>
      <GradientHero
        kicker="Gallery & videos"
        title="See the care behind every visit."
        body={`A closer look at our spaces, our people and the moments that make ${branding.name} feel different.`}
        image="/images/gallery-hero.jpg"
      >
        <ButtonLink to="/about" variant="light">About {branding.name}</ButtonLink>
      </GradientHero>

      <section className="section container">
        <SectionHeading
          eyebrow={`Inside ${branding.name}`}
          title="A place designed to feel reassuring."
          body="Explore our spaces and meet some of the people who care for you."
        />
        <div className="gallery-grid">
          {gallery.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06}>
              <button className="gallery-card" onClick={() => setSelected(item)}>
                <div className="gallery-image" style={{ backgroundImage: `url(${item.imageUrl})` }}>
                  <span>
                    {item.type === "video" ? <Icon name="play" size={18} /> : <Icon name="activity" size={18} />}
                  </span>
                </div>
                <div className="gallery-info">
                  <span className="eyebrow">{typeLabel(item.type)}</span>
                  <h3>{item.title}</h3>
                  <Icon name="arrow" size={16} />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close">
              <Icon name="close" size={18} />
            </button>
            <div className="modal-image" style={{ backgroundImage: `url(${selected.imageUrl})` }}>
              {selected.type === "video" && (
                <span className="play-large"><Icon name="play" size={26} /></span>
              )}
            </div>
            <div className="modal-caption">
              <Eyebrow>{typeLabel(selected.type)}</Eyebrow>
              <h2>{selected.title}</h2>
              <p>A closer look at our facilities and the care team at {branding.name}.</p>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
