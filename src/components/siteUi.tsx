import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon, type IconName } from "./Icon";
import type { Doctor, FaqItem } from "../content/types";

/**
 * Shared marketing-site primitives.
 *
 * These mirror the reference design system's building blocks (eyebrow labels,
 * section headings, buttons and scroll reveals) but are implemented with the
 * project's own dependencies: react-router for links, IntersectionObserver for
 * the reveal-on-scroll effect and inline SVG icons.
 */

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2>{title}</h2>
        {body ? <p>{body}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function ButtonLink({
  to,
  children,
  variant = "primary",
  className = "",
}: {
  to: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "light";
  className?: string;
}) {
  return (
    <Link to={to} className={`button button-${variant} ${className}`.trim()}>
      {children}
      <Icon name="arrow" size={16} />
    </Link>
  );
}

export function ButtonAnchor({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "light";
  className?: string;
}) {
  return (
    <a href={href} className={`button button-${variant} ${className}`.trim()}>
      {children}
      <Icon name="arrow" size={16} />
    </a>
  );
}

/**
 * Reveals its children once they scroll into view. Replaces the reference's
 * framer-motion `whileInView` with an IntersectionObserver.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-70px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

/** Page wrapper used by every public route (mirrors the reference `.page`). */
export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="page">{children}</div>;
}

/** Small centred pill used beside section headings, e.g. "12 specialists". */
export function Pill({ children }: { children: ReactNode }) {
  return <span className="pill">{children}</span>;
}

/** A single figure in the dark statistics band. */
export function StatCard({ value, label, icon }: { value: string; label: string; icon: IconName }) {
  return (
    <div className="stat-card">
      <Icon name={icon} size={19} />
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

/** A numbered step used by the "what to expect" sections. */
export function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="step-card">
      <span>{n}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

/** Doctor card with the reference's floating aura/reflection treatment. */
export function DoctorCard({ doctor, compact = false }: { doctor: Doctor; compact?: boolean }) {
  return (
    <Link to={`/doctors/${doctor.slug}`} className={`doctor-float${compact ? " compact" : ""}`}>
      <span className="doctor-aura" />
      <div className="doctor-card">
        <div
          role="img"
          aria-label={`Photo of ${doctor.name}`}
          className="doctor-photo"
          style={doctor.imageUrl ? { backgroundImage: `url(${doctor.imageUrl})` } : undefined}
        >
          {doctor.isAvailable ? <span className="doctor-availability">Available</span> : null}
        </div>
        <div className="doctor-info">
          <p>{doctor.specialty}</p>
          <h3>{doctor.name}</h3>
          <span>{doctor.role}</span>
          <div className="doctor-link">View profile <Icon name="arrow" size={15} /></div>
        </div>
      </div>
      <span className="doctor-reflection" />
    </Link>
  );
}

/** Collapsible question list; `compact` narrows it for the home page. */
export function FaqList({ items, compact = false }: { items: FaqItem[]; compact?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className={`faq-list${compact ? " faq-compact" : ""}`}>
      {items.map((item, index) => (
        <div className="faq-item" key={item.question}>
          <button type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)}>
            <span>{item.question}</span>
            <Icon name={open === index ? "close" : "chevron-down"} size={17} />
          </button>
          {open === index ? <p>{item.answer}</p> : null}
        </div>
      ))}
    </div>
  );
}

/** Dark gradient banner used at the top of interior pages. */
export function GradientHero({
  kicker,
  title,
  body,
  image,
  children,
  imagePosition = "center",
}: {
  kicker: string;
  title: ReactNode;
  body: string;
  image: string;
  children?: ReactNode;
  imagePosition?: string;
}) {
  return (
    <section className="gradient-hero">
      <div className="container gradient-hero-inner">
        <div className="gradient-copy">
          <Eyebrow>{kicker}</Eyebrow>
          <h1>{title}</h1>
          <p>{body}</p>
          {children}
        </div>
        <div className="gradient-image" style={{ backgroundImage: `url(${image})`, backgroundPosition: imagePosition }} />
      </div>
    </section>
  );
}
