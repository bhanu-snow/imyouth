import type { AuthUser, Member, MemberStatus, YouthWing } from '../types';
import { requireSupabase } from './supabaseClient';

type MemberRow = {
  id: string; cadre_id: string | null; auth_user_id: string | null; full_name: string; full_name_hi: string | null;
  phone: string; email: string | null; avatar_url: string | null; state_id: string;
  district_id: string; sub_district_id: string | null; wing_id: string | null;
  designation_text: string | null; designation_hi: string | null; community_background: string | null;
  blood_group: string | null; education: string | null; bio: string | null;
  referred_by_cadre_id: string | null;
  status: MemberStatus; verified: boolean; approved_by: string | null; approved_at: string | null; joined_at: string;
};

type LookupRow = { id: string; name_en: string; name_hi?: string | null; code?: string };

const MEMBER_COLUMNS = 'id,cadre_id,auth_user_id,full_name,full_name_hi,phone,email,avatar_url,state_id,district_id,sub_district_id,wing_id,designation_text,designation_hi,community_background,blood_group,education,bio,referred_by_cadre_id,status,verified,approved_by,approved_at,joined_at';

async function mapRows(rows: MemberRow[]): Promise<Member[]> {
  if (!rows.length) return [];
  const client = requireSupabase();
  const [districtResult, subDistrictResult, stateResult, wingResult, approverResult] = await Promise.all([
    client.from('districts').select('id,name_en').in('id', [...new Set(rows.map(r => r.district_id))]),
    client.from('sub_districts').select('id,name_en').in('id', [...new Set(rows.map(r => r.sub_district_id).filter((v): v is string => Boolean(v)))]),
    client.from('states').select('id,name_en').in('id', [...new Set(rows.map(r => r.state_id))]),
    client.from('org_wings').select('id,code').in('id', [...new Set(rows.map(r => r.wing_id).filter((v): v is string => Boolean(v)))]),
    client.from('user_profiles').select('user_id,full_name').in('user_id', [...new Set(rows.map(r => r.approved_by).filter((v): v is string => Boolean(v)))]),
  ]);
  for (const result of [districtResult, subDistrictResult, stateResult, wingResult, approverResult]) {
    if (result.error) throw new Error(`Could not resolve member reference data: ${result.error.message}`);
  }
  const districts = new Map((districtResult.data ?? []).map((x: LookupRow) => [x.id, x.name_en]));
  const subDistricts = new Map((subDistrictResult.data ?? []).map((x: LookupRow) => [x.id, x.name_en]));
  const states = new Map((stateResult.data ?? []).map((x: LookupRow) => [x.id, x.name_en]));
  const wings = new Map((wingResult.data ?? []).map((x: { id: string; code: string }) => [x.id, x.code]));
  const approvers = new Map((approverResult.data ?? []).map((x: { user_id: string; full_name: string }) => [x.user_id, x.full_name]));
  return rows.map(row => ({
    id: row.cadre_id ?? row.id,
    recordId: row.id,
    fullName: row.full_name,
    fullNameHi: row.full_name_hi ?? undefined,
    phone: row.phone,
    email: row.email ?? '',
    avatarUrl: row.avatar_url ?? '',
    state: states.get(row.state_id) ?? '',
    stateId: row.state_id,
    district: districts.get(row.district_id) ?? '',
    districtId: row.district_id,
    subDistrict: row.sub_district_id ? subDistricts.get(row.sub_district_id) ?? '' : '',
    subDistrictId: row.sub_district_id ?? undefined,
    wing: (wings.get(row.wing_id ?? '') ?? 'general') as YouthWing,
    designation: row.designation_text ?? 'Cadre',
    designationHi: row.designation_hi ?? '',
    joinedAt: row.joined_at,
    verified: row.verified,
    status: row.status,
    communityBackground: row.community_background ?? undefined,
    referredByCadreId: row.referred_by_cadre_id ?? undefined,
    approvedBy: row.approved_by ? approvers.get(row.approved_by) ?? 'Authorized committee' : undefined,
    approvedAt: row.approved_at ?? undefined,
    bloodGroup: row.blood_group ?? undefined,
    education: row.education ?? undefined,
    bio: row.bio ?? undefined,
  }));
}

