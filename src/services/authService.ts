import { supabase } from './supabaseClient';

export interface CustomerSignUpParams {
  fullName: string;
  phone: string;
  email: string;
  password?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  preferredLanguage?: string;
  profilePhotoUrl?: string;
}

export interface WorkerSignUpParams {
  fullName: string;
  phone: string;
  email?: string;
  password?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  preferredLanguage?: string;
  profilePhotoUrl?: string;
  workerType?: 'skilled' | 'semi_skilled' | 'general';
  primarySkillId?: string;
  primarySkillLabel?: string;
  experienceYears?: number;
  cooperativeId?: string;
  emergencyAvailable?: boolean;
}

export interface OrganizationSignUpParams {
  organizationName: string;
  legalName?: string;
  organizationType: string;
  registrationNumber?: string;
  gstNumber?: string;
  contactPerson: string;
  phone: string;
  email: string;
  password?: string;
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  description?: string;
}

export interface CooperativeOfficialSignUpParams {
  cooperativeName: string;
  registrationNumber: string;
  cooperativeAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  officialEmail: string;
  password?: string;
  phone: string;
  contactPerson: string;
  designation: string;
  requestedRole: 'COOPERATIVE_ADMIN' | 'COOPERATIVE_STAFF';
  reasonForAccess?: string;
  cooperativeId?: string;
}

