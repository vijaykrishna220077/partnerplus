import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PortalHeaderBanner } from './components/common/PortalHeaderBanner';
import { CooperativeLoginGateway } from './components/cooperative/auth/CooperativeLoginGateway';
import { CooperativePendingApprovalView } from './components/cooperative/auth/CooperativePendingApprovalView';
import { locationService } from './services/locationService';
import { VoiceAssistantBanner } from './components/common/VoiceAssistantBanner';
import { UserRole } from './types';

// Code-split heavy routes and portals using React.lazy for optimized initial bundle loading
const CustomerPortal = lazy(() => import('./portals/CustomerPortal').then(m => ({ default: m.CustomerPortal })));
const WorkerPortal = lazy(() => import('./portals/WorkerPortal').then(m => ({ default: m.WorkerPortal })));
const CooperativePortal = lazy(() => import('./portals/CooperativePortal').then(m => ({ default: m.CooperativePortal })));
const OrganizationPortal = lazy(() => import('./portals/OrganizationPortal').then(m => ({ default: m.OrganizationPortal })));
const WelcomePage = lazy(() => import('./components/welcome/WelcomePage').then(m => ({ default: m.WelcomePage })));
const AuthGateway = lazy(() => import('./components/auth/AuthGateway').then(m => ({ default: m.AuthGateway })));

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-bold text-slate-600">Loading PartnerPlus Platform...</span>
    </div>
  </div>
);

const MainPlatformRouter: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { setCurrentLocation, setCity, addToast, setRole } = useApp();
  const detectedUserRef = useRef<string | null>(null);

  // Unauthenticated landing vs auth gateway state
  const [authViewMode, setAuthViewMode] = useState<'welcome' | 'auth'>('welcome');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>('customer');

  const handleNavigateToAuth = (mode: 'login' | 'signup' = 'login', role: UserRole = 'customer') => {
    setAuthInitialMode(mode);
    setAuthInitialRole(role);
    setAuthViewMode('auth');
  };

  // Track current URL/pathname
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname.toLowerCase();
  });

  // Automatically detect user location upon logging in
  useEffect(() => {
    if (isAuthenticated && user?.id && detectedUserRef.current !== user.id) {
      detectedUserRef.current = user.id;

      const autoDetectUserLocation = async () => {
        try {
          const { coords, isSimulated, accuracyWarning } = await locationService.getCurrentLocation();
          const geoResult = await locationService.fetchReverseGeocode(coords.latitude, coords.longitude);

          if (geoResult && geoResult.address) {
            setCurrentLocation(geoResult.address);
            setCity(geoResult.city);

            addToast({
              type: isSimulated ? 'info' : 'success',
              title: isSimulated ? 'Default Location Active' : 'Location Auto-Detected',
              message: `Logged in as ${user.name}. Location set to ${geoResult.address}${geoResult.pincode ? ` (${geoResult.pincode})` : ''}.${accuracyWarning ? ` ${accuracyWarning}` : ''}`
            });
          }
        } catch (error) {
          console.warn('Auto location detection failed on login:', error);
        }
      };

      autoDetectUserLocation();
    } else if (!isAuthenticated) {
      detectedUserRef.current = null;
    }
  }, [isAuthenticated, user?.id, user?.name, setCurrentLocation, setCity, addToast]);

  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
    }
  }, [user?.role, setRole]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname.toLowerCase());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.toLowerCase());
  };

  const isCooperativeRoute = currentPath.startsWith('/cooperative');
  const isCooperativeLoginRoute = currentPath === '/cooperative/login';
  const isCooperativePendingRoute = currentPath === '/cooperative/pending-approval';

  // DIRECT ROUTE: /cooperative/pending-approval
  if (isCooperativePendingRoute) {
    return (
      <CooperativePendingApprovalView
        onEnterPortal={() => navigateTo('/cooperative')}
        onReturnToHome={() => navigateTo('/')}
      />
    );
  }

  // 1. DIRECT ROUTE: /cooperative/login
  if (isCooperativeLoginRoute) {
    return (
      <CooperativeLoginGateway 
        onLoginSuccess={() => navigateTo('/cooperative')}
        onReturnToNormalPortal={() => navigateTo('/')}
      />
    );
  }

  // 2. DIRECT ROUTE: /cooperative
  if (isCooperativeRoute) {
    if (!isAuthenticated || !user) {
      return (
        <CooperativeLoginGateway 
          onLoginSuccess={() => navigateTo('/cooperative')}
          onReturnToNormalPortal={() => navigateTo('/')}
        />
      );
    }

    const isAuthorizedCooperativeStaff = 
      user.role === 'cooperative_admin' && 
      (user.staffRole === 'COOPERATIVE_ADMIN' || user.staffRole === 'COOPERATIVE_STAFF');

    if (!isAuthorizedCooperativeStaff) {
      return (
        <CooperativeLoginGateway 
          isUnauthorizedAttempt={true}
          onReturnToNormalPortal={() => navigateTo('/')}
        />
      );
    }

    return (
      <Suspense fallback={<LoadingSpinner />}>
        <CooperativePortal />
      </Suspense>
    );
  }

  // 3. DEFAULT ROUTES (/): If not authenticated, show Welcome Page first, or AuthGateway when requested
  if (!isAuthenticated || !user) {
    if (authViewMode === 'auth') {
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <AuthGateway 
            initialMode={authInitialMode}
            initialRole={authInitialRole}
            onBackToWelcome={() => setAuthViewMode('welcome')}
          />
        </Suspense>
      );
    }
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <WelcomePage 
          onNavigateToAuth={handleNavigateToAuth}
          onNavigateToCooperative={() => navigateTo('/cooperative/login')}
        />
      </Suspense>
    );
  }

  // 4. AUTHENTICATED USER ROUTING
  if (user.role === 'organization_admin' || user.role === 'organization_staff') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <OrganizationPortal />
      </Suspense>
    );
  }

  if (user.role === 'cooperative_admin') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <CooperativePortal />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0F172A]">
      <PortalHeaderBanner />

      <div className="flex-1 w-full">
        <Suspense fallback={<LoadingSpinner />}>
          {user.role === 'customer' && <CustomerPortal />}
          {user.role === 'worker' && <WorkerPortal />}
        </Suspense>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <MainPlatformRouter />
        <VoiceAssistantBanner />
      </AuthProvider>
    </AppProvider>
  );
}
