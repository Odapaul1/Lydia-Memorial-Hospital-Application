import { useState } from "react";
import { Icon } from "../components/Icon";
import {
  ButtonLink,
  Eyebrow,
  FaqList,
  GradientHero,
  PageTransition,
  SectionHeading,
} from "../components/siteUi";
import { useSiteSettings } from "../content/SiteContentProvider";

const RESOURCE_TABS = {
  "Before your visit": {
    title: "Arrive feeling prepared.",
    body: "From directions and parking to what to bring, here are the practical details that make your first step easier.",
    resources: ["Getting here and parking", "What to bring", "Understanding your bill", "Visiting hours", "Patient rights and privacy"],
  },
  "During your stay": {
    title: "Feel supported while you are with us.",
    body: "Our nurses, coordinators and support teams are here to help with the everyday questions that matter.",
    resources: ["Who to ask for help", "Meals and rest", "Keeping family informed", "Infection prevention", "Your care team explained"],
  },
  "After your visit": {
    title: "Know what happens next.",
    body: "Your care does not stop when you leave. We keep your plan, follow-up and questions connected.",
    resources: ["Collecting results", "Follow-up appointments", "Medication guidance", "When to come back", "Feedback and complaints"],
  },
} as const;

type TabName = keyof typeof RESOURCE_TABS;

export function PatientsPage() {
  const [tab, setTab] = useState<TabName>("Before your visit");
  const tabs = Object.keys(RESOURCE_TABS) as TabName[];
  const { faqs, contact, branding } = useSiteSettings();
  const current = RESOURCE_TABS[tab];

  return (
    <PageTransition>
      <GradientHero
        kicker="Patients & visitors"
        title="Everything you need for a smoother visit."
        body="Helpful information, clear next steps and a team ready to answer your questions."
        image="/images/patients-hero.jpg"
      >
        <ButtonLink to="/contact" variant="light">Contact patient services</ButtonLink>
      </GradientHero>

      <section className="section container">
        <div className="tabs">
          {tabs.map((name) => (
            <button className={tab === name ? "active" : ""} onClick={() => setTab(name)} key={name}>
              {name}
            </button>
          ))}
        </div>
        <div className="tab-layout">
          <div>
            <Eyebrow>{tab}</Eyebrow>
            <h2>{current.title}</h2>
            <p className="large-copy">{current.body}</p>
            <ButtonLink to="/contact" variant="outline">Ask a question</ButtonLink>
          </div>
          <div className="resource-list">
            {current.resources.map((resource, i) => (
              <div key={resource} className="resource-row">
                <span>0{i + 1}</span>
                <b>{resource}</b>
                <Icon name="arrow" size={16} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pale-section">
        <div className="container">
          <SectionHeading eyebrow="Need to know" title="Common questions" />
          <FaqList items={faqs} />
          <p className="request-footnote" style={{ marginTop: 24 }}>
            Still unsure? Call {branding.name} on {contact.phone} and the team will help.
          </p>
        </div>
      </section>
    </PageTransition>
  );
}

export function FaqsPage() {
  const { faqs, contact, navigation, branding } = useSiteSettings();
  const phoneLink = `tel:${contact.phone.replace(/[^+\d]/g, "")}`;

  return (
    <PageTransition>
      <section className="simple-hero">
        <div className="container">
          <Eyebrow>Visitor information</Eyebrow>
          <h1>Visitor FAQs<br />answered plainly.</h1>
          <p>
            These answers reflect information supplied by {branding.name}. Please contact the hospital to confirm
            current arrangements and service details.
          </p>
        </div>
      </section>

      <section className="section container">
        <SectionHeading
          eyebrow="Before you call"
          title="Everything we know at a glance."
          body="For anything not covered here, the hospital team is the best source of current information."
          action={<a className="button button-outline" href={phoneLink}>Call {contact.phone}</a>}
        />
        <FaqList items={faqs} />
        <p className="request-footnote" style={{ marginTop: 24 }}>
          {navigation.faqLabel} · {branding.name}
        </p>
      </section>
    </PageTransition>
  );
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { contact, branding } = useSiteSettings();
  const phoneLink = `tel:${contact.phone.replace(/[^+\d]/g, "")}`;

  return (
    <PageTransition>
      <section className="simple-hero">
        <div className="container">
          <Eyebrow>Contact us</Eyebrow>
          <h1>We are here<br />to help.</h1>
          <p>Ask a question, find your way to us or talk with our patient team.</p>
        </div>
      </section>

      <section className="section container contact-layout">
        <div className="contact-details">
          <Eyebrow>Get in touch</Eyebrow>
          <h2>Let&rsquo;s make the next step clearer.</h2>
          <p>
            Whether you are planning a visit or need help right now, our team at {branding.name} will point you in
            the right direction.
          </p>
          <div className="contact-item">
            <span><Icon name="phone" size={19} /></span>
            <div><b>Call us</b><p><a href={phoneLink}>{contact.phone}</a></p></div>
          </div>
          <div className="contact-item">
            <span><Icon name="mail" size={19} /></span>
            <div><b>Email us</b><p><a href={`mailto:${contact.email}`}>{contact.email}</a></p></div>
          </div>
          <div className="contact-item">
            <span><Icon name="pin" size={19} /></span>
            <div><b>Visit us</b><p>{contact.address}</p></div>
          </div>
        </div>

        {submitted ? (
          <div className="success-card">
            <span className="success-icon"><Icon name="check" size={24} /></span>
            <Eyebrow>Message received</Eyebrow>
            <h2>Thanks for reaching out.</h2>
            <p>A member of our team will get back to you within one working day.</p>
            <button className="button button-primary" onClick={() => setSubmitted(false)}>
              Send another message <Icon name="arrow" size={16} />
            </button>
          </div>
        ) : (
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="form-row">
              <label>First name<input required placeholder="Your first name" /></label>
              <label>Last name<input required placeholder="Your last name" /></label>
            </div>
            <label>Email address<input type="email" required placeholder="you@example.com" /></label>
            <label>
              How can we help?
              <select>
                <option>General enquiry</option>
                <option>Appointments</option>
                <option>Insurance & plans</option>
                <option>Medical records</option>
              </select>
            </label>
            <label>Message<textarea rows={5} placeholder="Tell us a little more" /></label>
            <button className="button button-primary" type="submit">
              Send message <Icon name="arrow" size={16} />
            </button>
          </form>
        )}
      </section>

      <section className="section container">
        <div className="map-placeholder">
          <div className="map-grid" />
          <span className="map-pin"><Icon name="pin" size={22} /></span>
          <div className="map-label">
            <b>{branding.name}</b>
            <span>{contact.address}</span>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