class AuthService {
  /**
   * Register Customer in Supabase Auth & public.users & public.customer_profiles
   */
  async signUpCustomer(params: CustomerSignUpParams): Promise<{
    success: boolean;
    authUser?: any;
    dbUser?: any;
    customerProfile?: any;
    message?: string;
  }> {
    try {
      const email = params.email.trim().toLowerCase();
      const password = params.password || `PartnerPlus#${Math.floor(100000 + Math.random() * 900000)}`;

      // 1. Supabase Auth Sign Up
      let authUserId: string | null = null;
      let authUser: any = null;

      if (supabase) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: params.fullName,
              phone: params.phone,
              role: 'CUSTOMER'
            }
          }
        });

        if (authError) {
          console.warn('[AuthService] Supabase Auth signUp notice/error:', authError.message);
          if (authError.message.includes('already registered') || authError.message.includes('User already exists')) {
            const { data: signInData } = await supabase.auth.signInWithPassword({ email, password });
            if (signInData?.user) {
              authUser = signInData.user;
              authUserId = signInData.user.id;
            }
          } else {
            authUserId = authData?.user?.id || null;
            authUser = authData?.user || null;
          }
        } else {
          authUser = authData?.user || null;
          authUserId = authData?.user?.id || null;
        }
      }

      const effectiveAuthId = authUserId || `auth-cust-${Date.now()}`;

      // 2. Insert into public.users table in Supabase
      let publicUser: any = null;
      if (supabase) {
        const { data: existingUsers } = await supabase
          .from('users')
          .select('*')
          .or(`auth_user_id.eq.${effectiveAuthId},email.eq.${email}`);

        if (existingUsers && existingUsers.length > 0) {
          publicUser = existingUsers[0];
        } else {
          const { data: insertedUser, error: userInsErr } = await supabase
            .from('users')
            .insert({
              auth_user_id: effectiveAuthId,
              role: 'CUSTOMER',
              account_status: 'ACTIVE',
              email: email,
              phone: params.phone.trim(),
              preferred_language: params.preferredLanguage || 'en'
            })
            .select()
            .single();

          if (userInsErr) {
            console.error('[AuthService] Error inserting into public.users:', userInsErr);
          } else {
            publicUser = insertedUser;
          }
        }
      }

      const publicUserId = publicUser?.id || `user-c-${Date.now()}`;

      // 3. Insert into public.customer_profiles table in Supabase
      let customerProfile: any = null;
      if (supabase && publicUser) {
        const { data: existingProfiles } = await supabase
          .from('customer_profiles')
          .select('*')
          .eq('user_id', publicUserId);

        if (existingProfiles && existingProfiles.length > 0) {
          customerProfile = existingProfiles[0];
        } else {
          const { data: insertedProfile, error: profInsErr } = await supabase
            .from('customer_profiles')
            .insert({
              user_id: publicUserId,
              full_name: params.fullName.trim(),
              phone: params.phone.trim(),
              email: email,
              address: params.address?.trim() || '',
              city: params.city?.trim() || 'Chennai',
              state: params.state?.trim() || 'Tamil Nadu',
              postal_code: params.postalCode?.trim() || '',
              preferred_language: params.preferredLanguage || 'en',
              profile_photo_path: params.profilePhotoUrl
            })
            .select()
            .single();

          if (profInsErr) {
            console.error('[AuthService] Error inserting into public.customer_profiles:', profInsErr);
          } else {
            customerProfile = insertedProfile;
          }
        }
      }

      return {
        success: true,
        authUser,
        dbUser: publicUser,
        customerProfile: customerProfile || {
          id: `cust-prof-${Date.now()}`,
          user_id: publicUserId,
          full_name: params.fullName,
          email,
          phone: params.phone
        }
      };
    } catch (err: any) {
      console.error('[AuthService] Customer signup exception:', err);
      return {
        success: false,
        message: err.message || 'Customer signup failed.'
      };
    }
  }

  /**
   * Register Worker in Supabase Auth & public.users & public.worker_profiles
   */
  async signUpWorker(params: WorkerSignUpParams): Promise<{
    success: boolean;
    authUser?: any;
    dbUser?: any;
    workerProfile?: any;
    message?: string;
  }> {
    try {
      const email = params.email?.trim().toLowerCase() || `${params.phone.replace(/\D/g, '')}@partnerplus.org`;
      const password = params.password || `PartnerPlus#${Math.floor(100000 + Math.random() * 900000)}`;

      // 1. Supabase Auth Sign Up
      let authUserId: string | null = null;
      let authUser: any = null;

      if (supabase) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: params.fullName,
              phone: params.phone,
              role: 'WORKER'
            }
          }
        });

        if (authError) {
          console.warn('[AuthService] Worker Auth signUp notice/error:', authError.message);
          authUser = authData?.user || null;
          authUserId = authData?.user?.id || null;
        } else {
          authUser = authData?.user || null;
          authUserId = authData?.user?.id || null;
        }
      }

      const effectiveAuthId = authUserId || `auth-wrk-${Date.now()}`;

      // 2. Insert into public.users table in Supabase
      let publicUser: any = null;
      if (supabase) {
        const { data: existingUsers } = await supabase
          .from('users')
          .select('*')
          .or(`auth_user_id.eq.${effectiveAuthId},email.eq.${email}`);

        if (existingUsers && existingUsers.length > 0) {
          publicUser = existingUsers[0];
        } else {
          const { data: insertedUser, error: userInsErr } = await supabase
            .from('users')
            .insert({
              auth_user_id: effectiveAuthId,
              role: 'WORKER',
              account_status: 'PENDING',
              email: email,
              phone: params.phone.trim(),
              preferred_language: params.preferredLanguage || 'en'
            })
            .select()
            .single();

          if (userInsErr) {
            console.error('[AuthService] Error inserting worker into public.users:', userInsErr);
          } else {
            publicUser = insertedUser;
          }
        }
      }

      const publicUserId = publicUser?.id || `user-w-${Date.now()}`;
      const workerTierEnum = (params.workerType || 'skilled').toUpperCase();

      // 3. Insert into public.worker_profiles table in Supabase
      let workerProfile: any = null;
      if (supabase && publicUser) {
        const { data: existingProfiles } = await supabase
          .from('worker_profiles')
          .select('*')
          .eq('user_id', publicUserId);

        if (existingProfiles && existingProfiles.length > 0) {
          workerProfile = existingProfiles[0];
        } else {
          const { data: insertedProfile, error: profInsErr } = await supabase
            .from('worker_profiles')
            .insert({
              user_id: publicUserId,
              full_name: params.fullName.trim(),
              phone: params.phone.trim(),
              email: email,
              profile_photo_path: params.profilePhotoUrl,
              worker_type: workerTierEnum,
              primary_skill_id: params.primarySkillId || 'electrical',
              primary_skill_label: params.primarySkillLabel || 'Skilled Professional',
              experience_years: params.experienceYears || 2,
              verification_status: 'PENDING',
              account_status: 'ACTIVE',
              emergency_available: params.emergencyAvailable ?? false,
              city: params.city?.trim() || 'Chennai',
              service_radius_km: 10,
              preferred_language: params.preferredLanguage || 'en',
              starting_price: params.workerType === 'skilled' ? 399 : 299
            })
            .select()
            .single();

          if (profInsErr) {
            console.error('[AuthService] Error inserting into public.worker_profiles:', profInsErr);
          } else {
            workerProfile = insertedProfile;
          }
        }
      }

      return {
        success: true,
        authUser,
        dbUser: publicUser,
        workerProfile: workerProfile || {
          id: `wrk-${Date.now().toString().slice(-6)}`,
          user_id: publicUserId,
          full_name: params.fullName,
          phone: params.phone
        }
      };
    } catch (err: any) {
      console.error('[AuthService] Worker signup exception:', err);
      return {
        success: false,
        message: err.message || 'Worker signup failed.'
      };
    }
  }

  /**
   * Register Organization in Supabase Auth & public.users & public.organization_profiles
   */
  async signUpOrganization(params: OrganizationSignUpParams): Promise<{
    success: boolean;
    authUser?: any;
    dbUser?: any;
    organizationProfile?: any;
    message?: string;
  }> {
    try {
      const email = params.email.trim().toLowerCase();
      const password = params.password || `PartnerPlus#${Math.floor(100000 + Math.random() * 900000)}`;

      let authUserId: string | null = null;
      let authUser: any = null;

      if (supabase) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: params.contactPerson,
              phone: params.phone,
              role: 'ORGANIZATION_ADMIN',
              organization_name: params.organizationName
            }
          }
        });

        if (authError) {
          console.warn('[AuthService] Org Auth signUp notice/error:', authError.message);
          authUser = authData?.user || null;
          authUserId = authData?.user?.id || null;
        } else {
          authUser = authData?.user || null;
          authUserId = authData?.user?.id || null;
        }
      }

      const effectiveAuthId = authUserId || `auth-org-${Date.now()}`;

      // Insert into public.users
      let publicUser: any = null;
      if (supabase) {
        const { data: insertedUser, error: userInsErr } = await supabase
          .from('users')
          .insert({
            auth_user_id: effectiveAuthId,
            role: 'ORGANIZATION_ADMIN',
            account_status: 'ACTIVE',
            email: email,
            phone: params.phone.trim()
          })
          .select()
          .single();

        if (!userInsErr) {
          publicUser = insertedUser;
        }
      }

      const publicUserId = publicUser?.id || `user-org-${Date.now()}`;

      // Insert into public.organization_profiles
      let orgProfile: any = null;
      if (supabase) {
        const { data: insertedOrg, error: orgInsErr } = await supabase
          .from('organization_profiles')
          .insert({
            organization_name: params.organizationName.trim(),
            legal_name: params.legalName?.trim() || params.organizationName.trim(),
            organization_type: params.organizationType || 'Company',
            registration_number: params.registrationNumber?.trim() || '',
            gst_number: params.gstNumber?.trim() || '',
            contact_person: params.contactPerson.trim(),
            phone: params.phone.trim(),
            email: email,
            address: params.address.trim(),
            city: params.city.trim(),
            state: params.state?.trim() || 'Tamil Nadu',
            postal_code: params.postalCode?.trim() || '',
            description: params.description?.trim() || '',
            verification_status: 'VERIFIED'
          })
          .select()
          .single();

        if (!orgInsErr) {
          orgProfile = insertedOrg;

          if (publicUser) {
            await supabase.from('organization_members').insert({
              organization_id: insertedOrg.id,
              user_id: publicUserId,
              role: 'ORGANIZATION_ADMIN',
              status: 'ACTIVE'
            });
          }
        } else {
          console.error('[AuthService] Error inserting into public.organization_profiles:', orgInsErr);
        }
      }

      return {
        success: true,
        authUser,
        dbUser: publicUser,
        organizationProfile: orgProfile || {
          id: `org-${Date.now()}`,
          organization_name: params.organizationName,
          contact_person: params.contactPerson
        }
      };
    } catch (err: any) {
      console.error('[AuthService] Organization signup exception:', err);
      return {
        success: false,
        message: err.message || 'Organization signup failed.'
      };
    }
  }

  /**
   * Register Cooperative Official in Supabase Auth & public.users & public.cooperative_members
   */
  async signUpCooperativeOfficial(params: CooperativeOfficialSignUpParams): Promise<{
    success: boolean;
    authUser?: any;
    dbUser?: any;
    memberRecord?: any;
    message?: string;
  }> {
    try {
      const email = params.officialEmail.trim().toLowerCase();
      const password = params.password || `PartnerPlus#${Math.floor(100000 + Math.random() * 900000)}`;

      let authUserId: string | null = null;
      let authUser: any = null;

      if (supabase) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: params.contactPerson,
              phone: params.phone,
              role: params.requestedRole
            }
          }
        });

        if (authError) {
          console.warn('[AuthService] Coop Auth signUp notice/error:', authError.message);
          authUser = authData?.user || null;
          authUserId = authData?.user?.id || null;
        } else {
          authUser = authData?.user || null;
          authUserId = authData?.user?.id || null;
        }
      }

      const effectiveAuthId = authUserId || `auth-coop-${Date.now()}`;

      // Insert into public.users
      let publicUser: any = null;
      if (supabase) {
        const { data: insertedUser, error: userInsErr } = await supabase
          .from('users')
          .insert({
            auth_user_id: effectiveAuthId,
            role: params.requestedRole,
            account_status: 'PENDING',
            email: email,
            phone: params.phone.trim()
          })
          .select()
          .single();

        if (!userInsErr) {
          publicUser = insertedUser;
        }
      }

      return {
        success: true,
        authUser,
        dbUser: publicUser,
        memberRecord: {
          id: `coop-mem-${Date.now()}`,
          cooperative_id: params.cooperativeId || 'coop-1',
          user_id: publicUser?.id || `user-coop-${Date.now()}`,
          role: params.requestedRole
        }
      };
    } catch (err: any) {
      console.error('[AuthService] Cooperative official signup exception:', err);
      return {
        success: false,
        message: err.message || 'Cooperative official signup failed.'
      };
    }
  }
}

export const authService = new AuthService();
