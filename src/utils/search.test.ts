import test from 'node:test';
import assert from 'node:assert/strict';
import { stripTashkeel, normalizeArabic, matchesQuery } from './search';

test('stripTashkeel removes all Arabic vowel marks and tanween', () => {
  const input = 'أَصْبَحْنَا وَأَصْبَحَ المُلْكُ لِلَّهِ';
  const expected = 'أصبحنا وأصبح الملك لله';
  assert.equal(stripTashkeel(input), expected);
});

test('normalizeArabic normalizes alef, yaa, and taa marbuta', () => {
  const text1 = 'أَذْكَارُ الصَّبَاحِ';
  const text2 = 'اذكار الصباح';
  assert.equal(normalizeArabic(text1), normalizeArabic(text2));

  assert.equal(normalizeArabic('مغفرة'), 'مغفره');
  assert.equal(normalizeArabic('يهدى'), 'يهدي');
});

test('matchesQuery finds words across diacritics and letter variants', () => {
  const dhikrText = 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ خَلَقْتَنِي';
  const narrator = 'عن شداد بن أوس رضي الله عنه';
  const source = '[مختصر البخاري 2420]';

  // Exact match without tashkeel
  assert.equal(matchesQuery('خلقتني', dhikrText), true);

  // Match with alef variant
  assert.equal(matchesQuery('اللهم انت ربي', dhikrText), true);

  // Match narrator
  assert.equal(matchesQuery('شداد', narrator), true);

  // Match source
  assert.equal(matchesQuery('البخاري', source), true);

  // Multi-term across fields
  assert.equal(matchesQuery('شداد خلقتني', dhikrText, narrator), true);

  // Unrelated term returns false
  assert.equal(matchesQuery('الرياح', dhikrText, narrator), false);
});
