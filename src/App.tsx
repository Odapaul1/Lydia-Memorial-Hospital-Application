import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { SiteContentProvider } from "./content/SiteContentProvider";
import AdminApp from "./admin/AdminApp";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import { SectionPage, ServicesPage } from "./pages/CmsPageView";
import { ContactPage, FaqsPage, PatientsPage } from "./pages/StaticPages";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorDetailPage from "./pages/DoctorDetailPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import GalleryPage from "./pages/GalleryPage";
import PlansPage from "./pages/PlansPage";
import CareersPage from "./pages/CareersPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import { NewsDetailPage, NewsPage } from "./pages/NewsPage";

function PublicRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<SectionPage category="about" />} />
        <Route path="/about/doctors" element={<DoctorsPage />} />
        <Route path="/about/departments" element={<DepartmentsPage />} />
        <Route path="/about/gallery" element={<GalleryPage />} />
        <Route path="/about/:slug" element={<SectionPage category="about" />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:slug" element={<DoctorDetailPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:slug" element={<NewsDetailPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<SectionPage category="service" />} />
        <Route path="/faqs" element={<FaqsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteContentProvider>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*" element={<PublicRoutes />} />
        </Routes>
      </SiteContentProvider>
    </BrowserRouter>
  );
}
