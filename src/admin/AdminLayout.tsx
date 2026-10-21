import { NavLink, Link } from "react-router-dom";
import type { ReactNode } from "react";
import type { AdminIdentity } from "../content/types";
import { Icon } from "../components/Icon";

export function AdminLayout({ admin, onSignOut, children }: { admin: AdminIdentity | null; onSignOut: () => void; children: ReactNode }) {
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-inner">
          <Link className="admin-brand" to="/admin/media">
            <strong>Lydia Memorial</strong>
            <small>Content manager</small>
          </Link>
          <nav className="admin-nav" aria-label="Admin sections">
            <NavLink to="/admin/media">Media library</NavLink>
            <NavLink to="/admin/settings">Site content</NavLink>
            <NavLink to="/admin/pages">Pages</NavLink>
          </nav>
          <div className="admin-header-actions">
            <Link className="admin-button admin-button-quiet" to="/">View site <Icon name="external" size={15} /></Link>
            <span className="admin-who">{admin?.email ?? "Signed in"}</span>
            <button type="button" className="admin-button" onClick={onSignOut}>Sign out</button>
          </div>
        </div>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
