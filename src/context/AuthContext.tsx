import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, CooperativeStaffRole, OrganizationType, OrganizationVerificationStatus } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  staffRole?: CooperativeStaffRole;
  cooperativeMembershipVerified?: boolean;
  permissions?: string[];
  avatar?: string;
  cooperativeId?: string;
  cooperativeName?: string;
  cooperativeRegNo?: string;
  organizationId?: string;
  organizationName?: string;
  organizationType?: OrganizationType;
  organizationVerificationStatus?: OrganizationVerificationStatus;
  organizationRole?: 'ORGANIZATION_ADMIN' | 'ORGANIZATION_STAFF';
  workerTier?: 'skilled' | 'semi_skilled' | 'general';
  primaryTrade?: string;
  experienceYears?: number;
  address?: string;
  city?: string;
  joinedDate: string;
}

export interface DemoAccount {
  label: string;
  role: UserRole;
  roleLabel: string;
  badgeColor: string;
  description: string;
  user: AuthUser;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: 'Murugan Thangaraj (Senior Artisan Lead)',
    role: 'worker',
    roleLabel: 'Artisan / Worker',
    badgeColor: 'bg-emerald-600 text-white',
    description: 'Master Electrician & Wireman (NSDC Certified) under Chennai Central Labour Cooperative.',
    user: {
      id: 'w1',
      name: 'Murugan Thangaraj',
      email: 'murugan.artisan@partnerplus.org',
      phone: '+91 98412 34567',
      role: 'worker',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      cooperativeId: 'coop-1',
      cooperativeName: 'Chennai Central Labour Cooperative Society',
      cooperativeRegNo: 'TN-LCS-442/2014',
      workerTier: 'skilled',
      primaryTrade: 'Electrical & Motor Maintenance',
      experienceYears: 12,
      city: 'Chennai',
      joinedDate: 'Mar 2021'
    }
  },
  {
    label: 'Ananya Sharma (Verified Customer)',
    role: 'customer',
    roleLabel: 'Customer / Household',
    badgeColor: 'bg-blue-600 text-white',
    description: 'Residential & Community customer booking cooperative services across Chennai & Coimbatore.',
    user: {
      id: 'cust-demo-1',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@gmail.com',
      phone: '+91 94440 12345',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      address: 'Plot 42, Anna Nagar West',
      city: 'Chennai',
      joinedDate: 'Jan 2025'
    }
  },
  {
    label: 'K. S. Ramanathan (Cooperative Admin - Full Authority)',
    role: 'cooperative_admin',
    roleLabel: 'Cooperative Admin',
    badgeColor: 'bg-purple-700 text-white',
    description: 'Official Cooperative Secretary & Operations Director with full administrative and financial governance authority.',
    user: {
      id: 'admin-coop-chief',
      name: 'K. S. Ramanathan',
      email: 'admin.ramanathan@chennailabourcoop.org',
      phone: '+91 44 2615 8890',
      role: 'cooperative_admin',
      staffRole: 'COOPERATIVE_ADMIN',
      cooperativeMembershipVerified: true,
      permissions: ['ALL', 'OPERATIONS', 'FINANCE', 'VERIFICATION', 'SETTINGS', 'ORGANIZATIONS'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      cooperativeId: 'coop-1',
      cooperativeName: 'Chennai Central Labour Cooperative Society',
      cooperativeRegNo: 'TN-LCS-442/2014',
      address: 'No. 44, Co-op Bhavan, Rajaji Salai',
      city: 'Chennai',
      joinedDate: 'Established 2014'
    }
  },
  {
    label: 'P. Senthil Murugan (Cooperative Staff - Operations)',
    role: 'cooperative_staff',
    roleLabel: 'Cooperative Staff',
    badgeColor: 'bg-indigo-600 text-white',
    description: 'Cooperative Field Operations Desk Officer managing dispatch, emergency tickets, and worker verifications.',
    user: {
      id: 'staff-coop-ops',
      name: 'P. Senthil Murugan',
      email: 'ops.senthil@chennailabourcoop.org',
      phone: '+91 44 2615 8895',
      role: 'cooperative_staff',
      staffRole: 'COOPERATIVE_STAFF',
      cooperativeMembershipVerified: true,
      permissions: ['OPERATIONS', 'JOBS', 'WORKERS', 'VERIFICATION', 'COMPLAINTS'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      cooperativeId: 'coop-1',
      cooperativeName: 'Chennai Central Labour Cooperative Society',
      cooperativeRegNo: 'TN-LCS-442/2014',
      address: 'Field Dispatch Unit 2, Co-op Bhavan',
      city: 'Chennai',
      joinedDate: 'Jan 2022'
    }
  },
  {
    label: 'Priya Narayanan (Organization Admin - L&T Kovai Facilities)',
    role: 'organization_admin',
    roleLabel: 'Organization Admin',
    badgeColor: 'bg-amber-600 text-white',
    description: 'Operations Director at L&T Kovai Infrastructure managing bulk workforce hiring for industrial & facility projects.',
    user: {
      id: 'org-admin-1',
      name: 'Priya Narayanan',
      email: 'priya.n@ltfacilities.co.in',
      phone: '+91 98422 77110',
      role: 'organization_admin',
      organizationRole: 'ORGANIZATION_ADMIN',
      organizationId: 'org-1',
      organizationName: 'L&T Kovai Facilities & Infrastructure Ltd.',
      organizationType: 'Facility Management',
      organizationVerificationStatus: 'VERIFIED',
      permissions: ['ALL', 'PROJECTS', 'HIRING', 'BILLING', 'STAFF', 'SETTINGS'],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      address: 'L&T Tech Park, Avinashi Road',
      city: 'Coimbatore',
      joinedDate: 'Oct 2024'
    }
  },
  {
    label: 'Karthik Raja (Organization Site Supervisor)',
    role: 'organization_staff',
    roleLabel: 'Organization Staff',
    badgeColor: 'bg-orange-600 text-white',
    description: 'On-site Project Supervisor managing workforce attendance, daily muster, and live job tracking at Warehouse site.',
    user: {
      id: 'org-staff-1',
      name: 'Karthik Raja',
      email: 'karthik.raja@ltfacilities.co.in',
      phone: '+91 98422 77115',
      role: 'organization_staff',
      organizationRole: 'ORGANIZATION_STAFF',
      organizationId: 'org-1',
      organizationName: 'L&T Kovai Facilities & Infrastructure Ltd.',
      organizationType: 'Facility Management',
      organizationVerificationStatus: 'VERIFIED',
      permissions: ['PROJECTS', 'ATTENDANCE', 'LIVE_MAP', 'WORKFORCE'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      address: 'Warehouse Hub 4, Peelamedu',
      city: 'Coimbatore',
      joinedDate: 'Feb 2025'
    }
  }
];

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginWithDemo: (role: UserRole, specificAccountIndex?: number) => void;
  loginWithCredentials: (identifier: string, passwordOrOtp: string, role: UserRole, customUserData?: Partial<AuthUser>) => Promise<{ success: boolean; message?: string }>;
  loginCooperative: (
    identifier: string,
    passwordOrOtp: string,
    cooperativeId: string,
    staffRole: CooperativeStaffRole
  ) => Promise<{ success: boolean; message?: string }>;
  loginOrganization: (
    identifier: string,
    passwordOrOtp: string,
    orgRole: 'ORGANIZATION_ADMIN' | 'ORGANIZATION_STAFF'
  ) => Promise<{ success: boolean; message?: string }>;
  signup: (userData: Omit<AuthUser, 'id' | 'joinedDate'>) => Promise<{ success: boolean; message?: string }>;
  signupOrganization: (orgData: {
    name: string;
    registeredName: string;
    type: OrganizationType;
    registrationNumber?: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    serviceArea: string;
    description: string;
    supportingDocumentName?: string;
  }) => Promise<{ success: boolean; message?: string; orgUser?: AuthUser }>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  updateUserProfile: (updatedFields: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'sahakari_seva_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return null;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // Storage error fallback
    }
  }, [user]);

  const updateUserProfile = (updatedFields: Partial<AuthUser>) => {
    setUser(prev => prev ? { ...prev, ...updatedFields } : null);
  };

  const loginWithDemo = (role: UserRole, specificAccountIndex?: number) => {
    if (typeof specificAccountIndex === 'number' && DEMO_ACCOUNTS[specificAccountIndex]) {
      setUser({ ...DEMO_ACCOUNTS[specificAccountIndex].user });
      return;
    }
    const demo = DEMO_ACCOUNTS.find(d => d.role === role) || DEMO_ACCOUNTS[0];
    setUser({ ...demo.user });
  };

  const loginCooperative = async (
    identifier: string,
    passwordOrOtp: string,
    cooperativeId: string,
    staffRole: CooperativeStaffRole
  ): Promise<{ success: boolean; message?: string }> => {
    await new Promise(r => setTimeout(r, 400));
    if (!identifier || identifier.trim().length < 3) {
      return { success: false, message: 'Please provide a valid official email or Cooperative Staff ID' };
    }
    if (!passwordOrOtp || passwordOrOtp.trim().length < 4) {
      return { success: false, message: 'Please provide your security access PIN or OTP' };
    }
    if (staffRole !== 'COOPERATIVE_ADMIN' && staffRole !== 'COOPERATIVE_STAFF') {
      return { success: false, message: 'Unauthorized access: Invalid cooperative role classification.' };
    }

    const matchedAccount = DEMO_ACCOUNTS.find(d => d.user.staffRole === staffRole) || DEMO_ACCOUNTS[2];
    const userCoop: AuthUser = {
      ...matchedAccount.user,
      email: identifier.includes('@') ? identifier : `${identifier.toLowerCase()}@partnerplus.org`,
      role: staffRole === 'COOPERATIVE_ADMIN' ? 'cooperative_admin' : 'cooperative_staff',
      staffRole,
      cooperativeId: cooperativeId || matchedAccount.user.cooperativeId,
      cooperativeMembershipVerified: true,
      permissions: staffRole === 'COOPERATIVE_ADMIN'
        ? ['ALL', 'OPERATIONS', 'FINANCE', 'VERIFICATION', 'SETTINGS', 'ORGANIZATIONS']
        : ['OPERATIONS', 'JOBS', 'WORKERS', 'VERIFICATION', 'COMPLAINTS']
    };
    setUser(userCoop);
    return { success: true };
  };

  const loginOrganization = async (
    identifier: string,
    passwordOrOtp: string,
    orgRole: 'ORGANIZATION_ADMIN' | 'ORGANIZATION_STAFF' = 'ORGANIZATION_ADMIN'
  ): Promise<{ success: boolean; message?: string }> => {
    await new Promise(r => setTimeout(r, 400));
    if (!identifier || identifier.trim().length < 3) {
      return { success: false, message: 'Please provide a valid official company email' };
    }
    if (!passwordOrOtp || passwordOrOtp.trim().length < 4) {
      return { success: false, message: 'Please enter your password or access code' };
    }

    const demoOrg = DEMO_ACCOUNTS.find(d => d.user.organizationRole === orgRole) || DEMO_ACCOUNTS[4];
    const orgUser: AuthUser = {
      ...demoOrg.user,
      email: identifier.includes('@') ? identifier : `${identifier.toLowerCase()}@ltfacilities.co.in`,
      role: orgRole === 'ORGANIZATION_ADMIN' ? 'organization_admin' : 'organization_staff',
      organizationRole: orgRole
    };
    setUser(orgUser);
    return { success: true };
  };

  const loginWithCredentials = async (
    identifier: string,
    _passwordOrOtp: string,
    role: UserRole,
    customUserData?: Partial<AuthUser>
  ): Promise<{ success: boolean; message?: string }> => {
    await new Promise(r => setTimeout(r, 400));

    if (!identifier || identifier.trim().length < 3) {
      return { success: false, message: 'Please provide a valid email or 10-digit mobile number' };
    }

    // Role specific login
    if (role === 'cooperative_admin' || role === 'cooperative_staff') {
      return loginCooperative(identifier, _passwordOrOtp, 'coop-1', role === 'cooperative_admin' ? 'COOPERATIVE_ADMIN' : 'COOPERATIVE_STAFF');
    }

    if (role === 'organization_admin' || role === 'organization_staff') {
      return loginOrganization(identifier, _passwordOrOtp, role === 'organization_admin' ? 'ORGANIZATION_ADMIN' : 'ORGANIZATION_STAFF');
    }

    const matchedDemo = DEMO_ACCOUNTS.find(d => d.role === role) || DEMO_ACCOUNTS[0];
    const customUser: AuthUser = {
      ...matchedDemo.user,
      id: customUserData?.id || `usr-${Date.now()}`,
      name: customUserData?.name || (identifier.includes('@') ? identifier.split('@')[0] : 'Registered User'),
      email: customUserData?.email || (identifier.includes('@') ? identifier : `${identifier.replace(/\D/g, '')}@partnerplus.org`),
      phone: customUserData?.phone || identifier,
      role: role,
      ...customUserData
    };
    setUser(customUser);
    try {
      localStorage.setItem('partnerplus_user_name', customUser.name);
    } catch {}
    return { success: true };
  };

  const signup = async (userData: Omit<AuthUser, 'id' | 'joinedDate'>): Promise<{ success: boolean; message?: string }> => {
    await new Promise(r => setTimeout(r, 450));
    const newUser: AuthUser = {
      ...userData,
      id: `user-${Date.now()}`,
      joinedDate: 'Today'
    };
    setUser(newUser);
    return { success: true };
  };

  const signupOrganization = async (orgData: {
    name: string;
    registeredName: string;
    type: OrganizationType;
    registrationNumber?: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    serviceArea: string;
    description: string;
    supportingDocumentName?: string;
  }): Promise<{ success: boolean; message?: string; orgUser?: AuthUser }> => {
    await new Promise(r => setTimeout(r, 450));
    const orgId = `org-${Date.now()}`;
    const newOrgUser: AuthUser = {
      id: `user-org-${Date.now()}`,
      name: orgData.contactPerson,
      email: orgData.email,
      phone: orgData.phone,
      role: 'organization_admin',
      organizationRole: 'ORGANIZATION_ADMIN',
      organizationId: orgId,
      organizationName: orgData.name,
      organizationType: orgData.type,
      organizationVerificationStatus: 'PENDING',
      permissions: ['PROJECTS', 'HIRING', 'STAFF'],
      address: orgData.address,
      city: orgData.city,
      joinedDate: 'Today'
    };
    setUser(newOrgUser);
    return { success: true, orgUser: newOrgUser };
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          role: newRole
        };
      });
    } else {
      loginWithDemo(newRole);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithDemo,
        loginWithCredentials,
        loginCooperative,
        loginOrganization,
        signup,
        signupOrganization,
        logout,
        switchRole,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

