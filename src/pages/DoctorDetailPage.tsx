import { Link, useParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { ButtonLink, Eyebrow, GradientHero, PageTransition, SectionHeading } from "../components/siteUi";
import { pagesFor, pagePath } from "../content/queries";
import { useSiteContent, useSiteSettings } from "../content/SiteContentProvider";
import { serviceImage } from "./CmsPageView";

const LOCATION = "Lydia Memorial Hospital, No. 3 Ejeh Street, Ichakwu-Amejo (Ugbokolo), Benue State";

export default function DoctorDetailPage() {
  const { slug } = useParams();
  const { doctors, contact } = useSiteSettings();
  const { pages } = useSiteContent();

  const doctor = doctors.find((entry) => entry.slug === slug);

  if (!doctor) {
    return (
      <PageTransition>
        <section className="simple-hero">
          <div className="container">
            <Eyebrow>Our care team</Eyebrow>
            <h1>Profile not found</h1>
            <p>We could not find that doctor. Browse our full care team instead.</p>
            <ButtonLink to="/doctors">Meet our doctors</ButtonLink>
          </div>
        </section>
      </PageTransition>
    );
  }

  const surname = doctor.name.split(" ").slice(-1)[0] ?? doctor.name;
  const services = pagesFor(pages, "service").slice(0, 3);

  return (
    <PageTransition>
      <GradientHero
        kicker={doctor.specialty}
        title={doctor.name}
        body={`${doctor.role}. Part of the Lydia Memorial Hospital care team in Ugbokolo, Benue State.`}
        image={doctor.imageUrl}
        imagePosition="center 20%"
      >
        <ButtonLink to="/appointments" variant="light">Book with {surname}</ButtonLink>
      </GradientHero>

      <section className="section container doctor-detail-layout">
        <div>
          <Eyebrow>About your doctor</Eyebrow>
          <h2>Experienced care, clearly explained.</h2>
          <p className="large-copy">
            {doctor.name} works in {doctor.specialty} at Lydia Memorial Hospital. The best care plan is one you
            understand and can take ownership of, so please ask questions during your visit.
          </p>
          <div className="detail-meta">
            <span>
              <Icon name="calendar" size={17} />
              <b>Availability</b>
              {doctor.isAvailable ? "Currently accepting patients" : "Please ask about availability"}
            </span>
            <span>
              <Icon name="hospital" size={17} />
              <b>Location</b>
              {LOCATION}
            </span>
          </div>
        </div>

        <div className="profile-card">
          <span className="eyebrow">Before your visit</span>
          <h3>Make the most of your time.</h3>
          <div className="check-list">
            <span><Icon name="check" size={16} /> Bring your current medication list</span>
            <span><Icon name="check" size={16} /> Note your questions beforehand</span>
            <span><Icon name="check" size={16} /> Bring your cover details</span>
          </div>
          <ButtonLink to="/contact">Call {contact.phone}</ButtonLink>
        </div>
      </section>

      {services.length > 0 && (
        <section className="section pale-section">
          <div className="container">
            <SectionHeading eyebrow="Related services" title="Keep your care connected." />
            <div className="service-grid">
              {services.map((service, index) => (
                <Link key={service.id} to={pagePath(service)} className="service-card">
                  <div
                    className="service-image small"
                    style={{ backgroundImage: `url(${serviceImage(service, index)})` }}
                  />
                  <div className="service-content">
                    <h3>{service.title}</h3>
                    <span className="text-link">
                      Explore care <Icon name="arrow" size={15} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
}