export const memberService = {
  async listForAuthorizedUser(): Promise<Member[]> {
    const client = requireSupabase();
    const { data, error } = await client.from('members').select(MEMBER_COLUMNS).order('created_at', { ascending: false });
    if (error) throw new Error(`Could not load member applications: ${error.message}`);
    return mapRows((data ?? []) as unknown as MemberRow[]);
  },

  async submitApplication(input: {
    fullName: string; fullNameHi?: string; phone: string; email?: string;
    stateId: string; districtId: string; subDistrictId?: string; stateName?: string; districtName?: string; subDistrictName?: string; wingCode: string;
    designation: string; designationHi?: string; communityBackground?: string;
    bloodGroup?: string; education?: string;
    referredByCadreId?: string;
  }): Promise<Member> {
    const client = requireSupabase();
    if (input.wingCode !== 'myl_cadre') {
      throw new Error('New membership requests must be for the Muslim Youth League.');
    }
    const [{ data: wing, error: wingError }, { data: state, error: stateError }] = await Promise.all([
      client.from('org_wings').select('id').eq('code', input.wingCode).eq('is_active', true).maybeSingle(),
      client.from('states').select('id,name_en').eq('id', input.stateId).eq('is_active', true).maybeSingle(),
    ]);
    if (wingError) throw new Error(wingError.message);
    if (stateError) throw new Error(stateError.message);
    if (!wing || !state) throw new Error('Select a valid active state and organization wing.');
    const id = `REQ-UP-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const { error } = await client.from('members').insert({
      id, cadre_id: null, full_name: input.fullName.trim(), full_name_hi: input.fullNameHi?.trim() || null,
      phone: input.phone.trim(), email: input.email?.trim() || null, state_id: input.stateId,
      district_id: input.districtId, sub_district_id: input.subDistrictId || null, wing_id: wing.id,
      designation_text: 'Primary Member',
      designation_hi: 'प्राथमिक सदस्य',
      community_background: input.communityBackground || null,
      referred_by_cadre_id: input.referredByCadreId?.trim().toUpperCase() || null,
      blood_group: input.bloodGroup || null, education: input.education || null,
      status: 'pending', verified: false, approved_by: null, approved_at: null,
    });
    if (error) throw new Error(`Could not submit application: ${error.message}`);
    // Public applicants cannot read member rows under RLS. Return only the acknowledgement
    // assembled from submitted values; do not weaken row-level security for insert-returning.
    return {
      id, recordId: id, fullName: input.fullName.trim(), fullNameHi: input.fullNameHi?.trim() || undefined,
      phone: input.phone.trim(), email: input.email?.trim() || '', avatarUrl: '',
      state: input.stateName ?? 'Uttar Pradesh', district: input.districtName ?? '', subDistrict: input.subDistrictName ?? '', wing: input.wingCode as YouthWing,
      designation: 'Primary Member',
      designationHi: 'प्राथमिक सदस्य',
      stateId: input.stateId,
      districtId: input.districtId,
      subDistrictId: input.subDistrictId || undefined, joinedAt: new Date().toISOString().slice(0, 10),
      verified: false, status: 'pending', communityBackground: input.communityBackground || undefined,
      referredByCadreId: input.referredByCadreId?.trim().toUpperCase() || undefined,
      bloodGroup: input.bloodGroup || undefined, education: input.education || undefined,
    };
  },

  async approve(requestId: string, _approver: AuthUser): Promise<Member> {
    const client = requireSupabase();
    const officialId = `MYL-UP-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const { data: authData } = await client.auth.getUser();
    if (!authData.user) throw new Error('Sign in again before approving an application.');
    const { data, error } = await client.rpc('approve_member_request', {
      p_request_id: requestId,
      p_cadre_id: officialId,
    });
    if (error) throw new Error(`Could not approve application: ${error.message}`);
    if (!data) throw new Error('Could not approve application: no approved member was returned.');
    return (await mapRows([data as unknown as MemberRow]))[0];
  },

  async reject(requestId: string): Promise<void> {
    const client = requireSupabase();
    const { error } = await client.rpc('reject_member_request', { p_request_id: requestId });
    if (error) throw new Error(`Could not reject application: ${error.message}`);
  },

  async verifyPublic(cadreId: string): Promise<Member | null> {
    const client = requireSupabase();
    const { data, error } = await client.rpc('verify_public_cadre', { p_cadre_id: cadreId.trim() });
    if (error) throw new Error(`Could not verify cadre ID: ${error.message}`);
    const row = (data ?? [])[0] as {
      id: string; full_name: string; full_name_hi: string | null; designation_text: string | null;
      designation_hi: string | null; district_name: string; sub_district_name: string | null;
      wing_code: string | null; status: MemberStatus; verified: boolean; approved_at: string | null; joined_at: string;
    } | undefined;
    if (!row) return null;
    return {
      id: row.id, recordId: row.id, fullName: row.full_name, fullNameHi: row.full_name_hi ?? undefined,
      phone: '', email: '', avatarUrl: '', state: 'Uttar Pradesh', district: row.district_name,
      subDistrict: row.sub_district_name ?? '', wing: (row.wing_code ?? 'general') as YouthWing,
      designation: row.designation_text ?? 'Cadre', designationHi: row.designation_hi ?? '',
      joinedAt: row.joined_at, verified: row.verified, status: row.status,
      approvedAt: row.approved_at ?? undefined,
    };
  },
};
