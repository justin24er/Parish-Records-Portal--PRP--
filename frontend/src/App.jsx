// frontend/src/App.jsx
// Root router — defines every route in the application.
// Splash screen is shown once on initial load before navigating to /ingia.

import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ROUTES }        from './constants/routes';
import { SPLASH_DURATION_MS } from './constants/app';

// Core layout & guards
import SplashScreen      from './components/ui/SplashScreen';
import ProtectedRoute    from './components/auth/ProtectedRoute';
import GuestRoute        from './components/auth/GuestRoute';
import DashboardLayout   from './components/layout/DashboardLayout';

// Auth pages
import LoginPage         from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Dashboard pages
import DashboardPage     from './pages/dashboard/DashboardPage';

// Placeholder pages (future modules will replace these)
import PlaceholderPage   from './pages/PlaceholderPage';

export default function App() {
  const [splashVisible, setSplashVisible] = useState(true);

  // Show splash for SPLASH_DURATION_MS then hide it
  useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Splash overlays everything for the first few seconds */}
      <SplashScreen visible={splashVisible} />

      <Routes>
        {/* ── Root: redirect to login ── */}
        <Route path={ROUTES.SPLASH} element={<Navigate to={ROUTES.LOGIN} replace />} />

        {/* ── Guest-only (auth) routes ── */}
        <Route
          path={ROUTES.LOGIN}
          element={<GuestRoute><LoginPage /></GuestRoute>}
        />
        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={<GuestRoute><ForgotPasswordPage /></GuestRoute>}
        />
        <Route
          path={ROUTES.RESET_PASSWORD}
          element={<GuestRoute><ResetPasswordPage /></GuestRoute>}
        />

        {/* ── Protected (authenticated) routes ── */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.DASHBOARD}  element={<DashboardPage />} />
          <Route path={ROUTES.WAUMINI}    element={<PlaceholderPage title="Waumini"           icon="Users"       />} />
          <Route path={ROUTES.SAKRAMENTI} element={<PlaceholderPage title="Sakramenti"        icon="Droplets"    />} />
          <Route path={ROUTES.VYETI}      element={<PlaceholderPage title="Vyeti"             icon="FileText"    />} />
          <Route path={ROUTES.VITABU}     element={<PlaceholderPage title="Vitabu vya Kanisa" icon="BookOpen"    />} />
          <Route path={ROUTES.RIPOTI}     element={<PlaceholderPage title="Ripoti"            icon="BarChart2"   />} />
          <Route path={ROUTES.ARIFA}      element={<PlaceholderPage title="Arifa"             icon="Bell"        />} />
          <Route path={ROUTES.MIPANGILIO} element={<PlaceholderPage title="Mipangilio"        icon="Settings"    />} />
          <Route path={ROUTES.WASIFU}     element={<PlaceholderPage title="Wasifu Wangu"      icon="UserCircle"  />} />
        </Route>

        {/* ── 404 catch-all ── */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </>
  );
}
