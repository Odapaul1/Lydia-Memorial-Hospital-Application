import { Icon, type IconName } from "../components/Icon";
import {
  ButtonAnchor,
  ButtonLink,
  GradientHero,
  PageTransition,
  SectionHeading,
} from "../components/siteUi";
import { careerRoles } from "../content/pageContent";

function Principle({ icon, title, body }: { icon: IconName; title: string; body: string }) {
  return (
    <div className="principle-card">
      <span className="principle-icon">
        <Icon name={icon} size={21} />
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export default function CareersPage() {
  return (
    <PageTransition>
      <GradientHero
        kicker="Work with Lydia Memorial"
        title="Build a meaningful career with us."
        body="Join clinical and non-clinical teams committed to excellent, affordable care for the Ugbokolo community."
        image="/images/careers-hero.jpg"
      >
        <ButtonAnchor href="#roles" variant="light">Browse open roles</ButtonAnchor>
        <ButtonLink to="/contact" variant="outline" className="hero-outline">Contact the hospital</ButtonLink>
      </GradientHero>

      <section className="section container three-card-row">
        <Principle
          icon="heart-pulse"
          title="Patient-first culture"
          body="Every role helps deliver safe, respectful care for families across Okpokwu and beyond."
        />
        <Principle
          icon="activity"
          title="Grow with a full hospital team"
          body="Work alongside clinicians, nurses, laboratory staff, pharmacists and administrators."
        />
        <Principle
          icon="users"
          title="People who care"
          body="Join colleagues who value teamwork, continuous learning and integrity."
        />
      </section>

      <section className="section pale-section" id="roles">
        <div className="container">
          <SectionHeading
            eyebrow="Open roles"
            title="Find your next meaningful move."
            body="Roles listed here are illustrative. Please contact the hospital to confirm current vacancies and how to apply."
          />
          <div className="role-list">
            {careerRoles.map((role) => (
              <div className="role-row" key={role.title}>
                <div>
                  <span>{role.group}</span>
                  <h3>{role.title}</h3>
                  <p>{role.meta}</p>
                </div>
                <ButtonLink to="/contact" variant="outline">View role</ButtonLink>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
