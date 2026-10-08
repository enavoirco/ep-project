import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { SettingsProvider } from './context/SettingsContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { AdminLayout } from './components/layout/AdminLayout.tsx';

// Public Pages
import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { LocationsPage } from './pages/LocationsPage.tsx';
import { LocationDetailPage } from './pages/LocationDetailPage.tsx';
import { QuotePage } from './pages/QuotePage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin.tsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { AdminLocations } from './pages/admin/AdminLocations.tsx';
import { AdminLeads } from './pages/admin/AdminLeads.tsx';
import { AdminFollowUps } from './pages/admin/AdminFollowUps.tsx';
import { AdminCustomers } from './pages/admin/AdminCustomers.tsx';
import { AdminEnquiries } from './pages/admin/AdminEnquiries.tsx';
import { AdminActivity } from './pages/admin/AdminActivity.tsx';
import { AdminSettings } from './pages/admin/AdminSettings.tsx';

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');

  // Sync browser back/forward history
  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: string) => {
    if (path.startsWith('/#')) {
      // Anchor link
      const elem = document.querySelector(path.replace('/', ''));
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  // Route Router Renderer
  const renderRoute = () => {
    // Admin Protected Gate
    if (isAdminRoute && currentPath !== '/admin/login') {
      if (isLoading) {
        return (
          <div className="min-h-screen bg-white flex items-center justify-center text-[#1098C7]">
            <div className="w-8 h-8 border-2 border-[#1098C7] border-t-transparent rounded-full animate-spin" />
          </div>
        );
      }
      if (!isAuthenticated) {
        return <AdminLogin navigate={navigate} />;
      }

      // Inside Admin Portal
      return (
        <AdminLayout currentPath={currentPath} navigate={navigate}>
          {currentPath === '/admin' && <AdminDashboard navigate={navigate} />}
          {currentPath === '/admin/locations' && <AdminLocations navigate={navigate} />}
          {currentPath === '/admin/leads' && <AdminLeads navigate={navigate} />}
          {currentPath === '/admin/follow-ups' && <AdminFollowUps navigate={navigate} />}
          {currentPath === '/admin/customers' && <AdminCustomers navigate={navigate} />}
          {currentPath === '/admin/enquiries' && <AdminEnquiries navigate={navigate} />}
          {currentPath === '/admin/activity' && <AdminActivity />}
          {currentPath === '/admin/settings' && <AdminSettings />}
        </AdminLayout>
      );
    }

    // Public Routes
    if (currentPath === '/admin/login') {
      return (
        <div className="min-h-screen flex flex-col bg-[#F7F7F4]">
          <Navbar currentPath={currentPath} navigate={navigate} />
          <div className="flex-1 flex items-center justify-center py-12">
            <AdminLogin navigate={navigate} />
          </div>
          <Footer navigate={navigate} />
        </div>
      );
    }

    // Parse location details route: /locations/:slug
    if (currentPath.startsWith('/locations/') && currentPath !== '/locations') {
      const slug = currentPath.replace('/locations/', '');
      return (
        <div className="min-h-screen flex flex-col bg-white text-[#302B2B]">
          <Navbar currentPath={currentPath} navigate={navigate} />
          <div className="flex-1">
            <LocationDetailPage idOrSlug={slug} navigate={navigate} />
          </div>
          <Footer navigate={navigate} />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-white text-[#302B2B]">
        <Navbar currentPath={currentPath} navigate={navigate} />
        <main className="flex-1">
          {currentPath === '/' && <HomePage navigate={navigate} />}
          {currentPath === '/about' && <AboutPage navigate={navigate} />}
          {currentPath === '/locations' && <LocationsPage navigate={navigate} />}
          {currentPath === '/quote' && (
            <QuotePage
              navigate={navigate}
              preselectedLocationId={new URLSearchParams(window.location.search).get('location_id') || undefined}
            />
          )}
          {currentPath === '/contact' && <ContactPage navigate={navigate} />}
        </main>
        <Footer navigate={navigate} />
      </div>
    );
  };

  return <>{renderRoute()}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <MainApp />
      </SettingsProvider>
    </AuthProvider>
  );
}
