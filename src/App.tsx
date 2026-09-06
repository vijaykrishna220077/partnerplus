import React, { useState, useEffect, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthGateway } from './components/auth/AuthGateway';
import { WelcomePage } from './components/welcome/WelcomePage';
import { PortalHeaderBanner } from './components/common/PortalHeaderBanner';
import { CustomerPortal } from './portals/CustomerPortal';
import { WorkerPortal } from './portals/WorkerPortal';
import { CooperativePortal } from './portals/CooperativePortal';
import { OrganizationPortal } from './portals/OrganizationPortal';
import { CooperativeLoginGateway } from './components/cooperative/auth/CooperativeLoginGateway';
import { CooperativePendingApprovalView } from './components/cooperative/auth/CooperativePendingApprovalView';
import { locationService } from './services/locationService';
import { VoiceAssistantBanner } from './components/common/VoiceAssistantBanner';
import { UserRole } from './types';

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
          // 1. Fetch live GPS coordinates
          const { coords, isSimulated, accuracyWarning } = await locationService.getCurrentLocation();
          
          // 2. Perform live reverse geocoding via OpenStreetMap Nominatim
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
    // If not authenticated, prompt for cooperative login
    if (!isAuthenticated || !user) {
      return (
        <CooperativeLoginGateway 
          onLoginSuccess={() => navigateTo('/cooperative')}
          onReturnToNormalPortal={() => navigateTo('/')}
        />
      );
    }

    // Role-based verification check for /cooperative
    const isAuthorizedCooperativeStaff = 
      user.role === 'cooperative_admin' && 
      (user.staffRole === 'COOPERATIVE_ADMIN' || user.staffRole === 'COOPERATIVE_STAFF');

    if (!isAuthorizedCooperativeStaff) {
      // Show explicit "Unauthorized access" screen with security clearance denial
      return (
        <CooperativeLoginGateway 
          isUnauthorizedAttempt={true}
          onReturnToNormalPortal={() => navigateTo('/')}
        />
      );
    }

    // Authorized cooperative admin / staff member
    return <CooperativePortal />;
  }

  // 3. DEFAULT ROUTES (/): If not authenticated, show Welcome Page first, or AuthGateway when requested
  if (!isAuthenticated || !user) {
    if (authViewMode === 'auth') {
      return (
        <AuthGateway 
          initialMode={authInitialMode}
          initialRole={authInitialRole}
          onBackToWelcome={() => setAuthViewMode('welcome')}
        />
      );
    }
    return (
      <WelcomePage 
        onNavigateToAuth={handleNavigateToAuth}
        onNavigateToCooperative={() => navigateTo('/cooperative/login')}
      />
    );
  }

  // 4. AUTHENTICATED USER ROUTING:
  // If the user's assigned role is organization_admin or organization_staff, show the dedicated Company / Organization Portal
  if (user.role === 'organization_admin' || user.role === 'organization_staff') {
    return <OrganizationPortal />;
  }

  // If the user's assigned role is cooperative_admin, show the dedicated Cooperative Portal directly
  if (user.role === 'cooperative_admin') {
    return <CooperativePortal />;
  }

  // Customer or Worker Portals (Preserved intact with top banner)
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0F172A]">
      <PortalHeaderBanner />

      <div className="flex-1 w-full">
        {user.role === 'customer' && <CustomerPortal />}
        {user.role === 'worker' && <WorkerPortal />}
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
