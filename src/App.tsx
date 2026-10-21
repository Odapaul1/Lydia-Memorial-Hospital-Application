import { useEffect, useState, type ReactNode } from "react";

const phone = "+234 807 569 7064";
const phoneLink = "tel:+2348075697064";
const email = "lydiamemorialhospital@gmail.com";
const address = "No. 3 Ejeh Street, Ichakwu-Amejo (Ugbokolo), Edumoga, Okpokwu Local Government Area, Benue State, Nigeria";

const navItems = [
  { label: "Home", href: "#top" },
  { label: "About LMH", href: "#about" },
  { label: "Care & services", href: "#services" },
  { label: "Our founder", href: "#founder" },
  { label: "Visitor FAQs", href: "#faqs" },
  { label: "Contact", href: "#contact" },
];

type HeroSlide = { image: string; alt: string; note: string; kicker: string; title: string; emphasis: string; description: string };

const heroSlides: HeroSlide[] = [
  {
    image: "/manus-storage/LydiaMemorialHospitalExterior_0f20487d.png",
    alt: "Illustrative exterior image supplied for Lydia Memorial Hospital, showing a main entrance and emergency entrance.",
    note: "Supplied illustrative hospital exterior",
    kicker: "A COMMUNITY HOSPITAL IN BENUE STATE",
    title: "Care with heart.",
    emphasis: "Hands that heal.",
    description: "At Lydia Memorial Hospital, compassionate care begins with seeing every person with dignity. A calm, welcoming place for you and your family in Ugbokolo.",
  },
  {
    image: "/manus-storage/hero-1_caef44b4.jpg",
    alt: "Illustrative healthcare image from the supplied reference-site archive; not Lydia Memorial Hospital staff or facilities.",
    note: "Illustrative reference image · not Lydia Memorial Hospital",
    kicker: "CARE THAT PUTS PEOPLE FIRST",
    title: "Care built around",
    emphasis: "every person.",
    description: "The hospital profile describes a calm, supportive atmosphere where patients are met with kindness, dignity and attention.",
  },
  {
    image: "/manus-storage/hero-2_510f1275.jpg",
    alt: "Illustrative healthcare image from the supplied reference-site archive; not Lydia Memorial Hospital staff or facilities.",
    note: "Illustrative reference image · not Lydia Memorial Hospital",
    kicker: "SERVING UGBOKOLO & OKPOKWU",
    title: "Local care for",
    emphasis: "our communities.",
    description: "LMH's supplied information describes a hospital rooted in Ugbokolo, serving people across Okpokwu and surrounding communities.",
  },
];

const visitorFaqs = [
  {
    question: "Where is Lydia Memorial Hospital?",
    answer: "The address supplied by LMH is No. 3 Ejeh Street, Ichakwu-Amejo (Ugbokolo), Edumoga, Okpokwu Local Government Area, Benue State, Nigeria.",
  },
  {
    question: "What services are listed in the hospital profile?",
    answer: "The profile lists physiotherapy, ultrasound, a laboratory, pharmacy, maternity and community medical outreaches. It also describes NHIS, approved immunisation services and an ART unit. Contact LMH to confirm current availability and eligibility.",
  },
  {
    question: "Can I use NHIS services at LMH?",
    answer: "The hospital-supplied information states that LMH received NHIA accreditation for NHIS services in August 2025. Contact the hospital to confirm current eligibility and arrangements.",
  },
  {
    question: "How can I ask about a visit or current services?",
    answer: "Call +234 807 569 7064 or email lydiamemorialhospital@gmail.com. Contact LMH to confirm appointment arrangements, current opening hours and service availability.",
  },
];

