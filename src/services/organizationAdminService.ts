import type { CommitteeScope, CommitteeStatus, OrgDistrict, OrgWing, OrganizationCommittee, PostDesignation } from '../types';
import { requireSupabase } from './supabaseClient';

export interface GeographyDistrictOption {
  id: string;
  nameEn: string;
  nameHi: string;
  zoneNameEn: string;
  zoneNameHi: string;
}

const slug = (value: string) => value.normalize('NFKD').toLowerCase()
  .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 48) || 'designation';

const dbError = (action: string, error: { message: string }) => {
  throw new Error(`${action}: ${error.message}`);
};

export const organizationAdminService = {
  async loadAll(): Promise<{ posts: PostDesignation[]; wings: OrgWing[]; districts: OrgDistrict[]; geography: GeographyDistrictOption[] }> {
    const client = requireSupabase();
    const [postResult, wingResult, geoResult, zoneResult, orgResult, subResult] = await Promise.all([
      client.from('post_designations').select('id,code,title_en,title_hi,level,wing_id,committee_id,description_en,description_hi,term_years,status,is_active,updated_at').order('sort_order').order('title_en'),
      client.from('org_wings').select('id,code,name_en,name_hi,color,focus_en,focus_hi,description_en,description_hi,head_leader_name,badge_label,is_active,updated_at').order('sort_order').order('name_en'),
      client.from('districts').select('id,code,name_en,name_hi,zone_id').eq('is_active', true).order('name_en'),
      client.from('zones').select('id,name_en,name_hi').eq('is_active', true),
      client.from('organizational_districts').select('district_id,headquarters,in_charge_name,in_charge_phone,active_cadre_count,status,updated_at'),
      client.from('sub_districts').select('id,district_id,code,name_en,name_hi,unit_type').eq('is_active', true).neq('code', 'district_hq').order('name_en'),
    ]);
    for (const [label, result] of [['Could not load designations', postResult], ['Could not load wings', wingResult], ['Could not load geography districts', geoResult], ['Could not load zones', zoneResult], ['Could not load organisational district records', orgResult], ['Could not load sub-districts', subResult]] as const) {
      if (result.error) dbError(label, result.error);
    }
    const zones = new Map((zoneResult.data ?? []).map((z) => [z.id, z]));
    const geography = (geoResult.data ?? []).map((d) => {
      const zone = zones.get(d.zone_id);
      return { id: d.id, nameEn: d.name_en, nameHi: d.name_hi ?? d.name_en, zoneNameEn: zone?.name_en ?? '', zoneNameHi: zone?.name_hi ?? '' };
    });
    const geoById = new Map(geography.map((d) => [d.id, d]));
    const orgById = new Map((orgResult.data ?? []).map((d) => [d.district_id, d]));
    const subByDistrict = new Map<string, string[]>();
    for (const unit of subResult.data ?? []) {
      const items = subByDistrict.get(unit.district_id) ?? [];
      items.push(unit.name_en);
      subByDistrict.set(unit.district_id, items);
    }
    const posts: PostDesignation[] = (postResult.data ?? []).map((row) => ({
      id: row.id, titleEn: row.title_en, titleHi: row.title_hi, level: row.level,
      wingId: row.wing_id, committeeId: row.committee_id ?? undefined,
      descriptionEn: row.description_en ?? '', descriptionHi: row.description_hi ?? '',
      status: row.status ?? (row.is_active ? 'active' : 'vacant'), termYears: row.term_years ?? undefined,
      updatedAt: row.updated_at ?? undefined,
    }));
    const wings: OrgWing[] = (wingResult.data ?? []).map((row) => ({
      id: row.id, code: row.code, nameEn: row.name_en, nameHi: row.name_hi, color: row.color ?? 'emerald',
      focusEn: row.focus_en ?? '', focusHi: row.focus_hi ?? '', descriptionEn: row.description_en ?? '', descriptionHi: row.description_hi ?? '',
      headLeaderName: row.head_leader_name ?? undefined, badgeLabel: row.badge_label ?? undefined,
      updatedAt: row.updated_at ?? undefined, isActive: row.is_active,
    }));
    const districts: OrgDistrict[] = geography.map((d) => {
      const row = orgById.get(d.id);
      return {
        id: d.id, nameEn: d.nameEn, nameHi: d.nameHi,
        zone: (d.zoneNameEn || 'Western UP') as OrgDistrict['zone'],
        subDistricts: subByDistrict.get(d.id) ?? [],
        headquarters: row?.headquarters ?? '',
        inChargeName: row?.in_charge_name ?? '',
        inChargePhone: row?.in_charge_phone ?? '',
        activeCadreCount: row?.active_cadre_count ?? 0,
        status: row?.status ?? 'forming',
        updatedAt: row?.updated_at ?? undefined,
      };
    });
    return { posts, wings, districts, geography };
  },

  async savePost(post: PostDesignation): Promise<void> {
    const client = requireSupabase();
    if (!post.wingId) throw new Error('Select an organization wing for this designation.');
    const values = {
      code: slug(post.titleEn),
      title_en: post.titleEn.trim(), title_hi: post.titleHi.trim(), level: post.level,
      wing_id: post.wingId,
      committee_id: post.committeeId ?? null,
      description_en: post.descriptionEn.trim(), description_hi: post.descriptionHi.trim(),
      term_years: post.termYears ?? null, status: post.status,
      is_active: post.status === 'active',
      updated_at: new Date().toISOString(),
    };
    const query = post.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(post.id)
      ? client.from('post_designations').update(values).eq('id', post.id)
      : client.from('post_designations').insert({ ...values, code: `${values.code}_${crypto.randomUUID().slice(0, 8)}` });
    const { error } = await query;
    if (error) dbError('Could not save designation', error);
  },

  async deletePost(id: string): Promise<void> {
    const { error } = await requireSupabase().from('post_designations')
      .update({ is_active: false, status: 'vacant', updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) dbError('Could not deactivate designation', error);
  },

  async saveWing(wing: OrgWing): Promise<void> {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(wing.id)) {
      throw new Error('New organizational wings are disabled; retain the existing wings as inactive records.');
    }
    const client = requireSupabase();
    const values = {
      code: wing.code.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '_'),
      name_en: wing.nameEn.trim(), name_hi: wing.nameHi.trim(), color: wing.color || 'emerald',
      focus_en: wing.focusEn.trim(), focus_hi: wing.focusHi.trim(),
      description_en: wing.descriptionEn.trim(), description_hi: wing.descriptionHi.trim(),
      head_leader_name: wing.headLeaderName?.trim() || null, badge_label: wing.badgeLabel?.trim() || null,
      updated_at: new Date().toISOString(),
    };
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(wing.id);
    const query = isUuid
      ? client.from('org_wings').update(values).eq('id', wing.id)
      : client.from('org_wings').insert(values);
    const { error } = await query;
    if (error) dbError('Could not save wing', error);
  },

  async deleteWing(id: string): Promise<void> {
    const { error } = await requireSupabase().from('org_wings').update({ is_active: false }).eq('id', id);
    if (error) dbError('Could not deactivate wing; the active Muslim Youth League wing cannot be deactivated', error);
  },

  async listCommittees(): Promise<OrganizationCommittee[]> {
    const { data, error } = await requireSupabase()
      .from('committees')
      .select('id,code,name_en,name_hi,description_en,description_hi,wing_id,scope_level,state_id,zone_id,district_id,starts_on,ends_on,status')
      .order('starts_on', { ascending: false })
      .order('name_en');
    if (error) dbError('Could not load committees', error);
    return (data ?? []).map((row) => ({
      id: row.id,
      code: row.code,
      nameEn: row.name_en,
      nameHi: row.name_hi,
      descriptionEn: row.description_en,
      descriptionHi: row.description_hi,
      wingId: row.wing_id,
      scopeLevel: row.scope_level as CommitteeScope,
      stateId: row.state_id,
      zoneId: row.zone_id ?? undefined,
      districtId: row.district_id ?? undefined,
      startsOn: row.starts_on,
      endsOn: row.ends_on ?? undefined,
      status: row.status as CommitteeStatus,
    }));
  },

  async saveCommittee(committee: Omit<OrganizationCommittee, 'id' | 'code' | 'status'> & { id?: string; code?: string; status?: CommitteeStatus }): Promise<void> {
    const values = {
      code: committee.code ?? `${slug(committee.nameEn)}_${crypto.randomUUID().slice(0, 8)}`,
      name_en: committee.nameEn.trim(),
      name_hi: committee.nameHi.trim(),
      description_en: committee.descriptionEn.trim(),
      description_hi: committee.descriptionHi.trim(),
      wing_id: committee.wingId,
      scope_level: committee.scopeLevel,
      state_id: committee.stateId,
      zone_id: committee.zoneId ?? null,
      district_id: committee.districtId ?? null,
      starts_on: committee.startsOn,
      ends_on: committee.endsOn ?? null,
      status: committee.status ?? 'forming',
      updated_at: new Date().toISOString(),
    };
    const table = requireSupabase().from('committees');
    const { error } = committee.id
      ? await table.update(values).eq('id', committee.id)
      : await table.insert(values);
    if (error) dbError('Could not save committee', error);
  },

  async saveDistrict(input: {
    districtId: string; headquarters?: string; inChargeName?: string; inChargePhone?: string;
    activeCadreCount: number; status: OrgDistrict['status'];
  }): Promise<void> {
    const client = requireSupabase();
    const values = {
      district_id: input.districtId, headquarters: input.headquarters?.trim() || null,
      in_charge_name: input.inChargeName?.trim() || null, in_charge_phone: input.inChargePhone?.trim() || null,
      active_cadre_count: Math.max(0, Math.floor(input.activeCadreCount)), status: input.status,
      updated_at: new Date().toISOString(),
    };
    const { error } = await client.from('organizational_districts').upsert(values, { onConflict: 'district_id' });
    if (error) dbError('Could not save organisational district details', error);
  },

  async clearDistrictRecord(districtId: string): Promise<void> {
    const { error } = await requireSupabase().from('organizational_districts').delete().eq('district_id', districtId);
    if (error) dbError('Could not clear organisational district details', error);
  },
};
