import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon, type IconName } from "../components/Icon";
import { Eyebrow, PageTransition, Reveal } from "../components/siteUi";
import { useSiteSettings } from "../content/SiteContentProvider";

export default function DepartmentsPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const { departments } = useSiteSettings();

  const filters = ["All", ...Array.from(new Set(departments.map((d) => d.category)))];

  const visible = departments.filter(
    (dept) =>
      (filter === "All" || dept.category === filter) &&
      `${dept.title} ${dept.description}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageTransition>
      <section className="simple-hero">
        <div className="container">
          <Eyebrow>Care directory</Eyebrow>
          <h1>Find the right department<br />for your needs.</h1>
          <p>Explore our clinical teams, specialties and the care they provide.</p>
        </div>
      </section>

      <section className="section container">
        <div className="directory-controls">
          <div className="search-field inline">
            <Icon name="search" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search departments" />
          </div>
          <div className="filter-pills">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={filter === f ? "active" : ""}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="department-grid">
          {visible.map((dept, i) => (
            <Reveal key={dept.id} delay={i * 0.04}>
              <Link to="/contact" className="department-card">
                <span className="department-icon">
                  <Icon name={dept.icon as IconName} size={20} />
                </span>
                <div>
                  <span className="eyebrow">{dept.category}</span>
                  <h3>{dept.title}</h3>
                  <p>{dept.description}</p>
                  <small>{dept.specialistCount} specialists</small>
                </div>
                <Icon name="arrow" size={18} />
              </Link>
            </Reveal>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="empty-state">
            <Icon name="search" size={28} />
            <h3>No departments found</h3>
            <p>Try a different specialty or clear your search.</p>
          </div>
        )}
      </section>
    </PageTransition>
  );
}
