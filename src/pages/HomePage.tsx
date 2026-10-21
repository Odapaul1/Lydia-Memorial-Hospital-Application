import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon, type IconName } from "../components/Icon";
import {
  ButtonLink,
  DoctorCard,
  Eyebrow,
  FaqList,
  Reveal,
  SectionHeading,
  StatCard,
} from "../components/siteUi";
import { useSiteContent } from "../content/SiteContentProvider";
import { pagePath } from "../content/routes";
import { pagesFor } from "../content/queries";

const SERVICE_ICONS: IconName[] = ["move", "shield", "lab", "pill", "baby", "heart", "users", "check"];
const SERVICE_IMAGES = [
  "/images/service-emergency.jpg",
  "/images/service-eye-care.jpg",
  "/images/service-womens.jpg",
  "/images/service-surgery.jpg",
  "/images/service-telehealth.jpg",
];
const INSIGHT_IMAGES = ["/images/news-1.jpg", "/images/news-2.jpg"];

const SHORTCUTS: { icon: IconName; title: string; body: string; to: string }[] = [
  { icon: "users", title: "Patient resources", body: "Answers before you visit.", to: "/patients" },
  { icon: "briefcase-medical", title: "Health plans", body: "Family and corporate cover.", to: "/plans" },
  { icon: "shield", title: "NHIS services", body: "Quality care through your health plan.", to: "/services/nhis" },
  { icon: "search", title: "Find a service", body: "Browse care and facilities.", to: "/services" },
  { icon: "video", title: "TeleHealth", body: "Ask about virtual consultations.", to: "/appointments" },
];

