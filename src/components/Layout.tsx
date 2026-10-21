import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Icon, type IconName } from "./Icon";
import { useSiteContent } from "../content/SiteContentProvider";
import type { SiteSettings } from "../content/types";

/** The site logo, driven by the branding set in the admin console. */
export function Brand({ light = false, lazy = false }: { light?: boolean; lazy?: boolean }) {
  const { branding } = useSiteContent().settings;
  return (
    <Link className={`logo${light ? " logo-light" : ""}`} to="/" aria-label={`${branding.name} home`}>
      <img src={branding.logoUrl} alt="" loading={lazy ? "lazy" : undefined} />
    </Link>
  );
}

interface NavItem {
  label: string;
  to: string;
}

interface NavGroup {
  label: string;
  icon: IconName;
  links: NavItem[];
}

const buildNavGroups = (navigation: SiteSettings["navigation"]): NavGroup[] => [
  {
    label: navigation.aboutLabel,
    icon: "info",
    links: [
      { label: "Our hospital", to: "/about" },
      { label: "Doctors", to: "/doctors" },
      { label: "Departments", to: "/departments" },
    ],
  },
  {
    label: navigation.servicesLabel,
    icon: "stethoscope",
    links: [
      { label: "All services", to: "/services" },
      { label: "Emergency care", to: "/services/emergency-care" },
      { label: "Eye care & vision", to: "/services/eye-care" },
      { label: "Women's & family", to: "/services/womens-family" },
      { label: "Surgery & diagnostics", to: "/services/surgery-diagnostics" },
    ],
  },
  {
    label: "Patients & Visitors",
    icon: "users",
    links: [
      { label: "Patient resources", to: "/patients" },
      { label: "Plans & partners", to: "/plans" },
      { label: "Gallery & videos", to: "/gallery" },
      { label: "News & insights", to: "/news" },
    ],
  },
];

