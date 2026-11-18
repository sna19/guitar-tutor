/**
 * Quick links to song catalogues — checked to be live (2026-11-18). `search` builds a search for «artist title»;
 * `paste` — the sheet there is chords above the words, so it can be pasted into «Мои песни» as is.
 */
import type { L10n } from '../i18n.js';

export type Kind = 'chords' | 'tabs' | 'notes';

export interface Site {
	name: string;
	url: string;
	kind: Kind;
	lang: 'ru' | 'en';
	note: L10n;
	search?: (q: string) => string;
	paste?: boolean;
}

const q = encodeURIComponent;

export const SITES: Site[] = [
	{
		name: 'akkords.pro',
		url: 'https://akkords.pro/',
		kind: 'chords',
		lang: 'ru',
		paste: true,
		note: { ru: 'Аккорды с аппликатурами, аккуратные подборы русского рока.', en: 'Chords with fingerings, careful transcriptions of Russian rock.' },
		search: (s) => `https://akkords.pro/?s=${q(s)}`
	},
	{
		name: 'AmDm.ru',
		url: 'https://amdm.ru/',
		kind: 'chords',
		lang: 'ru',
		paste: true,
		note: { ru: 'Самый большой русскоязычный каталог аккордов, есть табулатуры и GTP.', en: 'The largest Russian-language chord catalogue, with tabs and Guitar Pro files.' },
		search: (s) => `https://amdm.ru/search/?q=${q(s)}`
	},
	{
		name: 'MyChords.net',
		url: 'https://mychords.net/',
		kind: 'chords',
		lang: 'ru',
		paste: true,
		note: { ru: 'Аккорды и тексты, удобная транспозиция на сайте.', en: 'Chords and words, handy transposition on the site.' },
		search: (s) => `https://mychords.net/search?q=${q(s)}`
	},
	{
		name: '5Lad.net',
		url: 'https://top.5lad.net/',
		kind: 'chords',
		lang: 'ru',
		paste: true,
		note: { ru: 'Аккорды песен и аппликатуры аккордов.', en: 'Song chords and chord fingerings.' }
	},
	{
		name: 'Songsterr',
		url: 'https://www.songsterr.com/',
		kind: 'tabs',
		lang: 'en',
		note: { ru: 'Табулатуры с ритмом и воспроизведением — для рифов и соло (есть и русский рок).', en: 'Tabs with rhythm and playback — for riffs and solos (Russian rock too).' },
		search: (s) => `https://www.songsterr.com/?pattern=${q(s)}`
	},
	{
		name: 'Ultimate Guitar',
		url: 'https://www.ultimate-guitar.com/',
		kind: 'tabs',
		lang: 'en',
		note: { ru: 'Крупнейший мировой каталог аккордов и табов; русские песни ищутся по-русски.', en: 'The largest catalogue of chords and tabs; Russian songs are found in Cyrillic.' },
		search: (s) => `https://www.ultimate-guitar.com/search.php?search_type=title&value=${q(s)}`
	},
	{
		name: 'Mutopia Project',
		url: 'https://www.mutopiaproject.org/cgibin/make-table.cgi?Instrument=Guitar',
		kind: 'notes',
		lang: 'en',
		note: { ru: 'Ноты классической гитары в общественном достоянии (из них — пьесы приложения).', en: 'Classical guitar scores in the public domain (the app’s pieces come from here).' }
	},
	{
		name: 'IMSLP',
		url: 'https://imslp.org/wiki/Category:For_guitar',
		kind: 'notes',
		lang: 'en',
		note: { ru: 'Библиотека нот в общественном достоянии: школы Агуадо, Сора, Карулли, пьесы Тарреги — PDF загружается в «Мои ноты».', en: 'A library of public-domain scores: the methods of Aguado, Sor, Carulli, Tárrega’s pieces — a PDF goes into “My scores”.' }
	}
];

export const KINDS: { key: Kind; title: L10n }[] = [
	{ key: 'chords', title: { ru: 'Аккорды песен', en: 'Song chords' } },
	{ key: 'tabs', title: { ru: 'Табулатуры', en: 'Tabs' } },
	{ key: 'notes', title: { ru: 'Ноты классики', en: 'Classical scores' } }
];

export const searchable = () => SITES.filter((s) => s.search);
