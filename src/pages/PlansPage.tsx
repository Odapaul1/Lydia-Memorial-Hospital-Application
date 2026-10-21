import { Icon } from "../components/Icon";
import { ButtonLink, Eyebrow, PageTransition, SectionHeading } from "../components/siteUi";
import { planOptions } from "../content/pageContent";

export default function PlansPage() {
  return (
    <PageTransition>
      <section className="simple-hero">
        <div className="container">
          <Eyebrow>Provider directory</Eyebrow>
          <h1>Accepted plans<br />and payment options.</h1>
          <p>Options patients most often ask about. Please confirm your own cover with the hospital and your insurer.</p>
        </div>
      </section>

      <section className="section container">
        <div className="info-note">
          <Icon name="shield" size={22} />
          <p>
            The hospital&rsquo;s supplied profile reports NHIA accreditation for NHIS services received in August 2025.
            This information is for reference only and is subject to change — please check with the hospital and your
            insurer to confirm that you can access care before you travel.
          </p>
        </div>

        <SectionHeading eyebrow="Ways to pay" title="Plans and payment options" />

        <div className="partner-grid">
          {planOptions.map((plan) => (
            <div className="partner-card" key={plan.name}>
              <span className="partner-mark">{plan.mark}</span>
              <div>
                <b>{plan.name}</b>
                <small>{plan.note}</small>
              </div>
              <Icon name="arrow" size={15} />
            </div>
          ))}
        </div>
      </section>

      <section className="section pale-section">
        <div className="container info-band">
          <div>
            <Eyebrow>Not sure if you&rsquo;re covered?</Eyebrow>
            <h2>Our team can help you understand your options.</h2>
          </div>
          <ButtonLink to="/contact">Ask about cover</ButtonLink>
        </div>
      </section>
    </PageTransition>
  );
}
