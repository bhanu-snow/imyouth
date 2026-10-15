import { requireSupabase } from './supabaseClient';
import type { MythFaqItem } from '../types';

type FaqRow = {
  id: string;
  legacy_id: string | null;
  myth_en: string;
  myth_hi: string | null;
  fact_en: string;
  fact_hi: string | null;
  detailed_explanation_en: string;
  detailed_explanation_hi: string | null;
  sort_order: number;
  faq_categories: { code: MythFaqItem['category'] } | { code: MythFaqItem['category'] }[] | null;
  faq_talking_points: { language_code: 'en' | 'hi'; sort_order: number; talking_point: string }[] | null;
};

const categoryCode = (row: FaqRow): MythFaqItem['category'] => {
  const relation = row.faq_categories;
  const category = Array.isArray(relation) ? relation[0]?.code : relation?.code;
  return category ?? 'history';
};

const toFaq = (row: FaqRow): MythFaqItem => {
  const points = [...(row.faq_talking_points ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  return {
    id: row.legacy_id ?? row.id,
    category: categoryCode(row),
    mythEn: row.myth_en,
    mythHi: row.myth_hi ?? '',
    factEn: row.fact_en,
    factHi: row.fact_hi ?? '',
    detailedExplanationEn: row.detailed_explanation_en ?? '',
    detailedExplanationHi: row.detailed_explanation_hi ?? '',
    cadreTalkingPointsEn: points.filter((p) => p.language_code === 'en').map((p) => p.talking_point),
    cadreTalkingPointsHi: points.filter((p) => p.language_code === 'hi').map((p) => p.talking_point),
  };
};

export const faqService = {
  async list(): Promise<MythFaqItem[]> {
    const client = requireSupabase();
    const { data, error } = await client
      .from('myth_faqs')
      .select('id,legacy_id,myth_en,myth_hi,fact_en,fact_hi,detailed_explanation_en,detailed_explanation_hi,sort_order,faq_categories!inner(code),faq_talking_points(language_code,sort_order,talking_point)')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    if (error) throw new Error(`Could not load FAQs from Supabase: ${error.message}`);
    return ((data ?? []) as unknown as FaqRow[]).map(toFaq);
  },

  async save(faq: MythFaqItem): Promise<void> {
    const client = requireSupabase();
    const { data: category, error: categoryError } = await client
      .from('faq_categories')
      .select('id')
      .eq('code', faq.category)
      .eq('is_active', true)
      .single();
    if (categoryError || !category) {
      throw new Error(`Could not resolve FAQ category: ${categoryError?.message ?? faq.category}`);
    }

    const { data: saved, error: saveError } = await client
      .from('myth_faqs')
      .upsert({
        legacy_id: faq.id,
        category_id: category.id,
        myth_en: faq.mythEn,
        myth_hi: faq.mythHi,
        fact_en: faq.factEn,
        fact_hi: faq.factHi,
        detailed_explanation_en: faq.detailedExplanationEn,
        detailed_explanation_hi: faq.detailedExplanationHi,
        is_published: true,
      }, { onConflict: 'legacy_id' })
      .select('id')
      .single();
    if (saveError || !saved) {
      throw new Error(`Could not save FAQ: ${saveError?.message ?? 'No record returned'}`);
    }

    const { error: deletePointsError } = await client
      .from('faq_talking_points')
      .delete()
      .eq('faq_id', saved.id);
    if (deletePointsError) throw new Error(`FAQ saved, but existing talking points could not be replaced: ${deletePointsError.message}`);

    const points = [
      ...faq.cadreTalkingPointsEn.map((talking_point, index) => ({ faq_id: saved.id, language_code: 'en' as const, sort_order: index + 1, talking_point })),
      ...faq.cadreTalkingPointsHi.map((talking_point, index) => ({ faq_id: saved.id, language_code: 'hi' as const, sort_order: index + 1, talking_point })),
    ];
    if (points.length) {
      const { error: pointsError } = await client.from('faq_talking_points').insert(points);
      if (pointsError) throw new Error(`FAQ saved, but talking points could not be saved: ${pointsError.message}`);
    }
  },

  async remove(id: string): Promise<void> {
    const client = requireSupabase();
    const { error } = await client.from('myth_faqs').delete().eq('legacy_id', id);
    if (error) throw new Error(`Could not delete FAQ: ${error.message}`);
  },
};
