import { requireSupabase } from './supabaseClient';

export interface LookupOption {
  id: string;
  code: string;
  name_en: string;
  name_hi?: string | null;
  sort_order?: number;
}
export interface StateOption extends LookupOption {}
export interface ZoneOption extends LookupOption { state_id: string }
export interface DistrictOption extends LookupOption { state_id: string; zone_id: string | null }
export interface SubDistrictOption extends LookupOption { district_id: string; unit_type: string }
export interface WingOption extends LookupOption { color?: string }

async function activeRows<T>(table: string, columns: string, orderColumn = 'sort_order'): Promise<T[]> {
  const client = requireSupabase();
  const { data, error } = await client.from(table).select(columns).eq('is_active', true).order(orderColumn);
  if (error) throw new Error(`Could not load ${table}: ${error.message}`);
  return (data ?? []) as T[];
}

export const referenceDataService = {
  states: () => activeRows<LookupOption>('states', 'id,code,name_en,name_hi,sort_order'),
  zones: (stateId?: string) => {
    const client = requireSupabase();
    let query = client.from('zones').select('id,code,name_en,name_hi,state_id,sort_order').eq('is_active', true).order('sort_order');
    if (stateId) query = query.eq('state_id', stateId);
    return query.then(({ data, error }) => {
      if (error) throw new Error(`Could not load zones: ${error.message}`);
      return (data ?? []) as ZoneOption[];
    });
  },
  districts: (stateId?: string, zoneId?: string) => {
    const client = requireSupabase();
    let query = client.from('districts').select('id,code,name_en,name_hi,state_id,zone_id,sort_order').eq('is_active', true).order('name_en');
    if (stateId) query = query.eq('state_id', stateId);
    if (zoneId) query = query.eq('zone_id', zoneId);
    return query.then(({ data, error }) => {
      if (error) throw new Error(`Could not load districts: ${error.message}`);
      return (data ?? []) as DistrictOption[];
    });
  },
  subDistricts: (districtId: string) => {
    const client = requireSupabase();
    return client.from('sub_districts')
      .select('id,code,name_en,name_hi,district_id,unit_type,sort_order')
      .eq('district_id', districtId).eq('is_active', true).order('name_en')
      .then(({ data, error }) => {
        if (error) throw new Error(`Could not load sub-districts: ${error.message}`);
        return (data ?? []) as SubDistrictOption[];
      });
  },
  wings: () => activeRows<WingOption>('org_wings', 'id,code,name_en,name_hi,color,sort_order'),
  designations: () => activeRows<LookupOption>('post_designations', 'id,code,title_en,title_hi,sort_order'),
  eventCategories: () => activeRows<LookupOption>('event_categories', 'id,code,name_en,name_hi,sort_order'),
  newsCategories: () => activeRows<LookupOption>('news_categories', 'id,code,name_en,name_hi,sort_order'),
  faqCategories: () => activeRows<LookupOption>('faq_categories', 'id,code,name_en,name_hi,sort_order'),
  parliamentaryHouses: () => activeRows<LookupOption>('parliamentary_houses', 'id,code,name_en,name_hi,sort_order'),
  socialPlatforms: () => {
    const client = requireSupabase();
    return client.from('social_platforms').select('id,code,name,sort_order').eq('is_active', true).order('sort_order')
      .then(({ data, error }) => {
        if (error) throw new Error(`Could not load social platforms: ${error.message}`);
        return (data ?? []).map((row) => ({ ...row, name_en: row.name })) as LookupOption[];
      });
  },
  roles: () => activeRows<LookupOption>('roles', 'id,code,name_en,name_hi,sort_order'),
  memberCommunities: () => activeRows<LookupOption>('member_communities', 'id,code,name_en,name_hi,sort_order'),
};