type IconName = "arrow" | "phone" | "mail" | "pin" | "menu" | "close" | "heart" | "lab" | "pill" | "baby" | "move" | "shield" | "book" | "award" | "users" | "check" | "external" | "plus" | "hand";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  let drawing: ReactNode;
  switch (name) {
    case "arrow": drawing = <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>; break;
    case "phone": drawing = <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3.1a2 2 0 0 1-.6 1.7L7.5 10a16 16 0 0 0 6.5 6.5l1.5-1.5a2 2 0 0 1 1.7-.6l3.1.5a2 2 0 0 1 1.7 2Z" />; break;
    case "mail": drawing = <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>; break;
    case "pin": drawing = <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>; break;
    case "menu": drawing = <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>; break;
    case "close": drawing = <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>; break;
    case "heart": drawing = <path d="M20.8 8.7c0 5.3-8.8 10.3-8.8 10.3S3.2 14 3.2 8.7A4.7 4.7 0 0 1 12 6a4.7 4.7 0 0 1 8.8 2.7Z" />; break;
    case "lab": drawing = <><path d="M9 3h6" /><path d="M10 3v6.3L5.4 17a2 2 0 0 0 1.7 3h9.8a2 2 0 0 0 1.7-3L14 9.3V3" /><path d="M8 15h8" /></>; break;
    case "pill": drawing = <><path d="m10.5 20.5 10-10a5.7 5.7 0 0 0-8-8l-10 10a5.7 5.7 0 0 0 8 8Z" /><path d="m8.5 8.5 7 7" /></>; break;
    case "baby": drawing = <><circle cx="12" cy="8" r="4" /><path d="M8 12a7 7 0 0 0-3 5.5A3.5 3.5 0 0 0 8.5 21h7a3.5 3.5 0 0 0 3.5-3.5 7 7 0 0 0-3-5.5" /><path d="M10 8h.01M14 8h.01M10 10a3 3 0 0 0 4 0" /></>; break;
    case "move": drawing = <><circle cx="12" cy="5" r="2" /><path d="m9 21 2-6-3-3 2-3 3 2 2 3h4" /><path d="m11 15-4 1-2 4" /></>; break;
    case "shield": drawing = <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>; break;
    case "book": drawing = <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5Z" /><path d="M4 5.5v16M8 7h8M8 11h8" /></>; break;
    case "award": drawing = <><circle cx="12" cy="8" r="6" /><path d="m8.2 13.1-1 8.2L12 18l4.8 3.3-1-8.2" /><path d="m9.5 8 1.7 1.7L14.7 6" /></>; break;
    case "users": drawing = <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>; break;
    case "check": drawing = <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>; break;
    case "external": drawing = <><path d="M14 3h7v7" /><path d="m10 14 11-11" /><path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" /></>; break;
    case "plus": drawing = <><path d="M12 5v14" /><path d="M5 12h14" /></>; break;
    case "hand": drawing = <><path d="M7 11V5a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-5a1.5 1.5 0 0 1 3 0v7-3a1.5 1.5 0 0 1 3 0v6c0 4-2.5 7-7 7h-1c-2.5 0-4-1-5-2.5L4 15a1.7 1.7 0 0 1 2.5-2.2L9 15" /></>; break;
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{drawing}</svg>;
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a className={`brand${light ? " brand-light" : ""}`} href="#top" aria-label="Lydia Memorial Hospital home">
      <img className="brand-logo" src="/manus-storage/LYDIAMEMORIAHOSPITALlogo_6d0bdf1f.webp" alt="" aria-hidden="true" width={68} height={64} />
      <span className="brand-copy"><strong>Lydia Memorial</strong><small>HOSPITAL · GIFTED HANDS</small></span>
    </a>
  );
}

const coreServices: { icon: IconName; title: string; text: string }[] = [
  { icon: "move", title: "Physiotherapy", text: "The hospital profile describes a fully functional physiotherapy unit." },
  { icon: "shield", title: "Ultrasound", text: "Ultrasound equipment is among the facilities listed in the supplied hospital information." },
  { icon: "lab", title: "Laboratory", text: "A well-equipped laboratory is listed as part of the hospital's facilities." },
  { icon: "pill", title: "Pharmacy", text: "An on-site pharmacy is included in the hospital profile." },
  { icon: "baby", title: "Maternity", text: "Maternity care is among the services identified by the hospital." },
];

const communityServices: { icon: IconName; title: string; text: string; note?: string }[] = [
  { icon: "heart", title: "Community outreaches", text: "The hospital reports providing medical outreaches to its community and beyond since its founding." },
  { icon: "users", title: "NHIS services", text: "The supplied profile states that LMH received NHIA accreditation for NHIS services in August 2025.", note: "Reported August 2025" },
  { icon: "check", title: "Immunisation services", text: "The supplied profile states that the Benue State Government approved immunisation services." },
  { icon: "shield", title: "ART unit", text: "An ART unit is listed among the services approved by the Benue State Government, according to the hospital profile." },
];

