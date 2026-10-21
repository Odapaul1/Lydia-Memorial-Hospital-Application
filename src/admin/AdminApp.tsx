import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import AdminLogin from "./AdminLogin";
import MediaLibraryPage from "./MediaLibraryPage";
import PagesPage from "./PagesPage";
import SettingsPage from "./SettingsPage";
import { useAdminSession } from "./useAdminSession";

export default function AdminApp() {
  const { state, admin, signIn, signOut } = useAdminSession();

  if (state === "checking") {
    return <div className="admin-login"><p className="admin-muted">Checking your session…</p></div>;
  }

  if (state === "signed-out") {
    return <AdminLogin onSignIn={signIn} />;
  }

  return (
    <AdminLayout admin={admin} onSignOut={() => void signOut()}>
      <Routes>
        <Route index element={<Navigate to="settings" replace />} />
        <Route path="media" element={<MediaLibraryPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="pages" element={<PagesPage />} />
        <Route path="*" element={<Navigate to="settings" replace />} />
      </Routes>
    </AdminLayout>
  );
}
