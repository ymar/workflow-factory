import { getCollection } from 'astro:content';

// The four sectors, active ones first (src/content/segments/*.json), then in the order of the file name.
export async function getSectors() {
  const all = await getCollection('segments');
  return all.sort((a, b) => Number(b.data.active) - Number(a.data.active) || a.id.localeCompare(b.id));
}
export const sectorHref = (slug: string) => `/${slug}/`;
