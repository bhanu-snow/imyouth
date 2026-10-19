import type {
  AppointmentEndReason,
  MemberDesignationAppointment,
  MemberMembership,
  MembershipEndReason,
  PostDesignation,
} from '../types';
import { requireSupabase } from './supabaseClient';

type AppointmentRow = {
  id: string;
  member_id: string;
  post_designation_id: string;
  scope_level: PostDesignation['level'];
  state_id: string;
  zone_id: string | null;
  district_id: string | null;
  sub_district_id: string | null;
  starts_on: string;
  ends_on: string | null;
  end_reason: AppointmentEndReason | null;
  end_notes: string | null;
};

export const memberOrganizationService = {
  async loadHistory(memberId: string): Promise<{ memberships: MemberMembership[]; appointments: MemberDesignationAppointment[] }> {
    const client = requireSupabase();
    const [membershipResult, appointmentResult] = await Promise.all([
      client.from('member_memberships')
        .select('id,member_id,wing_id,starts_on,ends_on,end_reason,end_notes')
        .eq('member_id', memberId)
        .order('starts_on', { ascending: false }),
      client.from('member_designation_appointments')
        .select('id,member_id,post_designation_id,scope_level,state_id,zone_id,district_id,sub_district_id,starts_on,ends_on,end_reason,end_notes')
        .eq('member_id', memberId)
        .order('starts_on', { ascending: false }),
    ]);
    if (membershipResult.error) throw new Error(`Could not load membership history: ${membershipResult.error.message}`);
    if (appointmentResult.error) throw new Error(`Could not load designation history: ${appointmentResult.error.message}`);

    const appointments = (appointmentResult.data ?? []) as AppointmentRow[];
    const designationIds = [...new Set(appointments.map((appointment) => appointment.post_designation_id))];
    const designationResult = designationIds.length
      ? await client.from('post_designations')
        .select('id,title_en,title_hi,committee_id')
        .in('id', designationIds)
      : { data: [], error: null };
    if (designationResult.error) throw new Error(`Could not resolve appointment designations: ${designationResult.error.message}`);

    const designations = designationResult.data ?? [];
    const committeeIds = [...new Set(designations.map((designation) => designation.committee_id).filter((id): id is string => Boolean(id)))];
    const committeeResult = committeeIds.length
      ? await client.from('committees').select('id,name_en').in('id', committeeIds)
      : { data: [], error: null };
    if (committeeResult.error) throw new Error(`Could not resolve appointment committees: ${committeeResult.error.message}`);
    const committeeNames = new Map((committeeResult.data ?? []).map((committee) => [committee.id, committee.name_en]));
    const designationById = new Map(designations.map((designation) => [designation.id, designation]));

    return {
      memberships: (membershipResult.data ?? []).map((row) => ({
        id: row.id,
        memberId: row.member_id,
        wingId: row.wing_id,
        startsOn: row.starts_on,
        endsOn: row.ends_on ?? undefined,
        endReason: row.end_reason ?? undefined,
        endNotes: row.end_notes ?? undefined,
      })),
      appointments: appointments.map((row) => {
        const designation = designationById.get(row.post_designation_id);
        return {
          id: row.id,
          memberId: row.member_id,
          postDesignationId: row.post_designation_id,
          designationTitleEn: designation?.title_en ?? 'Inactive designation',
          designationTitleHi: designation?.title_hi ?? '',
          committeeId: designation?.committee_id ?? undefined,
          committeeNameEn: designation?.committee_id ? committeeNames.get(designation.committee_id) : undefined,
          scopeLevel: row.scope_level,
          stateId: row.state_id,
          zoneId: row.zone_id ?? undefined,
          districtId: row.district_id ?? undefined,
          subDistrictId: row.sub_district_id ?? undefined,
          startsOn: row.starts_on,
          endsOn: row.ends_on ?? undefined,
          endReason: row.end_reason ?? undefined,
          endNotes: row.end_notes ?? undefined,
        };
      }),
    };
  },

  async activeDesignations(): Promise<PostDesignation[]> {
    const { data, error } = await requireSupabase()
      .from('post_designations')
      .select('id,title_en,title_hi,level,wing_id,committee_id,description_en,description_hi,term_years,status')
      .eq('is_active', true)
      .order('sort_order')
      .order('title_en');
    if (error) throw new Error(`Could not load active designations: ${error.message}`);
    return (data ?? []).map((row) => ({
      id: row.id,
      titleEn: row.title_en,
      titleHi: row.title_hi,
      level: row.level,
      wingId: row.wing_id,
      committeeId: row.committee_id ?? undefined,
      descriptionEn: row.description_en ?? '',
      descriptionHi: row.description_hi ?? '',
      termYears: row.term_years ?? undefined,
      status: row.status ?? 'active',
    }));
  },

  async assignDesignation(input: {
    memberId: string;
    postDesignationId: string;
    scopeLevel: PostDesignation['level'];
    stateId: string;
    zoneId?: string;
    districtId?: string;
    subDistrictId?: string;
    startsOn: string;
  }): Promise<void> {
    const { error } = await requireSupabase().rpc('assign_member_designation', {
      p_member_id: input.memberId,
      p_post_designation_id: input.postDesignationId,
      p_scope_level: input.scopeLevel,
      p_state_id: input.stateId,
      p_zone_id: input.zoneId ?? null,
      p_district_id: input.districtId ?? null,
      p_sub_district_id: input.subDistrictId ?? null,
      p_starts_on: input.startsOn,
    });
    if (error) throw new Error(`Could not assign designation: ${error.message}`);
  },

  async endDesignation(input: {
    appointmentId: string;
    endsOn: string;
    reason: AppointmentEndReason;
    notes?: string;
  }): Promise<void> {
    const { error } = await requireSupabase().rpc('end_member_designation', {
      p_appointment_id: input.appointmentId,
      p_ends_on: input.endsOn,
      p_reason: input.reason,
      p_notes: input.notes?.trim() || null,
    });
    if (error) throw new Error(`Could not end designation: ${error.message}`);
  },

  async endMembership(input: {
    membershipId: string;
    endsOn: string;
    reason: MembershipEndReason;
    notes?: string;
  }): Promise<void> {
    const { error } = await requireSupabase().rpc('end_member_membership', {
      p_membership_id: input.membershipId,
      p_ends_on: input.endsOn,
      p_reason: input.reason,
      p_notes: input.notes?.trim() || null,
    });
    if (error) throw new Error(`Could not end membership: ${error.message}`);
  },
};
