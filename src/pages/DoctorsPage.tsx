import { useState } from "react";
import { Icon } from "../components/Icon";
import { ButtonLink, DoctorCard, Eyebrow, PageTransition, Reveal } from "../components/siteUi";
import { useSiteSettings } from "../content/SiteContentProvider";

const titleCase = (value: string) =>
  value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

export default function DoctorsPage() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const { doctors } = useSiteSettings();

  const specialties = Array.from(new Set(doctors.map((d) => d.specialty)));

  const visible = doctors.filter(
    (doctor) =>
      (specialty === "All specialties" || doctor.specialty === specialty) &&
      `${doctor.name} ${doctor.specialty} ${doctor.role}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <PageTransition>
      <section className="simple-hero">
        <div className="container">
          <Eyebrow>Meet your care team</Eyebrow>
          <h1>Doctors who listen<br />first.</h1>
          <p>Find a specialist and take your next step with confidence.</p>
        </div>
      </section>

      <section className="section container">
        <div className="directory-controls">
          <div className="search-field inline">
            <Icon name="search" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or specialty"
            />
          </div>
          <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
            <option>All specialties</option>
            {specialties.map((s) => (
              <option key={s} value={s}>{titleCase(s)}</option>
            ))}
          </select>
        </div>

        {visible.length === 0 ? (
          <div className="empty-state">
            <Icon name="search" size={28} />
            <h3>No doctors found</h3>
            <p>Try a different specialty or clear your search.</p>
          </div>
        ) : (
          <div className="doctor-grid doctor-grid-four">
            {visible.map((doctor, i) => (
              <Reveal key={doctor.id} delay={i * 0.05}>
                <DoctorCard doctor={doctor} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="section pale-section">
        <div className="container info-band">
          <div>
            <Eyebrow>Can&rsquo;t find who you&rsquo;re looking for?</Eyebrow>
            <h2>Our patient team can help you find the right specialist.</h2>
          </div>
          <ButtonLink to="/contact">Talk to the team</ButtonLink>
        </div>
      </section>
    </PageTransition>
  );
}
