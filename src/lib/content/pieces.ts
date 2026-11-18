import classical from './pieces/classical.generated.json';
import type { L10n, Lang } from '../i18n.js';

export type Style = 'classical' | 'spanish' | 'rock' | 'pop' | 'jazz' | 'blues';

export interface Piece {
	id: string;
	title: L10n;
	composer: L10n;
	catalog: string;
	collection: L10n;
	style: Style;
	level: number;
	key: string;
	meter: string;
	tempo: number;
	bars: number;
	notes: number;
	remarks: L10n[];
	draft?: boolean;
	source: { name: string; url: string; license: string; edition: string };
}

export const PIECES: Piece[] = (classical as Piece[]).slice().sort((a, b) => a.level - b.level);
export const pieceById = (id: string) => PIECES.find((p) => p.id === id);

// the notes themselves are loaded only when a piece is opened
const files = import.meta.glob('./pieces/*/*.abc', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>;

export async function loadAbc(id: string): Promise<string | null> {
	const entry = Object.entries(files).find(([path]) => path.endsWith(`/${id}.abc`));
	return entry ? entry[1]() : null;
}

const NOTE: Record<string, string> = { C: 'до', D: 'ре', E: 'ми', F: 'фа', G: 'соль', A: 'ля', B: 'си' };
export function keyName(k: string, lang: Lang = 'ru'): string {
	const m = k.match(/^([A-G])([#b]?)(m?)/);
	if (!m) return k;
	if (lang === 'en') return `${m[1]}${m[2] === '#' ? '♯' : m[2] === 'b' ? '♭' : ''} ${m[3] ? 'minor' : 'major'}`;
	return `${NOTE[m[1]]}${m[2] === '#' ? '-диез' : m[2] === 'b' ? '-бемоль' : ''} ${m[3] ? 'минор' : 'мажор'}`;
}

/** the piece's texts in a language */
export function pieceText(p: Piece, lang: Lang) {
	return { title: p.title[lang], composer: p.composer[lang], collection: p.collection[lang], remarks: p.remarks.map((r) => r[lang]) };
}
