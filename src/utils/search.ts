/**
 * Arabic text normalization and fuzzy search utilities for Hadith and Azkar texts.
 */

// Strip Arabic diacritics (tashkeel: fatha, damma, kasra, sukun, shadda, tanween)
export function stripTashkeel(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // Arabic diacritics
    .replace(/\u0640/g, ''); // Tatweel
}

// Normalize Arabic letters for robust search matching
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return stripTashkeel(text)
    .toLowerCase()
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
}

/**
 * Checks if a search query matches any target fields in a dhikr
 */
export function matchesQuery(query: string, ...fields: (string | undefined | null)[]): boolean {
  if (!query || !query.trim()) return true;
  const normalizedQuery = normalizeArabic(query);
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  const combinedNormalizedFields = fields
    .filter(Boolean)
    .map(f => normalizeArabic(f!))
    .join(' ');

  return terms.every(term => combinedNormalizedFields.includes(term));
}
