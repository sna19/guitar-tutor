/**
 * Guitar exercises written as ABC (treble-8 clef, a tab under the staff), so they sound, light up and slow down like
 * the pieces: scales, the minor pentatonic, the chromatic «spider», chord progressions strummed in the voicings of
 * the chord library. A lesson refers to one by an id: `ex:scale:G:major`, `ex:penta:A`, `ex:spider`,
 * `ex:prog:Am-G-F-E:4` (chords joined by «-», beats per chord).
 */
import { pitchesOf, shapeByName } from './chords.js';

type Lang = 'ru' | 'en';
const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const SIG: Record<string, number> = { C: 0, G: 1, D: 2, A: 3, E: 4, B: 5, F: -1, Bb: -2, Am: 0, Em: 1, Bm: 2, Dm: -1, Gm: -2, 'F#m': 3, Cm: -3 };
const SHARPS = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];

function keyAlter(sig: number): Record<string, number> {
	const a: Record<string, number> = Object.fromEntries(LETTERS.map((l) => [l, 0]));
	for (let i = 0; i < Math.abs(sig); i++) a[sig > 0 ? SHARPS[i] : SHARPS[6 - i]] = sig > 0 ? 1 : -1;
	return a;
}

/** absolute letter index (C4 = 28) → ABC letter with octave marks */
function letter(abs: number): string {
	const o = Math.floor(abs / 7);
	const l = LETTERS[((abs % 7) + 7) % 7];
	return o >= 5 ? l.toLowerCase() + "'".repeat(o - 5) : l + ','.repeat(4 - o);
}

/** a sounding MIDI pitch → the written ABC note (an octave higher, sharps), outside any key signature */
function written(p: number): string {
	const w = p + 12;
	const pc = w % 12;
	const o = Math.floor(w / 12) - 1;
	const NAMES = ['C', '^C', 'D', '^D', 'E', 'F', '^F', 'G', '^G', 'A', '^A', 'B'];
	const n = NAMES[pc];
	const acc = n.startsWith('^') ? '^' : '';
	const l = n.slice(acc.length);
	return acc + (o >= 5 ? l.toLowerCase() + "'".repeat(o - 5) : l + ','.repeat(4 - o));
}

const HEAD = (title: string, key: string, meter = '4/4', tempo = 80, len = '1/8') =>
	['X:1', `T:${title}`, `M:${meter}`, `L:${len}`, `Q:1/4=${tempo}`, 'V:1 clef=treble-8', `K:${key}`].join('\n');

function bars(notes: string[], perBar: number): string {
	const out: string[] = [];
	for (let i = 0; i < notes.length; i += perBar) {
		const chunk = notes.slice(i, i + perBar);
		if (chunk.length < perBar) chunk[chunk.length - 1] += String(perBar - chunk.length + 1);
		out.push(chunk.join(''));
	}
	return out.join(' | ') + ' |]';
}

const RU: Record<string, string> = { C: 'до', D: 'ре', E: 'ми', F: 'фа', G: 'соль', A: 'ля', B: 'си' };
function keyTitle(k: string, mode: string, lang: Lang) {
	if (lang === 'en') return `${k[0]}${k[1] === 'b' ? '♭' : k[1] === '#' ? '♯' : ''} ${mode}`;
	return `${RU[k[0]]}${k[1] === 'b' ? '-бемоль' : k[1] === '#' ? '-диез' : ''} ${mode === 'major' ? 'мажор' : 'минор'}`;
}

/** two octaves up and down from the tonic on the low strings (natural minor for minor keys) */
export function scale(k: string, mode: 'major' | 'minor', lang: Lang = 'ru'): string {
	const name = mode === 'minor' ? `${k}m` : k;
	if (!(name in SIG)) throw new Error(`unknown key ${name}`);
	const t = LETTERS.indexOf(k[0]);
	// sounding tonic: E2–G2 on the 6th string, A2–D3 on the 5th; written an octave higher
	const soundingAbs = t <= 1 ? 21 + t : 14 + t; // C3, D3 / E2 … B2
	const base = soundingAbs + 7;
	const up = Array.from({ length: 15 }, (_, i) => letter(base + i));
	const line = [...up, ...up.slice(0, -1).reverse()];
	const title = lang === 'en' ? `${keyTitle(k, mode, lang)} scale, two octaves` : `Гамма ${keyTitle(k, mode, lang)}, две октавы`;
	return `${HEAD(title, name)}\n${bars(line, 8)}\n`;
}

/** the minor pentatonic in the first box, from the tonic on the 6th string */
export function pentatonic(k: 'A' | 'E' | 'G' | 'D', lang: Lang = 'ru'): string {
	const root = { E: 40, G: 43, A: 45, D: 50 }[k];
	const steps = [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24];
	const up = steps.map((s) => written(root + s));
	const line = [...up, ...up.slice(0, -1).reverse()];
	const title = lang === 'en' ? `${k} minor pentatonic` : `Минорная пентатоника от ${RU[k]}`;
	return `${HEAD(title, 'C')}\n${bars(line, 8)}\n`;
}

/** frets 1-2-3-4 on every string, up and back: finger independence */
export function spider(lang: Lang = 'ru'): string {
	const TUNING = [40, 45, 50, 55, 59, 64];
	const up = TUNING.flatMap((s) => [1, 2, 3, 4].map((f) => written(s + f)));
	const line = [...up, ...[...up].reverse()];
	return `${HEAD(lang === 'en' ? 'The spider: frets 1-2-3-4' : '«Паук»: лады 1-2-3-4', 'C', '4/4', 70, '1/8')}\n${bars(line, 8)}\n`;
}

/** chords strummed down on every beat, `beats` per chord, two times round */
export function progression(names: string[], beats = 4, lang: Lang = 'ru'): string {
	const chords = names.map((n) => {
		const s = shapeByName(n);
		if (!s) throw new Error(`unknown chord ${n}`);
		return `[${pitchesOf(s).map(written).join('')}]`;
	});
	const meter = beats === 3 ? '3/4' : '4/4';
	const perBar = beats === 3 ? 3 : 4;
	const body: string[] = [];
	for (let r = 0; r < 2; r++)
		names.forEach((n, i) => {
			const strokes = Array.from({ length: beats }, (_, b) => (b === 0 ? `"${n}"` : '') + chords[i] + '2');
			for (let b = 0; b < strokes.length; b += perBar) body.push(strokes.slice(b, b + perBar).join(' '));
		});
	const title = (lang === 'en' ? 'Progression ' : 'Прогрессия ') + names.join(' – ');
	return `${HEAD(title, 'C', meter, 90)}\n${body.join(' | ')} |]\n`;
}

export function exerciseAbc(id: string, lang: Lang = 'ru'): string | null {
	const [, kind, a, b] = id.split(':');
	try {
		if (kind === 'scale') return scale(a, b as 'major', lang);
		if (kind === 'penta') return pentatonic(a as 'A', lang);
		if (kind === 'spider') return spider(lang);
		if (kind === 'prog') return progression(a.split('-'), Number(b) || 4, lang);
	} catch {
		return null;
	}
	return null;
}

export function exerciseTitle(id: string, lang: Lang = 'ru'): string {
	return exerciseAbc(id, lang)?.match(/^T:(.+)$/m)?.[1] ?? id;
}
