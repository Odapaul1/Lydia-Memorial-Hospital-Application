import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Icon, type IconName } from "../components/Icon";
import {
  ButtonLink,
  Eyebrow,
  GradientHero,
  PageTransition,
  Reveal,
  SectionHeading,
  Step,
} from "../components/siteUi";
import { findPage, pagePath, pagesFor } from "../content/queries";
import { useSiteContent } from "../content/SiteContentProvider";
import type { CmsPage, PageCategory } from "../content/types";
import NotFoundPage from "./NotFoundPage";

const SERVICE_FALLBACKS = [
  "/images/service-emergency.jpg",
  "/images/service-eye-care.jpg",
  "/images/service-womens.jpg",
  "/images/service-surgery.jpg",
  "/images/service-telehealth.jpg",
];

export const serviceImage = (page: Pick<CmsPage, "imageUrl">, index: number): string =>
  page.imageUrl || SERVICE_FALLBACKS[index % SERVICE_FALLBACKS.length];

/** Picks a sensible icon from the page slug, falling back to a stethoscope. */
const serviceIcon = (slug: string): IconName => {
  if (slug.includes("pharmacy")) return "pill";
  if (slug.includes("lab")) return "lab";
  if (slug.includes("matern")) return "baby";
  if (slug.includes("ultrasound")) return "activity";
  if (slug.includes("physio")) return "move";
  if (slug.includes("immunis")) return "syringe";
  if (slug.includes("nhis")) return "shield";
  if (slug.includes("infectious")) return "hospital";
  if (slug.includes("community")) return "users";
  if (slug.includes("art")) return "heart-pulse";
  return "stethoscope";
};

const sectionLabel = (category: PageCategory) => (category === "about" ? "About LMH" : "Care & services");

/** Directory grid of every published service page. */
export function ServicesPage() {
  const { pages, settings } = useSiteContent();
  const services = pagesFor(pages, "service").filter((page) => page.slug !== "services");

  return (
    <PageTransition>
      <GradientHero
        kicker="Specialist care, connected"
        title="Services designed around real life."
        body="From urgent support to routine care, explore the services that help you and your family feel well looked after."
        image="/images/services-hero.jpg"
      >
        <ButtonLink to="/appointments" variant="light">Book a visit</ButtonLink>
      </GradientHero>

      <section className="section container">
        <SectionHeading
          eyebrow="Our services"
          title="The right team for your next step"
          body="Explore care by need, specialty or the way you want to be seen."
        />
        <div className="service-grid service-grid-large">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.05}>
              <Link to={pagePath(service)} className="service-card">
                <div className="service-image" style={{ backgroundImage: `url(${serviceImage(service, i)})` }}>
                  <span className="service-icon">
                    <Icon name={serviceIcon(service.slug)} size={20} />
                  </span>
                </div>
                <div className="service-content">
                  <h3>{service.title}</h3>
                  <p>{service.lead}</p>
                  <span className="text-link">Explore care <Icon name="arrow" size={15} /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section pale-section">
        <div className="container info-band">
          <div>
            <Eyebrow>Need help choosing?</Eyebrow>
            <h2>Tell us what you need. We will point you in the right direction.</h2>
          </div>
          <ButtonLink to="/contact">Talk to our team</ButtonLink>
        </div>
      </section>

      <p className="request-footnote container" style={{ paddingBottom: 60 }}>
        {settings.home.sourceDisclosure}
      </p>
    </PageTransition>
  );
}

/** Shared detail layout for a single CMS page (about story or service). */
function CmsPageView({ page, pages }: { page: CmsPage; pages: CmsPage[] }) {
  const { settings } = useSiteContent();
  const { contact, branding } = settings;
  const isService = page.category === "service";
  const label = sectionLabel(page.category);
  const siblings = pagesFor(pages, page.category).filter((item) => item.slug !== "services" && item.id !== page.id);
  const index = pagesFor(pages, page.category).findIndex((item) => item.id === page.id);

  return (
    <PageTransition>
      <GradientHero
        kicker={page.eyebrow || label}
        title={page.title}
        body={page.lead}
        image={serviceImage(page, Math.max(index, 0))}
        imagePosition={isService ? "center" : "center 20%"}
      >
        <ButtonLink to={isService ? "/appointments" : "/doctors"} variant="light">
          {isService ? "Book a visit" : "Meet our care team"}
        </ButtonLink>
      </GradientHero>

      <section className="section container split-section">
        <div>
          <Eyebrow>{label}</Eyebrow>
          <h2>{page.title}</h2>
          <div className="check-list">
            <span><Icon name="check" size={16} /> Confirm availability before visiting</span>
            <span><Icon name="check" size={16} /> Ask about eligibility and costs</span>
            <span><Icon name="check" size={16} /> Call ahead with any questions</span>
          </div>
          <div className="profile-card">
            <span className="eyebrow">Talk to the hospital</span>
            <h3>Confirm current details</h3>
            <a className="contact-method" href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>
              <span><Icon name="phone" size={18} /></span>
              <span><small>PHONE</small><strong>{contact.phone}</strong></span>
            </a>
            <a className="contact-method" href={`mailto:${contact.email}`}>
              <span><Icon name="mail" size={18} /></span>
              <span><small>EMAIL</small><strong>{contact.email}</strong></span>
            </a>
            <ButtonLink to="/contact" className="aside-cta">Contact &amp; location</ButtonLink>
          </div>
        </div>
        <div>
          <article className="prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
              {page.bodyMarkdown}
            </ReactMarkdown>
          </article>
          <p className="request-footnote">{settings.home.sourceDisclosure}</p>
        </div>
      </section>

      {isService && (
        <>
          <section className="section pale-section">
            <div className="container">
              <SectionHeading eyebrow="What to expect" title="A clear path from first contact to follow-up." />
              <div className="steps-grid">
                <Step n="01" title="Start with a conversation" body={`Call ${contact.phone} and share what is happening. Our team will help you understand the right next step.`} />
                <Step n="02" title="Meet your specialist" body="Your clinician will listen carefully, explain your options and create a plan with you." />
                <Step n="03" title="Keep moving forward" body="We stay connected with follow-up, education and support that fits your life." />
              </div>
            </div>
          </section>
          <section className="section container">
            <div className="cta-panel">
              <div>
                <Eyebrow>Ready when you are</Eyebrow>
                <h2>Take the next step with confidence.</h2>
                <p>Choose a care option and we will help you find a time that works.</p>
              </div>
              <ButtonLink to="/appointments">Book an appointment</ButtonLink>
            </div>
          </section>
        </>
      )}

      {siblings.length > 0 && (
        <section className="section container">
          <SectionHeading eyebrow="Keep exploring" title={`More in ${label}`} />
          <div className="service-grid">
            {siblings.slice(0, 4).map((item, i) => (
              <Reveal key={item.id} delay={i * 0.05}>
                <Link to={pagePath(item)} className="service-card">
                  <div className="service-image small" style={{ backgroundImage: `url(${serviceImage(item, i)})` }} />
                  <div className="service-content">
                    <h3>{item.title}</h3>
                    <span className="text-link">Read more <Icon name="arrow" size={15} /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="request-footnote" style={{ marginTop: 24 }}>
            {branding.name} · Registration No. {branding.registrationNumber}
          </p>
        </section>
      )}
    </PageTransition>
  );
}

export function SectionPage({ category }: { category: PageCategory }) {
  const { slug } = useParams();
  const { pages } = useSiteContent();
  const page = findPage(pages, category, slug);
  if (!page) return <NotFoundPage />;
  return <CmsPageView page={page} pages={pages} />;
}

export default CmsPageView;
