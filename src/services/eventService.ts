import { requireSupabase } from './supabaseClient';
import type { PartyEvent, EventCategory } from '../types';

type EventRow = {
  id: string;
  legacy_id: string | null;
  title_en: string;
  title_hi: string | null;
  description_en: string;
  description_hi: string | null;
  event_date: string;
  event_time: string | null;
  location_en: string;
  location_hi: string | null;
  coordinator_name: string;
  coordinator_phone: string | null;
  coordinator_designation: string | null;
  highlight_tag_en: string | null;
  highlight_tag_hi: string | null;
  event_categories: { code: EventCategory } | { code: EventCategory }[] | null;
  districts: { name_en: string } | { name_en: string }[] | null;
  states: { name_en: string } | { name_en: string }[] | null;
};

const relationValue = <T,>(value: T | T[] | null): T | null =>
  Array.isArray(value) ? value[0] ?? null : value;

const formatTime = (time: string | null): string => {
  if (!time) return '';
  const [hoursText, minutes = '00'] = time.split(':');
  const hours = Number(hoursText);
  if (!Number.isFinite(hours)) return time;
  return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
};

const toEvent = (row: EventRow, rsvpCount: number, userRsvp: 'going' | 'maybe' | null): PartyEvent => ({
  id: row.legacy_id ?? row.id,
  title: { en: row.title_en, hi: row.title_hi ?? row.title_en },
  description: { en: row.description_en, hi: row.description_hi ?? row.description_en },
  category: relationValue(row.event_categories)?.code ?? 'rally',
  date: row.event_date,
  time: formatTime(row.event_time),
  location: { en: row.location_en, hi: row.location_hi ?? row.location_en },
  district: relationValue(row.districts)?.name_en ?? '',
  state: relationValue(row.states)?.name_en ?? 'Uttar Pradesh',
  rsvpCount,
  userRsvp,
  coordinator: {
    name: row.coordinator_name,
    phone: row.coordinator_phone ?? '',
    designation: row.coordinator_designation ?? '',
  },
  highlightTag: row.highlight_tag_en || row.highlight_tag_hi
    ? { en: row.highlight_tag_en ?? '', hi: row.highlight_tag_hi ?? row.highlight_tag_en ?? '' }
    : undefined,
});

