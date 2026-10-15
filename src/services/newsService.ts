import { requireSupabase } from './supabaseClient';
import type { NewsItem, NewsCategory } from '../types';

type NewsRow = {
  id: string;
  legacy_id: string | null;
  title_en: string;
  title_hi: string | null;
  excerpt_en: string;
  excerpt_hi: string | null;
  content_en: string;
  content_hi: string | null;
  published_at: string;
  read_time_minutes: number;
  author_name_en: string;
  author_name_hi: string | null;
  author_role_en: string;
  author_role_hi: string | null;
  share_count: number;
  news_categories: { code: NewsCategory } | { code: NewsCategory }[] | null;
  news_post_tags: { news_tags: { name: string } | { name: string }[] | null }[] | null;
};

const relationValue = <T,>(value: T | T[] | null): T | null =>
  Array.isArray(value) ? value[0] ?? null : value;

const toNews = (row: NewsRow): NewsItem => ({
  id: row.legacy_id ?? row.id,
  title: { en: row.title_en, hi: row.title_hi ?? row.title_en },
  excerpt: { en: row.excerpt_en, hi: row.excerpt_hi ?? row.excerpt_en },
  fullContent: { en: row.content_en, hi: row.content_hi ?? row.content_en },
  category: relationValue(row.news_categories)?.code ?? 'press_release',
  publishedAt: row.published_at.slice(0, 10),
  readTime: `${row.read_time_minutes} min`,
  author: {
    name: { en: row.author_name_en, hi: row.author_name_hi ?? row.author_name_en },
    role: { en: row.author_role_en, hi: row.author_role_hi ?? row.author_role_en },
  },
  shareCount: row.share_count,
  tags: (row.news_post_tags ?? []).flatMap((item) => {
    const tag = relationValue(item.news_tags);
    return tag ? [tag.name] : [];
  }),
});

export const newsService = {
  async list(): Promise<NewsItem[]> {
    const { data, error } = await requireSupabase()
      .from('news_posts')
      .select('id,legacy_id,title_en,title_hi,excerpt_en,excerpt_hi,content_en,content_hi,published_at,read_time_minutes,author_name_en,author_name_hi,author_role_en,author_role_hi,share_count,news_categories!inner(code),news_post_tags(news_tags(name))')
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    if (error) throw new Error(`Could not load news from Supabase: ${error.message}`);
    return ((data ?? []) as unknown as NewsRow[]).map(toNews);
  },

  async save(item: NewsItem): Promise<void> {
    const client = requireSupabase();
    const { data: category, error: categoryError } = await client
      .from('news_categories').select('id').eq('code', item.category).eq('is_active', true).single();
    if (categoryError || !category) throw new Error(`Could not resolve news category: ${categoryError?.message ?? item.category}`);

    const minutes = Number.parseInt(item.readTime, 10);
    const { data: saved, error: saveError } = await client.from('news_posts').upsert({
      legacy_id: item.id,
      title_en: item.title.en,
      title_hi: item.title.hi,
      excerpt_en: item.excerpt.en,
      excerpt_hi: item.excerpt.hi,
      content_en: item.fullContent.en,
      content_hi: item.fullContent.hi,
      category_id: category.id,
      published_at: item.publishedAt,
      read_time_minutes: Number.isFinite(minutes) && minutes > 0 ? minutes : 3,
      author_name_en: item.author.name.en,
      author_name_hi: item.author.name.hi,
      author_role_en: item.author.role.en,
      author_role_hi: item.author.role.hi,
      share_count: item.shareCount,
      is_published: true,
    }, { onConflict: 'legacy_id' }).select('id').single();
    if (saveError || !saved) throw new Error(`Could not save news: ${saveError?.message ?? 'No record returned'}`);

    const { error: clearTagsError } = await client.from('news_post_tags').delete().eq('news_post_id', saved.id);
    if (clearTagsError) throw new Error(`News saved, but tags could not be replaced: ${clearTagsError.message}`);
    const names = [...new Set(item.tags.map((tag) => tag.trim()).filter(Boolean))];
    if (!names.length) return;
    const { error: tagsError } = await client.from('news_tags').upsert(names.map((name) => ({ name })), { onConflict: 'name', ignoreDuplicates: true });
    if (tagsError) throw new Error(`News saved, but tags could not be stored: ${tagsError.message}`);
    const { data: tags, error: loadTagsError } = await client.from('news_tags').select('id,name').in('name', names);
    if (loadTagsError) throw new Error(`News saved, but tags could not be loaded: ${loadTagsError.message}`);
    const links = (tags ?? []).map((tag) => ({ news_post_id: saved.id, tag_id: tag.id }));
    if (links.length) {
      const { error: linkError } = await client.from('news_post_tags').insert(links);
      if (linkError) throw new Error(`News saved, but tags could not be linked: ${linkError.message}`);
    }
  },

  async remove(id: string): Promise<void> {
    const { error } = await requireSupabase().from('news_posts').delete().eq('legacy_id', id);
    if (error) throw new Error(`Could not delete news item: ${error.message}`);
  },
};
