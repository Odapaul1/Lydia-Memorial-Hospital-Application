import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { ButtonLink, Eyebrow, PageTransition, Reveal } from "../components/siteUi";
import { formatNewsDate, newsItems } from "../content/pageContent";

export function NewsPage() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const categories = ["All", ...Array.from(new Set(newsItems.map((item) => item.category)))];

  const visible = newsItems.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      `${item.title} ${item.excerpt}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <PageTransition>
      <section className="simple-hero">
        <div className="container">
          <Eyebrow>News &amp; insights</Eyebrow>
          <h1>Ideas for feeling<br />more informed.</h1>
          <p>Stories, guidance and perspectives from the Lydia Memorial Hospital team.</p>
        </div>
      </section>

      <section className="section container">
        <div className="directory-controls">
          <div className="search-field inline">
            <Icon name="search" size={18} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search stories" />
          </div>
          <div className="filter-pills">
            {categories.map((item) => (
              <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="empty-state">
            <Icon name="search" size={28} />
            <h3>No stories found</h3>
            <p>Try a different section or clear your search.</p>
          </div>
        ) : (
          <div className="news-grid">
            {visible.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.06}>
                <Link to={`/news/${item.slug}`} className="news-card">
                  <div className="news-image" style={{ backgroundImage: `url(${item.image})` }} />
                  <div className="news-content">
                    <div className="news-meta">
                      <span>{item.category}</span>
                      <span>{formatNewsDate(item.date)}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.excerpt}</p>
                    <span className="text-link">Read story <Icon name="arrow" size={15} /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </PageTransition>
  );
}

export function NewsDetailPage() {
  const { slug } = useParams();
  const item = newsItems.find((entry) => entry.slug === slug);

  if (!item) {
    return (
      <PageTransition>
        <section className="simple-hero">
          <div className="container">
            <Eyebrow>News &amp; insights</Eyebrow>
            <h1>Article not found</h1>
            <p>This story is not available. It may have been unpublished or removed.</p>
            <ButtonLink to="/news">Back to News &amp; insights</ButtonLink>
          </div>
        </section>
      </PageTransition>
    );
  }

  const paragraphs = item.content
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <PageTransition>
      <section className="simple-hero">
        <div className="container">
          <Eyebrow>{item.category}</Eyebrow>
          <h1>{item.title}</h1>
          <p>{formatNewsDate(item.date)} — {item.excerpt}</p>
        </div>
      </section>

      <section className="section container article-layout">
        <div className="article-hero" style={{ backgroundImage: `url(${item.image})` }} />
        {paragraphs.map((paragraph, index) => (
          <p className="large-copy" key={index}>{paragraph}</p>
        ))}
        <div className="article-back">
          <ButtonLink to="/news" variant="outline">Back to News &amp; insights</ButtonLink>
        </div>
      </section>
    </PageTransition>
  );
}
