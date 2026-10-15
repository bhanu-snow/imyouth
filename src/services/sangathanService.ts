import { requireSupabase } from './supabaseClient';

export interface SangathanDistrict {
  id: string;
  code: string;
  nameEn: string;
  nameHi: string;
  headquarters: string | null;
  inChargeName: string | null;
  inChargePhone: string | null;
  activeCadreCount: number;
  status: 'active' | 'growing' | 'forming';
  updatedAt: string | null;
}

export interface SangathanTenure {
  id: string;
  districtId: string;
  leaderNameEn: string;
  leaderNameHi: string | null;
  postTitleEn: string;
  postTitleHi: string | null;
  tenureStart: string;
  tenureEnd: string | null;
  status: 'current' | 'past' | 'acting';
  contactPhone: string | null;
  email: string | null;
}

export const sangathanService = {
  async districts(): Promise<SangathanDistrict[]> {
    const client = requireSupabase();
    const { data: districts, error } = await client.from('sangathan_public_districts')
      .select('district_id,district_code,name_en,name_hi,headquarters,in_charge_name,active_cadre_count,status,updated_at')
      .order('name_en');
    if (error) throw new Error(`Could not load district directory: ${error.message}`);
    return (districts ?? []).map((row) => ({
        id: row.district_id,
        code: row.district_code,
        nameEn: row.name_en,
        nameHi: row.name_hi ?? row.name_en,
        headquarters: row.headquarters ?? null,
        inChargeName: row.in_charge_name ?? null,
        inChargePhone: null,
        activeCadreCount: row.active_cadre_count ?? 0,
        status: row.status ?? 'forming',
        updatedAt: row.updated_at ?? null,
      }));
  },

  async leadership(districtId: string): Promise<SangathanTenure[]> {
    const client = requireSupabase();
    const { data, error } = await client.from('sangathan_public_leadership')
      .select('id,district_id,leader_name_en,leader_name_hi,post_title_en,post_title_hi,tenure_start,tenure_end,status')
      .eq('district_id', districtId)
      .order('tenure_start', { ascending: false });
    if (error) throw new Error(`Could not load leadership history: ${error.message}`);
    return (data ?? []).map((row) => ({
      id: row.id,
      districtId: row.district_id,
      leaderNameEn: row.leader_name_en,
      leaderNameHi: row.leader_name_hi,
      postTitleEn: row.post_title_en,
      postTitleHi: row.post_title_hi,
      tenureStart: row.tenure_start,
      tenureEnd: row.tenure_end,
      status: row.status,
      contactPhone: null,
      email: null,
    }));
  },

  async appoint(input: {
    districtId: string;
    leaderNameEn: string;
    leaderNameHi?: string;
    postTitleEn: string;
    postTitleHi?: string;
    tenureStart: string;
    status: 'current' | 'acting';
    contactPhone?: string;
    email?: string;
  }): Promise<void> {
    const client = requireSupabase();
    const { data: authData, error: authError } = await client.auth.getUser();
    if (authError || !authData.user) throw new Error('Sign in again before updating organisation records.');
    const { error } = await client.from('leadership_tenures').insert({
      district_id: input.districtId,
      leader_user_id: null,
      leader_name_en: input.leaderNameEn.trim(),
      leader_name_hi: input.leaderNameHi?.trim() || null,
      post_title_en: input.postTitleEn.trim(),
      post_title_hi: input.postTitleHi?.trim() || null,
      tenure_start: input.tenureStart,
      tenure_end: null,
      status: input.status,
      contact_phone: input.contactPhone?.trim() || null,
      email: input.email?.trim() || null,
      created_by: authData.user.id,
    });
    if (error) throw new Error(`Could not save appointment: ${error.message}`);
  },

  async removeTenure(id: string): Promise<void> {
    const client = requireSupabase();
    const { error } = await client.from('leadership_tenures').delete().eq('id', id);
    if (error) throw new Error(`Could not remove leadership record: ${error.message}`);
  },
};