function SiteHeader() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { navigation, contact, branding } = useSiteContent().settings;
  const navGroups = useMemo(() => buildNavGroups(navigation), [navigation]);

  useEffect(() => {
    setMobile(false);
    setOpen(null);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  const supportsHover = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  return (
    <>
      <div className="utility-bar">
        <div className="utility-left">
          <span><Icon name="activity" size={14} /> 24/7 Emergency Care</span>
          <span className="utility-hide"><Icon name="pin" size={14} /> {contact.address}</span>
        </div>
        <div className="utility-right">
          <span><Icon name="phone" size={14} /> {contact.phone}</span>
          <span className="utility-hide"><span className="mail-dot">✉</span> {contact.email}</span>
          <span className="utility-hide">Report an Incident</span>
          <button className="utility-portal" type="button" onClick={() => navigate("/patients")}>
            Patient Portal
          </button>
        </div>
      </div>

      <header className="site-header">
        <div className="nav-wrap">
          <Brand />
          <nav className="desktop-nav" aria-label="Primary navigation">
            <NavLink className="nav-link" to="/" end>{navigation.homeLabel}</NavLink>
            {navGroups.map((group) => (
              <div
                className="nav-dropdown"
                key={group.label}
                onMouseEnter={() => { if (supportsHover()) setOpen(group.label); }}
                onMouseLeave={() => {
                  if (supportsHover()) setOpen((current) => (current === group.label ? null : current));
                }}
                onFocus={() => setOpen(group.label)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setOpen((current) => (current === group.label ? null : current));
                  }
                }}
              >
                <button
                  type="button"
                  className="nav-link"
                  aria-haspopup="menu"
                  aria-expanded={open === group.label}
                  onClick={(event) => {
                    if (!supportsHover() && event.detail > 0) {
                      setOpen((current) => (current === group.label ? null : group.label));
                    } else {
                      setOpen(group.label);
                    }
                  }}
                >
                  {group.label}
                  <Icon name="chevron-down" size={14} className={open === group.label ? "rotate" : ""} />
                </button>
                {open === group.label ? (
                  <div className="dropdown-menu" role="menu">
                    {group.links.map((link) => (
                      <NavLink key={link.to} to={link.to} role="menuitem">
                        {link.label}
                        <Icon name="arrow" size={14} />
                      </NavLink>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <NavLink className="nav-link" to="/careers">Careers</NavLink>
            <button className="icon-button" type="button" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Icon name="search" size={18} />
            </button>
            <Link className="button button-primary nav-cta" to="/appointments">{navigation.appointmentLabel}</Link>
          </nav>
          <button className="mobile-menu-button" type="button" aria-label="Open navigation" onClick={() => setMobile(true)}>
            <Icon name="menu" size={24} />
          </button>
        </div>
      </header>

      {mobile ? (
        <div className="mobile-overlay" onClick={() => setMobile(false)}>
          <aside className="mobile-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head">
              <Brand />
              <button className="icon-button" type="button" aria-label="Close navigation" onClick={() => setMobile(false)}>
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="mobile-links">
              <NavLink to="/" end onClick={() => setMobile(false)}>
                <span className="mobile-link-label"><Icon name="home" size={17} /> {navigation.homeLabel}</span>
                <Icon name="chevron-right" size={14} />
              </NavLink>
              {navGroups.map((group) => (
                <div className="mobile-nav-group" key={group.label}>
                  <p><span><Icon name={group.icon} size={11} /></span> {group.label}</p>
                  {group.links.map((link) => (
                    <NavLink key={link.to} to={link.to} onClick={() => setMobile(false)}>
                      {link.label}
                      <Icon name="chevron-right" size={14} />
                    </NavLink>
                  ))}
                </div>
              ))}
              <NavLink to="/careers" onClick={() => setMobile(false)}>
                <span className="mobile-link-label"><Icon name="briefcase" size={17} /> Careers</span>
                <Icon name="chevron-right" size={14} />
              </NavLink>
              <NavLink className="button button-primary" to="/appointments" onClick={() => setMobile(false)}>
                {navigation.appointmentLabel}
                <Icon name="arrow" size={16} />
              </NavLink>
            </div>
          </aside>
        </div>
      ) : null}

      {searchOpen ? (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div
            className="search-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site search"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="icon-button close-search" type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
              <Icon name="close" size={18} />
            </button>
            <p className="eyebrow">Search {branding.name}</p>
            <h2>What can we help you find?</h2>
            <div className="search-field">
              <Icon name="search" size={20} />
              <input autoFocus placeholder="Search doctors, services or resources" />
              <kbd>⌘ K</kbd>
            </div>
            <div className="search-suggestions">
              <span>Popular searches</span>
              <button type="button" onClick={() => navigate("/services")}>Emergency care</button>
              <button type="button" onClick={() => navigate("/appointments")}>Book an appointment</button>
              <button type="button" onClick={() => navigate("/doctors")}>Find a doctor</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function ChatButton() {
  const { contact } = useSiteContent().settings;
  const digits = contact.phone.replace(/[^\d]/g, "");
  if (!digits) return null;
  return (
    <a
      className="chat-button"
      href={`https://wa.me/${digits}?text=${encodeURIComponent("Hello, I need help with my care.")}`}
      target="_blank"
      rel="noreferrer"
    >
      <Icon name="message-circle" size={18} />
      <span>Chat with us</span>
      <span className="chat-pulse" />
    </a>
  );
}

function SiteFooter() {
  const { branding, contact, home } = useSiteContent().settings;
  const whatsapp = contact.phone.replace(/[^\d]/g, "");

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Brand light lazy />
          <p className="footer-intro">{home.footerBlurb}</p>
          {whatsapp ? (
            <div className="socials">
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
                <Icon name="message-circle" size={15} />
              </a>
              <a href={`mailto:${contact.email}`} aria-label="Email us">
                <Icon name="mail" size={15} />
              </a>
            </div>
          ) : null}
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/about">Our hospital</Link>
          <Link to="/services">Services</Link>
          <Link to="/doctors">Find a doctor</Link>
          <Link to="/departments">Departments</Link>
        </div>
        <div>
          <h4>Patients</h4>
          <Link to="/appointments">Book appointment</Link>
          <Link to="/patients">Patient resources</Link>
          <Link to="/plans">Plans &amp; partners</Link>
          <Link to="/contact">Contact us</Link>
        </div>
        <div>
          <h4>Reach us</h4>
          <p><Icon name="pin" size={15} /> {contact.address}</p>
          <p><Icon name="phone" size={15} /> {contact.phone}</p>
          <p><Icon name="clock" size={15} /> Emergency · open 24 hours</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {branding.name} · Reg. No. {branding.registrationNumber}</span>
        <span>{home.sourceDisclosure}</span>
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to main content</a>
      <ScrollToTop />
      <SiteHeader />
      <main id="main" className="page">{children}</main>
      <ChatButton />
      <SiteFooter />
    </div>
  );
}
