// frontend/src/data/bibleQuotes.js
// Short, original Swahili paraphrases (not verbatim quotations from any
// particular Bible translation) referencing well-known verses. Rotated daily
// on the dashboard welcome banner.

export const BIBLE_QUOTES = [
  { text: 'Hii ndiyo siku aliyoifanya Bwana; nashangilia na kuifurahia.', ref: 'Zaburi 118:24' },
  { text: 'Mwamini Bwana kwa moyo wako wote, wala usitegemee akili zako mwenyewe.', ref: 'Mithali 3:5' },
  { text: 'Bwana ni mchungaji wangu; sitapungukiwa na kitu.', ref: 'Zaburi 23:1' },
  { text: 'Nawaachieni amani; amani yangu nawapa.', ref: 'Yohana 14:27' },
  { text: 'Naweza kufanya mambo yote katika yeye anitiaye nguvu.', ref: 'Wafilipi 4:13' },
  { text: 'Mpende jirani yako kama nafsi yako.', ref: 'Marko 12:31' },
  { text: 'Bwana ni nuru yangu na wokovu wangu; nimwogope nani?', ref: 'Zaburi 27:1' },
  { text: 'Njooni kwangu, ninyi nyote msumbukao, nami nitawapumzisha.', ref: 'Mathayo 11:28' },
  { text: 'Furahini siku zote; ombeni bila kukoma; shukuruni kwa kila jambo.', ref: '1 Wathesalonike 5:16-18' },
  { text: 'Tazama, mimi nipo pamoja nanyi siku zote, hata ukamilifu wa dahari.', ref: 'Mathayo 28:20' },
];

// Deterministic "quote of the day" — same quote all day for everyone, then
// rotates automatically at midnight without needing a server call.
export function getQuoteOfTheDay() {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return BIBLE_QUOTES[dayIndex % BIBLE_QUOTES.length];
}