function ServiceCard({ icon, title, text, note }: { icon: IconName; title: string; text: string; note?: string }) {
  return <article className="service-card"><span className="service-icon"><Icon name={icon} size={23} /></span><div className="service-title-row"><h3>{title}</h3>{note && <span className="service-note">{note}</span>}</div><p>{text}</p></article>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [isHeroFocused, setIsHeroFocused] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const slide = heroSlides[activeSlide];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) setAutoplayEnabled(false);
      else setAutoplayEnabled(true);
    };
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!autoplayEnabled || prefersReducedMotion || isHeroHovered || isHeroFocused) return;
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(timer);
  }, [autoplayEnabled, prefersReducedMotion, isHeroHovered, isHeroFocused]);

  const moveSlide = (step: number) => setActiveSlide((current) => (current + step + heroSlides.length) % heroSlides.length);

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <div className="utility-bar">
        <div className="shell utility-inner"><a href={`mailto:${email}`}><Icon name="mail" size={14} /> {email}</a><span className="utility-location"><Icon name="pin" size={14} /> Ugbokolo, Benue State</span><a className="utility-phone" href={phoneLink}><Icon name="phone" size={14} /> {phone}</a></div>
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <Brand />
          <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"} size={23} /></button>
          <nav id="primary-navigation" className={`primary-nav${menuOpen ? " is-open" : ""}`} aria-label="Primary navigation">
            {navItems.map((item) => <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>)}
            <a className="nav-cta" href={phoneLink} onClick={closeMenu}><Icon name="phone" size={16} /> Call the hospital</a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-roledescription="carousel" aria-label="Lydia Memorial Hospital highlights" onMouseEnter={() => setIsHeroHovered(true)} onMouseLeave={() => setIsHeroHovered(false)} onFocusCapture={() => setIsHeroFocused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsHeroFocused(false); }}>
          <img key={slide.image} className="hero-image" src={slide.image} alt={slide.alt} fetchPriority={activeSlide === 0 ? "high" : "auto"} />
          <div className="hero-wash" />
          <div className="shell hero-inner">
            <div className="hero-copy">
              <div key={slide.image} className="hero-slide-copy" role="group" aria-roledescription="slide" aria-label={`Slide ${activeSlide + 1} of ${heroSlides.length}`}>
                <span className="hero-kicker"><span className="kicker-line" /> {slide.kicker}</span>
                <h1 id="hero-title">{slide.title}<br /><em>{slide.emphasis}</em></h1>
                <p>{slide.description}</p>
                <div className="hero-actions"><a className="button button-primary" href={phoneLink}>Speak with our team <Icon name="arrow" size={18} /></a><a className="button button-quiet" href="#about">Discover Lydia Memorial <Icon name="arrow" size={17} /></a></div>
              </div>
              <div className="hero-motto"><span className="motto-symbol"><Icon name="hand" size={19} /></span><span><small>OUR MOTTO</small><strong>Gifted Hands</strong></span></div>
              <div className="hero-slider-controls" role="group" aria-label="Hero slideshow controls">
                <button className="hero-step" type="button" aria-label="Previous slide" onClick={() => moveSlide(-1)}>‹</button>
                <div className="hero-dots" role="group" aria-label="Choose a slide">{heroSlides.map((item, index) => <button key={item.image} type="button" className={`hero-dot${index === activeSlide ? " is-active" : ""}`} aria-label={`Show slide ${index + 1}: ${item.title} ${item.emphasis}`} aria-current={index === activeSlide ? "true" : undefined} onClick={() => setActiveSlide(index)} />)}</div>
                <button className="hero-step" type="button" aria-label="Next slide" onClick={() => moveSlide(1)}>›</button>
                <button className="hero-autoplay" type="button" aria-label={autoplayEnabled ? "Pause slideshow" : "Play slideshow"} onClick={() => setAutoplayEnabled((enabled) => !enabled)}><span aria-hidden="true">{autoplayEnabled ? "Ⅱ" : "▶"}</span><span>{autoplayEnabled ? "Pause" : "Play"}</span></button>
              </div>
            </div>
          </div>
          <span className="hero-image-note">{slide.note}</span>
          <div className="hero-wave" aria-hidden="true" />
        </section>

        <section className="quick-links shell" aria-label="Explore the hospital">
          <a href="#services" className="quick-link"><span className="quick-icon"><Icon name="heart" /></span><span><strong>Care & services</strong><small>What the hospital offers</small></span><Icon name="arrow" size={17} /></a>
          <a href="#about" className="quick-link"><span className="quick-icon"><Icon name="shield" /></span><span><strong>About LMH</strong><small>Our purpose and story</small></span><Icon name="arrow" size={17} /></a>
          <a href="#founder" className="quick-link"><span className="quick-icon"><Icon name="users" /></span><span><strong>Our founder</strong><small>Meet Dr Mark Ogbodo</small></span><Icon name="arrow" size={17} /></a>
          <a href="#contact" className="quick-link"><span className="quick-icon"><Icon name="pin" /></span><span><strong>Find us</strong><small>Visit us in Ugbokolo</small></span><Icon name="arrow" size={17} /></a>
        </section>

        <section className="section about-section" id="about" aria-labelledby="about-title">
          <div className="shell about-layout">
            <div className="about-visual">
              <img src="/manus-storage/about-story_2b92662d.jpg" alt="Illustrative image of healthcare workers; image is not from Lydia Memorial Hospital." loading="lazy" />
              <div className="visual-caption"><span className="caption-mark"><Icon name="heart" size={17} /></span><span><strong>Kindness in every interaction</strong><small>A belief that guides our care</small></span></div>
              <span className="decor-ring decor-ring-one" aria-hidden="true" /><span className="decor-ring decor-ring-two" aria-hidden="true" />
            </div>
            <div className="about-copy">
              <span className="eyebrow">A PLACE FOR HEALING</span>
              <h2 id="about-title">A local hospital.<br /><em>A lasting commitment.</em></h2>
              <p className="lead-copy">Lydia Memorial Hospital is a private hospital in Ichakwu-Amejo, Ugbokolo, serving the people of Okpokwu and surrounding communities.</p>
              <p>The hospital's supplied story describes a calm and supportive atmosphere, with staff who greet patients with warmth and care. Its work is guided by a simple belief: every person deserves compassion, dignity and attention.</p>
              <div className="about-details"><span><Icon name="pin" size={17} /><span><strong>Rooted in Edumoga</strong><small>Okpokwu LGA, Benue State</small></span></span><span><Icon name="award" size={17} /><span><strong>Registered hospital</strong><small>Registration No. 3734742</small></span></span></div>
              <a className="text-link" href="#contact">Plan your visit <Icon name="arrow" size={17} /></a>
            </div>
          </div>
        </section>

        <section className="purpose-section" aria-label="Hospital vision and mission">
          <div className="shell purpose-layout">
            <div className="purpose-intro"><span className="eyebrow eyebrow-light">OUR PURPOSE</span><h2>Healing that puts people first.</h2><p>Founded on service and compassion, Lydia Memorial Hospital works toward the complete wellbeing of the people it serves.</p></div>
            <article className="purpose-card"><span className="purpose-icon"><Icon name="heart" size={22} /></span><span className="eyebrow">OUR VISION</span><h3>Wellbeing in every sense.</h3><p>To ensure a complete state of wellbeing for patients and promote healthy medical practices in all forms.</p></article>
            <article className="purpose-card"><span className="purpose-icon"><Icon name="hand" size={22} /></span><span className="eyebrow">OUR MISSION</span><h3>Excellent care, within reach.</h3><p>To provide affordable and easily accessible excellent healthcare services through God's Gifted hands.</p></article>
          </div>
        </section>

        <section className="section services-section" id="services" aria-labelledby="services-title">
          <div className="shell">
            <div className="section-heading services-heading"><div><span className="eyebrow">CARE AT LYDIA MEMORIAL</span><h2 id="services-title">Support for your health,<br /><em>close to home.</em></h2></div><p>These services and initiatives are described in information supplied by the hospital. Please contact LMH to confirm current availability and eligibility.</p></div>
            <div className="service-group-head"><span className="group-number">01</span><div><h3>Hospital facilities & care</h3><p>Services and facilities named in the supplied hospital profile.</p></div></div>
            <div className="service-grid service-grid-core">{coreServices.map((service) => <ServiceCard key={service.title} {...service} />)}</div>
            <div className="service-group-head community-head"><span className="group-number">02</span><div><h3>Community & public health</h3><p>Outreach and approvals reported by the hospital.</p></div></div>
            <div className="service-grid">{communityServices.map((service) => <ServiceCard key={service.title} {...service} />)}</div>
            <div className="designation-note"><span className="designation-icon"><Icon name="shield" size={21} /></span><p><strong>Infectious-disease holding-centre designation</strong><br />The hospital profile states that the Benue State Government designated LMH a holding centre for infectious diseases in early 2025. This records the information provided and is not a representation of current facility status.</p></div>
          </div>
        </section>

        <section className="milestone-section" aria-labelledby="milestone-title">
          <div className="shell milestone-layout">
            <div className="milestone-intro"><span className="eyebrow eyebrow-light">OUR STORY SO FAR</span><h2 id="milestone-title">Serving with purpose<br /><em>since 2022.</em></h2><p>A few milestones shared in the hospital's own profile.</p></div>
            <div className="milestone-list">
              <article className="milestone"><span className="milestone-date">06 JUN<br /><strong>2022</strong></span><div className="milestone-body"><span className="milestone-dot" /><h3>Founded and commissioned</h3><p>Lydia Memorial Hospital was founded and commissioned by Distinguished Senator Abba Moro.</p></div></article>
              <article className="milestone"><span className="milestone-date">EARLY<br /><strong>2025</strong></span><div className="milestone-body"><span className="milestone-dot" /><h3>Holding-centre designation</h3><p>The hospital profile reports a Benue State Government designation for infectious diseases.</p></div></article>
              <article className="milestone"><span className="milestone-date">AUG<br /><strong>2025</strong></span><div className="milestone-body"><span className="milestone-dot" /><h3>NHIS accreditation reported</h3><p>The supplied information states that LMH received NHIA accreditation for NHIS services.</p></div></article>
            </div>
          </div>
        </section>

        <section className="founder-section section" id="founder" aria-labelledby="founder-title">
          <div className="shell">
            <div className="founder-top">
              <div className="founder-heading"><span className="eyebrow">LEADERSHIP & SERVICE</span><h2 id="founder-title">A life shaped by<br /><em>care and purpose.</em></h2></div>
              <p className="founder-lead">The hospital's supplied biography brings together medicine, writing and community leadership in the story of its founder.</p>
            </div>
            <div className="founder-layout">
              <aside className="founder-card"><div className="founder-monogram" aria-hidden="true"><span>M</span><span>O</span><i /></div><div className="founder-card-copy"><span className="eyebrow">FOUNDER · MEDICAL DIRECTOR · CEO</span><h3>Amb. Dr Mark A. C. Ogbodo</h3><p>Dist-FIGPCM</p><a href="#contact" className="founder-contact">Contact the hospital <Icon name="arrow" size={16} /></a></div></aside>
              <div className="founder-bio">
                <p className="bio-opening">A native of Obi Local Government Area in Benue State, Amb. Dr Mark A. C. Ogbodo founded Lydia Memorial Hospital with a view of medicine as a responsibility to serve. The hospital's biography describes a practice shaped by kindness, dignity and attention to patients, regardless of their financial circumstances.</p>
                <div className="bio-facts">
                  <article><span className="bio-fact-icon"><Icon name="award" size={18} /></span><div><h4>Medical & leadership training</h4><p>Trained in medicine at Igbinedion University, Okada. The biography also notes certification in Leadership and Management in Health from the University of Washington.</p></div></article>
                  <article><span className="bio-fact-icon"><Icon name="shield" size={18} /></span><div><h4>Peace & public service</h4><p>Described as a certified Global Peace Ambassador and licensed Conflict Manager through the Institute of Global Peace and Conflict Management.</p></div></article>
                  <article><span className="bio-fact-icon"><Icon name="book" size={18} /></span><div><h4>Writer & publisher</h4><p>As CEO of Adigwu Publishers, he has written on education, determination and leadership. His work includes <em>Untold</em>, <em>Amour Maternel</em> and <em>The Journey – A Flight to Greatness After a Long Walk</em>.</p></div></article>
                  <article><span className="bio-fact-icon"><Icon name="users" size={18} /></span><div><h4>Professional involvement</h4><p>The profile identifies him as Assistant Secretary of the Association of Nigerian Private Medical Practitioners, Benue State Branch, and a former NMA Benue Publication Committee Chair and Public Relations Officer (2022–2024).</p></div></article>
                </div>
                <div className="books-panel"><div className="books-panel-heading"><span className="eyebrow">SELECTED BOOKS</span><Icon name="book" size={19} /></div><div className="book-list"><div><strong>Untold</strong><span>2023 · Selected as a JSS 3 reading text, as stated in the supplied biography.</span></div><div><strong>Amour Maternel</strong><span>2021 · Listed as a NERDC-certified supplementary text and a Benue State JSS 2 reading text.</span></div><div><strong>The Journey</strong><span>2017 · <em>A Flight to Greatness After a Long Walk</em>.</span></div></div></div>
              </div>
            </div>
            <div className="recognition-strip"><div className="recognition-heading"><span className="eyebrow">RECOGNITION</span><h3>Honours noted in the supplied biography</h3></div><div className="recognition-items"><span><Icon name="award" size={17} /> Merit Man of the Year · 2025</span><span><Icon name="award" size={17} /> Global Peace Award · 2025</span><span><Icon name="award" size={17} /> NMA Benue Award of Excellence · 2024</span><span><Icon name="award" size={17} /> Sixth Chinua Achebe Anthology · 2021</span></div></div>
            <p className="source-note">Biography, credentials, publications and recognitions on this page are presented as supplied by Lydia Memorial Hospital and have not been independently verified.</p>
          </div>
        </section>

        <section className="visit-section" id="contact" aria-labelledby="contact-title">
          <div className="visit-photo"><img src="/manus-storage/service-womens_cad96589.jpg" alt="Illustrative healthcare image; not a photograph from Lydia Memorial Hospital." loading="lazy" /></div>
          <div className="visit-overlay" />
          <div className="shell visit-inner">
            <div className="visit-copy"><span className="eyebrow eyebrow-light">WE'RE HERE TO HELP</span><h2 id="contact-title">A conversation<br />can be a <em>first step.</em></h2><p>For information about the hospital or to ask about a service, contact Lydia Memorial Hospital directly.</p><a className="button button-light" href={phoneLink}><Icon name="phone" size={18} /> Call {phone}</a></div>
            <div className="contact-card">
              <div className="contact-card-head"><span className="contact-pin"><Icon name="pin" size={22} /></span><div><span className="eyebrow">VISIT LYDIA MEMORIAL</span><h3>Find the hospital</h3></div></div>
              <p className="contact-address">{address}</p>
              <a className="directions-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer">Open in Maps <Icon name="external" size={16} /></a>
              <div className="contact-divider" />
              <a className="contact-method" href={phoneLink}><span><Icon name="phone" size={18} /></span><span><small>PHONE</small><strong>{phone}</strong></span><Icon name="arrow" size={16} /></a>
              <a className="contact-method" href={`mailto:${email}`}><span><Icon name="mail" size={18} /></span><span><small>EMAIL</small><strong>{email}</strong></span><Icon name="arrow" size={16} /></a>
              <p className="contact-footnote">Please call to confirm current service availability and eligibility before visiting.</p>
            </div>
          </div>
        </section>
        <section className="section faq-section" id="faqs" aria-labelledby="faq-title">
          <div className="shell faq-layout">
            <div className="faq-intro"><span className="eyebrow">VISITOR INFORMATION</span><h2 id="faq-title">Helpful answers<br /><em>before you call.</em></h2><p>These answers reflect information supplied by Lydia Memorial Hospital. Please contact LMH to confirm current arrangements and service details.</p><a className="text-link" href={phoneLink}>Call {phone} <Icon name="arrow" size={17} /></a></div>
            <div className="faq-list">{visitorFaqs.map((item, index) => <details className="faq-item" key={item.question}><summary><span className="faq-number">{String(index + 1).padStart(2, "0")}</span><span className="faq-question">{item.question}</span></summary><div className="faq-answer"><p>{item.answer}</p></div></details>)}</div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-main">
          <div className="footer-brand"><Brand light /><p>Compassionate, patient-centred care in Ugbokolo, Benue State. <em>Gifted Hands.</em></p></div>
          <div className="footer-links"><h3>Explore</h3><a href="#about">About LMH</a><a href="#services">Care & services</a><a href="#founder">Our founder</a><a href="#faqs">Visitor FAQs</a><a href="#contact">Contact & location</a></div>
          <div className="footer-links footer-contact"><h3>Get in touch</h3><a href={phoneLink}><Icon name="phone" size={15} /> {phone}</a><a href={`mailto:${email}`}><Icon name="mail" size={15} /> {email}</a><span><Icon name="pin" size={15} /> Ugbokolo, Benue State</span></div>
        </div>
        <div className="shell footer-bottom"><span>© {new Date().getFullYear()} Lydia Memorial Hospital · Reg. No. 3734742</span><span>Information on this website is based on details supplied by the hospital. Contact LMH to confirm current services.</span></div>
      </footer>
    </>
  );
}

export default App;
