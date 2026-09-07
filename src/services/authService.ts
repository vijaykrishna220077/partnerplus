import { supabase } from './supabaseClient';

export function generateHighEntropyPassword(length: number = 20): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => chars[byte % chars.length]).join('');
}

export function ensureUUID(id?: string | null): string {
  if (id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return id;
  }
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

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
      const password = params.password || generateHighEntropyPassword(20);

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
          console.warn('[AuthService] Supabase Auth signUp notice:', authError.message);
          if (authError.message.includes('already registered') || authError.message.includes('User already exists')) {
            const { data: signInData } = await supabase.auth.signInWithPassword({ email, password });
            if (signInData?.user) {
              authUser = signInData.user;
              authUserId = signInData.user.id;
            } else {
              return {
                success: false,
                message: 'This email is already registered. Please log in.'
              };
            }
          } else if (authError.message.includes('rate limit')) {
            return {
              success: false,
              message: 'Supabase Email Rate Limit Exceeded (4 emails/hr). Please turn OFF "Confirm Email" in your Supabase Dashboard under Authentication -> Providers -> Email.'
            };
          } else {
            console.warn('[AuthService] Proceeding with customer profile registration:', authError.message);
          }
        } else {
          authUser = authData?.user || null;
          authUserId = authData?.user?.id || null;
        }
      }

      const effectiveAuthId = ensureUUID(authUserId);

      // 2. Insert into public.users table in Supabase
      let publicUser: any = null;
      if (supabase) {
        const { data: existingUsers } = await supabase
          .from('users')
          .select('*')
          .eq('email', email);

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
            .maybeSingle();

          if (userInsErr) {
            console.warn('[AuthService] Notice on public.users insertion (RLS check):', userInsErr.message);
          } else {
            publicUser = insertedUser;
          }
        }
      }

      const publicUserId = ensureUUID(publicUser?.id);

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
            .maybeSingle();

          if (profInsErr) {
            console.warn('[AuthService] Notice on public.customer_profiles insertion:', profInsErr.message);
          } else {
            customerProfile = insertedProfile;
          }
        }
      }

      return {
        success: true,
        authUser,
        dbUser: publicUser || {
          id: publicUserId,
          auth_user_id: effectiveAuthId,
          email,
          role: 'CUSTOMER'
        },
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
    authUserId?: string;
    dbUser?: any;
    workerProfile?: any;
    message?: string;
  }> {
    try {
      const email = params.email?.trim().toLowerCase() || `${params.phone.replace(/\D/g, '')}@partnerplus.org`;
      const password = params.password || generateHighEntropyPassword(20);

      // 1. Supabase Auth Sign Up
      let authUserId: string | null = null;
      let authUser: any = null;
      let authNotice: string | null = null;

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
          console.warn('[AuthService] Worker Auth signUp notice:', authError.message);
          if (authError.message.includes('already registered') || authError.message.includes('User already exists')) {
            const { data: signInData } = await supabase.auth.signInWithPassword({ email, password });
            if (signInData?.user) {
              authUser = signInData.user;
              authUserId = signInData.user.id;
            }
          } else if (authError.message.includes('rate limit')) {
            return {
              success: false,
              message: 'Supabase Email Rate Limit Exceeded (4 emails/hr). Please turn OFF "Confirm Email" in your Supabase Dashboard under Authentication -> Providers -> Email.'
            };
          }
        } else {
          authUser = authData?.user || null;
          authUserId = authData?.user?.id || null;
        }
      }

      const effectiveAuthId = ensureUUID(authUserId);

      // 2. Insert into public.users table in Supabase
      let publicUser: any = null;
      if (supabase) {
        const { data: existingUsers } = await supabase
          .from('users')
          .select('*')
          .eq('email', email);

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
            .maybeSingle();

          if (userInsErr) {
            console.warn('[AuthService] Notice inserting worker into public.users (RLS policy check):', userInsErr.message);
          } else {
            publicUser = insertedUser;
          }
        }
      }

      const publicUserId = ensureUUID(publicUser?.id);
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
            .maybeSingle();

          if (profInsErr) {
            console.warn('[AuthService] Notice inserting into public.worker_profiles:', profInsErr.message);
          } else {
            workerProfile = insertedProfile;
          }
        }
      }

      return {
        success: true,
        authUser,
        authUserId: effectiveAuthId,
        dbUser: publicUser || {
          id: publicUserId,
          auth_user_id: effectiveAuthId,
          email,
          role: 'WORKER'
        },
        workerProfile: workerProfile || {
          id: `wrk-${Date.now().toString().slice(-6)}`,
          user_id: publicUserId,
          full_name: params.fullName,
          phone: params.phone
        },
        message: authNotice || undefined
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
      const password = params.password || generateHighEntropyPassword(20);

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
          console.warn('[AuthService] Org Auth signUp notice:', authError.message);
          authUser = authData?.user || null;
          authUserId = authData?.user?.id || null;
        } else {
          authUser = authData?.user || null;
          authUserId = authData?.user?.id || null;
        }
      }

      const effectiveAuthId = ensureUUID(authUserId);

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
          .maybeSingle();

        if (!userInsErr) {
          publicUser = insertedUser;
        }
      }

      const publicUserId = ensureUUID(publicUser?.id);

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
          .maybeSingle();

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
        }
      }

      return {
        success: true,
        authUser,
        dbUser: publicUser || {
          id: publicUserId,
          auth_user_id: effectiveAuthId,
          email,
          role: 'ORGANIZATION_ADMIN'
        },
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
      const password = params.password || generateHighEntropyPassword(20);

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
          console.warn('[AuthService] Coop Auth signUp notice:', authError.message);
          authUser = authData?.user || null;
          authUserId = authData?.user?.id || null;
        } else {
          authUser = authData?.user || null;
          authUserId = authData?.user?.id || null;
        }
      }

      const effectiveAuthId = ensureUUID(authUserId);

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
          .maybeSingle();

        if (!userInsErr) {
          publicUser = insertedUser;
        }
      }

      return {
        success: true,
        authUser,
        dbUser: publicUser || {
          id: ensureUUID(publicUser?.id),
          auth_user_id: effectiveAuthId,
          email,
          role: params.requestedRole
        },
        memberRecord: {
          id: `coop-mem-${Date.now()}`,
          cooperative_id: params.cooperativeId || 'coop-1',
          user_id: ensureUUID(publicUser?.id),
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
