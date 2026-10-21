import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { ButtonLink, Eyebrow, PageTransition, Step } from "../components/siteUi";
import { useSiteSettings } from "../content/SiteContentProvider";

const APPOINTMENT_NOTICE =
  "A request is not a confirmed appointment. Your visit is only arranged once the hospital has spoken with you.";

export default function AppointmentsPage() {
  const { contact } = useSiteSettings();
  const phoneLink = `tel:${contact.phone.replace(/[^\d+]/g, "")}`;

  return (
    <PageTransition>
      <div className="appointment-page">
        <div className="container appointment-grid">
          <div className="appointment-intro">
            <Eyebrow>Request an appointment</Eyebrow>
            <h1>Request an appointment with our care team.</h1>
            <p>
              Tell us who you are, the service you need and a time that suits you. Our reception team will call you
              back to confirm the details.
            </p>
            <div className="booking-steps">
              <Step
                n="1"
                title="Send your request"
                body="Choose a service and a preferred date and time, then share your contact details."
              />
              <Step
                n="2"
                title="We call you back"
                body="Our team reviews your request and phones you to confirm or agree another time."
              />
              <Step
                n="3"
                title="Your visit is arranged"
                body="The appointment is only confirmed once we have spoken with you."
              />
            </div>
          </div>

          <div className="contact-form appointment-request-form">
            <div>
              <Eyebrow>Appointment request</Eyebrow>
              <h2 className="appointment-form-title">Talk to our reception team</h2>
            </div>
            <p className="request-footnote">
              Online booking is not switched on for this site yet. Until it is, the quickest way to arrange a visit is
              to call or email the hospital, or send an enquiry from the contact page.
            </p>
            <a className="contact-method" href={phoneLink}>
              <span><Icon name="phone" size={17} /></span>
              <span>
                <small>Call us</small>
                <strong>{contact.phone}</strong>
              </span>
            </a>
            <a className="contact-method" href={`mailto:${contact.email}`}>
              <span><Icon name="mail" size={17} /></span>
              <span>
                <small>Email us</small>
                <strong>{contact.email}</strong>
              </span>
            </a>
            <div className="check-list">
              <span><Icon name="check" size={16} /> Have your full name and phone number ready</span>
              <span><Icon name="check" size={16} /> Know the service or department you need</span>
              <span><Icon name="check" size={16} /> Bring your cover details if you have them</span>
            </div>
            <div className="request-notice" role="note">
              <Icon name="info" size={16} />
              <span>{APPOINTMENT_NOTICE}</span>
            </div>
            <ButtonLink to="/contact">Send an enquiry</ButtonLink>
          </div>
        </div>
      </div>

      <section className="appointment-trust">
        <div className="container">
          <span>
            <Icon name="shield" size={17} /> Your details are handled securely — <Link to="/contact">see how we handle enquiries</Link>
          </span>
          <span><Icon name="clock" size={17} /> We aim to call back within one working day</span>
          <span><Icon name="phone" size={17} /> Urgent? Call {contact.phone}</span>
        </div>
      </section>
    </PageTransition>
  );
}