export default function HomePage() {
  const { settings, pages } = useSiteContent();
  const { home, doctors, faqs, branding } = settings;
  const slides = home.heroSlides;
  const [active, setActive] = useState(0);
  const [serviceIndex, setServiceIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const slide = slides.length ? slides[active % slides.length] : null;

  const serviceCards = pagesFor(pages, "service")
    .filter((page) => page.slug !== "services")
    .map((page, index) => ({
      page,
      icon: SERVICE_ICONS[index % SERVICE_ICONS.length],
      image: page.imageUrl || SERVICE_IMAGES[index % SERVICE_IMAGES.length],
    }));
  const visibleServices = serviceCards.length
    ? Array.from({ length: Math.min(4, serviceCards.length) }, (_, i) => serviceCards[(i + serviceIndex) % serviceCards.length])
    : [];
  const moveServices = (step: number) =>
    setServiceIndex((current) => (current + step + serviceCards.length) % serviceCards.length);

  const insights = pagesFor(pages, "about")
    .filter((page) => page.slug !== "about")
    .slice(0, 2);

  if (!slide) return null;

  return (
    <>
      <section className="home-hero">
        <div
          key={slide.imageUrl}
          role="img"
          aria-label={slide.imageAlt}
          className="hero-media"
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
        />
        <div className="hero-wash" />
        <div className="hero-copy container">
          <Reveal key={active}>
            <Eyebrow>{slide.kicker}</Eyebrow>
            <h1>
              {slide.title}
              <br />
              {slide.emphasis}
            </h1>
            <p>{slide.description}</p>
            <div className="hero-actions">
              <ButtonLink to="/appointments">Book an appointment</ButtonLink>
              <ButtonLink to="/doctors" variant="outline">Find a doctor</ButtonLink>
            </div>
            <div className="hero-dots">
              {slides.map((item, index) => (
                <button
                  key={item.imageUrl}
                  type="button"
                  className={index === active ? "active" : ""}
                  aria-label={`Go to slide ${index + 1}: ${item.title} ${item.emphasis}`}
                  aria-current={index === active ? "true" : undefined}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
          </Reveal>
        </div>
        <div className="hero-badge">
          <div className="badge-icon"><Icon name="heart-pulse" size={20} /></div>
          <div>
            <b>{branding.motto.replace(/\.$/, "")}</b>
            <span>Compassion in every interaction.</span>
          </div>
        </div>
      </section>

      <section className="shortcut-rail">
        <div className="container shortcut-grid">
          {SHORTCUTS.map((item) => (
            <Link className="shortcut" to={item.to} key={item.title}>
              <span className="shortcut-icon"><Icon name={item.icon} size={18} /></span>
              <span>
                <b>{item.title}</b>
                <small>{item.body}</small>
              </span>
              <Icon name="arrow" size={15} />
            </Link>
          ))}
        </div>
      </section>

      {visibleServices.length ? (
        <section className="section section-services container">
          <SectionHeading
            eyebrow="Our services"
            title="Care close to home, in Ugbokolo."
            body="Specialized healthcare services and facilities designed to provide comprehensive medical support for you and your family."
            action={
              <div className="slider-controls">
                <button type="button" aria-label="Previous services" onClick={() => moveServices(-1)}>
                  <Icon name="chevron-left" size={17} />
                </button>
                <button type="button" aria-label="Next services" onClick={() => moveServices(1)}>
                  <Icon name="chevron-right" size={17} />
                </button>
                <ButtonLink to="/services" variant="outline">View all services</ButtonLink>
              </div>
            }
          />
          <div className="service-grid">
            {visibleServices.map((card, index) => (
              <Reveal key={card.page.id} delay={index * 0.05}>
                <Link className="service-card" to={pagePath(card.page)}>
                  <div className="service-image" style={{ backgroundImage: `url(${card.image})` }}>
                    <span className="service-icon"><Icon name={card.icon} size={20} /></span>
                  </div>
                  <div className="service-content">
                    <h3>{card.page.title}</h3>
                    <p>{card.page.lead}</p>
                    <span className="text-link">Explore care <Icon name="arrow" size={15} /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="slider-dots">
            {serviceCards.map((card, index) => (
              <button
                key={card.page.id}
                type="button"
                aria-label={`Show services from ${card.page.title}`}
                className={index === serviceIndex ? "active" : ""}
                onClick={() => setServiceIndex(index)}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="section insights-events">
        <div className="container insights-events-grid">
          <div className="insights-panel">
            <div className="panel-heading">
              <div>
                <Eyebrow>From our hospital</Eyebrow>
                <h2>Latest from Lydia Memorial</h2>
              </div>
              <Link className="panel-link" to="/about">View all <Icon name="arrow" size={15} /></Link>
            </div>
            <div className="insight-cards">
              {insights.map((page, index) => (
                <Link className="insight-card" to={pagePath(page)} key={page.id}>
                  <div
                    className="insight-image"
                    style={{ backgroundImage: `url(${page.imageUrl || INSIGHT_IMAGES[index % INSIGHT_IMAGES.length]})` }}
                  />
                  <div className="insight-copy">
                    <small>{page.eyebrow}</small>
                    <h3>{page.title}</h3>
                    <p>{page.lead}</p>
                    <span className="text-link">Read more <Icon name="arrow" size={14} /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="events-panel">
            <div className="panel-heading">
              <div>
                <Eyebrow>Community calendar</Eyebrow>
                <h2>Upcoming events</h2>
              </div>
              <Link className="panel-link" to="/contact">View all events <Icon name="arrow" size={15} /></Link>
            </div>
            <div className="event-empty">
              <span><Icon name="calendar" size={25} /></span>
              <div>
                <Eyebrow>Stay connected</Eyebrow>
                <h3>Events are coming soon</h3>
                <p>Announcements, community health sessions and updates will appear here.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section stats-section">
        <div className="container stats-layout">
          <div>
            <Eyebrow>Why families choose LMH</Eyebrow>
            <h2>Care that goes beyond the appointment.</h2>
            <p>{home.purposeBody}</p>
            <ButtonLink to="/about" variant="light">Why Lydia Memorial</ButtonLink>
          </div>
          <div className="stat-cards">
            <StatCard value="24/7" label="Emergency support" icon="activity" />
            <StatCard value="5" label="Facilities listed by LMH" icon="stethoscope" />
            <StatCard value="2022" label="Founded and commissioned" icon="award" />
            <StatCard value="2025" label="NHIS accreditation reported" icon="shield" />
          </div>
        </div>
      </section>

      {doctors.length ? (
        <section className="section container">
          <SectionHeading
            eyebrow="Meet your care team"
            title="Specialists who listen first"
            body="Find the right doctor for your needs and take the next step with confidence."
            action={<ButtonLink to="/doctors" variant="outline">Meet our doctors</ButtonLink>}
          />
          <div className="doctor-grid">
            {doctors.slice(0, 3).map((doctor, index) => (
              <Reveal key={doctor.id} delay={index * 0.07}>
                <DoctorCard doctor={doctor} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <section className="testimonial-band">
        <div className="container testimonial">
          <div className="quote-mark">“</div>
          <blockquote>
            From my first call to my follow-up, I felt like someone was genuinely paying attention. The care was
            excellent, but the kindness made the biggest difference.
          </blockquote>
          <div className="testimonial-by">
            <span className="avatar">AG</span>
            <span>
              <b>Amaka G.</b>
              <small>Patient partner, Edumoga</small>
            </span>
          </div>
        </div>
      </section>

      <section className="section container">
        <SectionHeading
          eyebrow="Helpful, human, clear"
          title="Questions? We have answers."
          body="A few useful starting points for planning your visit."
          action={<ButtonLink to="/faqs" variant="outline">Visitor FAQs</ButtonLink>}
        />
        <FaqList items={faqs} compact />
      </section>
    </>
  );
}