export const eventService = {
  async list(): Promise<PartyEvent[]> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('events')
      .select('id,legacy_id,title_en,title_hi,description_en,description_hi,event_date,event_time,location_en,location_hi,coordinator_name,coordinator_phone,coordinator_designation,highlight_tag_en,highlight_tag_hi,event_categories!inner(code),districts!inner(name_en),states!inner(name_en)')
      .eq('is_published', true)
      .order('event_date', { ascending: true });
    if (error) throw new Error(`Could not load events from Supabase: ${error.message}`);
    const rows = (data ?? []) as unknown as EventRow[];
    if (!rows.length) return [];

    const eventIds = rows.map((row) => row.id);
    const [countsResult, userResult] = await Promise.all([
      client.from('event_rsvp_counts').select('event_id,rsvp_count').in('event_id', eventIds),
      client.auth.getUser(),
    ]);
    if (countsResult.error) throw new Error(`Could not load event RSVP counts: ${countsResult.error.message}`);

    const counts = new Map<string, number>(
      (countsResult.data ?? []).map((row): [string, number] => [row.event_id as string, row.rsvp_count as number]),
    );
    let userRsvps = new Map<string, 'going' | 'maybe'>();
    const userId = userResult.data.user?.id;
    if (userId) {
      const { data: rsvps, error: rsvpError } = await client
        .from('event_rsvps')
        .select('event_id,status')
        .eq('user_id', userId)
        .in('event_id', eventIds);
      if (rsvpError) throw new Error(`Could not load your event RSVPs: ${rsvpError.message}`);
      userRsvps = new Map((rsvps ?? []).map((r): [string, 'going' | 'maybe'] => [r.event_id as string, r.status as 'going' | 'maybe']));
    }
    return rows.map((row) => toEvent(row, counts.get(row.id) ?? 0, userRsvps.get(row.id) ?? null));
  },

  async save(event: PartyEvent): Promise<void> {
    const client = requireSupabase();
    const [{ data: category, error: categoryError }, { data: district, error: districtError }, { data: state, error: stateError }] = await Promise.all([
      client.from('event_categories').select('id').eq('code', event.category).eq('is_active', true).single(),
      client.from('districts').select('id,state_id').eq('name_en', event.district).eq('is_active', true).single(),
      client.from('states').select('id').eq('code', 'UP').eq('is_active', true).single(),
    ]);
    if (categoryError || !category) throw new Error(`Could not resolve event category: ${categoryError?.message ?? event.category}`);
    if (districtError || !district) throw new Error(`Could not resolve event district: ${districtError?.message ?? event.district}`);
    if (stateError || !state) throw new Error(`Could not resolve Uttar Pradesh: ${stateError?.message ?? 'state not found'}`);
    if (district.state_id !== state.id) throw new Error('The selected district does not belong to Uttar Pradesh.');

    const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(event.time.trim());
    let eventTime: string | null = null;
    if (match) {
      let hours = Number(match[1]) % 12;
      if (match[3].toUpperCase() === 'PM') hours += 12;
      eventTime = `${String(hours).padStart(2, '0')}:${match[2]}:00`;
    } else if (/^\d{2}:\d{2}$/.test(event.time.trim())) {
      eventTime = `${event.time.trim()}:00`;
    }

    const { error } = await client.from('events').upsert({
      legacy_id: event.id,
      title_en: event.title.en,
      title_hi: event.title.hi,
      description_en: event.description.en,
      description_hi: event.description.hi,
      category_id: category.id,
      event_date: event.date,
      event_time: eventTime,
      location_en: event.location.en,
      location_hi: event.location.hi,
      state_id: state.id,
      district_id: district.id,
      coordinator_name: event.coordinator.name,
      coordinator_phone: event.coordinator.phone || null,
      coordinator_designation: event.coordinator.designation || null,
      highlight_tag_en: event.highlightTag?.en ?? null,
      highlight_tag_hi: event.highlightTag?.hi ?? null,
      is_published: true,
    }, { onConflict: 'legacy_id' });
    if (error) throw new Error(`Could not save event: ${error.message}`);
  },

  async remove(id: string): Promise<void> {
    const { error } = await requireSupabase().from('events').delete().eq('legacy_id', id);
    if (error) throw new Error(`Could not delete event: ${error.message}`);
  },

  async toggleRsvp(eventLegacyId: string, status: 'going' | 'maybe'): Promise<void> {
    const client = requireSupabase();
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) throw new Error('Sign in before registering your event RSVP.');
    const { data: event, error: eventError } = await client.from('events').select('id').eq('legacy_id', eventLegacyId).single();
    if (eventError || !event) throw new Error(`Could not find event: ${eventError?.message ?? eventLegacyId}`);

    const { data: existing, error: existingError } = await client
      .from('event_rsvps')
      .select('id,status')
      .eq('event_id', event.id)
      .eq('user_id', userData.user.id)
      .maybeSingle();
    if (existingError) throw new Error(`Could not check existing RSVP: ${existingError.message}`);

    if (existing?.status === status) {
      const { error } = await client.from('event_rsvps').delete().eq('id', existing.id);
      if (error) throw new Error(`Could not remove RSVP: ${error.message}`);
      return;
    }
    if (existing) {
      const { error } = await client.from('event_rsvps').update({ status }).eq('id', existing.id);
      if (error) throw new Error(`Could not update RSVP: ${error.message}`);
    } else {
      const { error } = await client.from('event_rsvps').insert({
        event_id: event.id,
        user_id: userData.user.id,
        status,
      });
      if (error) throw new Error(`Could not save RSVP: ${error.message}`);
    }
  },
};
