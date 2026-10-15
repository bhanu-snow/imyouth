import type { AuthUser, UserRole } from '../types';
import { requireSupabase } from './supabaseClient';

const validRoles = new Set<UserRole>([
  'superadmin','state_president','content_manager','press_release',
  'state_admin','district_incharge','cadre_volunteer','public',
]);

export const authService = {
  async signIn(email: string, password: string): Promise<AuthUser> {
    const client = requireSupabase();
    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (authError || !authData.user) throw new Error(authError?.message || 'Sign-in failed.');

    const userId = authData.user.id;
    const { data: profile, error: profileError } = await client
      .from('user_profiles')
      .select('user_id,full_name,phone,designation_id,district_id,allow_login,is_active,created_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (profileError || !profile) {
      await client.auth.signOut();
      throw new Error(profileError?.message || 'This account has no assigned application profile. Contact the administrator.');
    }
    if (!profile.is_active || !profile.allow_login) {
      await client.auth.signOut();
      throw new Error('Account access has not been enabled by an administrator.');
    }

    const { data: assignments, error: rolesError } = await client
      .from('user_roles')
      .select('role:roles(code,name_en)')
      .eq('user_id', userId);
    if (rolesError) {
      await client.auth.signOut();
      throw new Error(rolesError.message);
    }

    const roleRows = (assignments ?? []) as unknown as Array<{ role: { code: string; name_en: string } | null }>;
    const roleCode = roleRows.map((item) => item.role?.code).find((code): code is string => Boolean(code && validRoles.has(code as UserRole)));
    if (!roleCode) {
      await client.auth.signOut();
      throw new Error('No active role is assigned to this account. Contact the administrator.');
    }

    let districtName: string | undefined;
    if (profile.district_id) {
      const { data } = await client.from('districts').select('name_en').eq('id', profile.district_id).maybeSingle();
      districtName = data?.name_en;
    }

    let designation = 'Authorized User';
    if (profile.designation_id) {
      const { data } = await client.from('post_designations').select('title_en').eq('id', profile.designation_id).maybeSingle();
      if (data?.title_en) designation = data.title_en;
    }

    return {
      id: userId,
      name: profile.full_name,
      phone: profile.phone || '',
      email: authData.user.email || email.trim().toLowerCase(),
      role: roleCode as UserRole,
      district: districtName,
      designation,
      createdAt: profile.created_at,
    };
  },


  async restoreSession(): Promise<AuthUser | null> {
    const client = requireSupabase();
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError) throw new Error(sessionError.message);
    const sessionUser = sessionData.session?.user;
    if (!sessionUser) return null;

    const { data: profile, error: profileError } = await client
      .from('user_profiles')
      .select('user_id,full_name,phone,designation_id,district_id,allow_login,is_active,created_at')
      .eq('user_id', sessionUser.id)
      .maybeSingle();
    if (profileError || !profile || !profile.is_active || !profile.allow_login) {
      await client.auth.signOut();
      return null;
    }

    const { data: assignments, error: rolesError } = await client
      .from('user_roles').select('role:roles(code,name_en)').eq('user_id', sessionUser.id);
    if (rolesError) throw new Error(rolesError.message);
    const roleRows = (assignments ?? []) as unknown as Array<{ role: { code: string; name_en: string } | null }>;
    const roleCode = roleRows.map((item) => item.role?.code).find((code): code is string => Boolean(code && validRoles.has(code as UserRole)));
    if (!roleCode) {
      await client.auth.signOut();
      return null;
    }

    let districtName: string | undefined;
    if (profile.district_id) {
      const { data } = await client.from('districts').select('name_en').eq('id', profile.district_id).maybeSingle();
      districtName = data?.name_en;
    }
    let designation = 'Authorized User';
    if (profile.designation_id) {
      const { data } = await client.from('post_designations').select('title_en').eq('id', profile.designation_id).maybeSingle();
      if (data?.title_en) designation = data.title_en;
    }
    return {
      id: sessionUser.id,
      name: profile.full_name,
      phone: profile.phone || '',
      email: sessionUser.email || '',
      role: roleCode as UserRole,
      district: districtName,
      designation,
      createdAt: profile.created_at,
    };
  },

  async signOut(): Promise<void> {
    const { error } = await requireSupabase().auth.signOut();
    if (error) throw new Error(error.message);
  },
};
