import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ScrollManager from './components/ScrollManager.jsx';
import { ScrollMeter, ToTop } from './components/ScrollWidgets.jsx';
import Home from './pages/Home.jsx';
import { ProductsPage, ProductCategory, ProductDetail } from './pages/ProductCatalog.jsx';
import ProductFaradigm from './pages/ProductFaradigm.jsx';
import ProductOEM from './pages/ProductOEM.jsx';
import SolutionsPage from './pages/SolutionsPage.jsx';
import { WorkIndex, CaseStudy } from './pages/WorkPages.jsx';
import { ADMIN_BASE } from './lib/admin.js';
import { AdminGuard, AdminLogin, AdminRoot } from './pages/admin/AdminShell.jsx';
import { AdminProductForm, AdminProducts } from './pages/admin/AdminProducts.jsx';
import { AboutPage, NamePage, TrustPage, SupportPage, NewsPage, ContactPage, NotFound } from './pages/CompanyPages.jsx';

function Layout() {
  return (
    <>
      <ScrollManager />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollMeter />
      <ToTop />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* The hidden admin. Not linked anywhere; it has no site header, footer or menu. */}
      <Route path={ADMIN_BASE.slice(1)} element={<AdminRoot />}>
        <Route path="login" element={<AdminLogin />} />
        <Route element={<AdminGuard />}>
          <Route index element={<Navigate to="products/new" replace />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id" element={<AdminProductForm />} />
        </Route>
      </Route>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/category/:slug" element={<ProductCategory />} />
        <Route path="products/faradigm-ultracapacitors" element={<ProductFaradigm />} />
        <Route path="products/oem-ultracapacitors" element={<ProductOEM />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="solutions" element={<Navigate to="/solutions/proven" replace />} />
        <Route path="solutions/:tab" element={<SolutionsPage />} />
        <Route path="work" element={<WorkIndex />} />
        <Route path="work/:slug" element={<CaseStudy />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="about/name" element={<NamePage />} />
        <Route path="about/testimonials" element={<TrustPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
