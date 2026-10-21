import { ButtonLink, Eyebrow, PageTransition } from "../components/siteUi";

export default function NotFoundPage() {
  return (
    <PageTransition>
      <section className="simple-hero">
        <div className="container">
          <Eyebrow>Page not found</Eyebrow>
          <h1>Let&rsquo;s get you<br />back on track.</h1>
          <p>The page you were looking for has moved, but our care team is right here.</p>
          <ButtonLink to="/">Back to home</ButtonLink>
        </div>
      </section>
    </PageTransition>
  );
}
