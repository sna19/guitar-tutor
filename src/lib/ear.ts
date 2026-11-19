/**
 * Ear training questions: intervals, chord qualities, open strings. Each question — what to play (MIDI pitches,
 * together or one after another), the answer and the choices.
 */
import type { L10n } from './i18n.js';

export type Mode = 'interval' | 'chord' | 'string';

export interface Question {
	notes: number[];
	together: boolean;
	answer: string;
	choices: { key: string; label: L10n }[];
}

export const INTERVALS: { key: string; semis: number; label: L10n; level: number }[] = [
	{ key: 'm2', semis: 1, label: { ru: 'малая секунда', en: 'minor 2nd' }, level: 2 },
	{ key: 'M2', semis: 2, label: { ru: 'большая секунда', en: 'major 2nd' }, level: 2 },
	{ key: 'm3', semis: 3, label: { ru: 'малая терция', en: 'minor 3rd' }, level: 1 },
	{ key: 'M3', semis: 4, label: { ru: 'большая терция', en: 'major 3rd' }, level: 1 },
	{ key: 'P4', semis: 5, label: { ru: 'кварта', en: 'perfect 4th' }, level: 1 },
	{ key: 'TT', semis: 6, label: { ru: 'тритон', en: 'tritone' }, level: 3 },
	{ key: 'P5', semis: 7, label: { ru: 'квинта', en: 'perfect 5th' }, level: 1 },
	{ key: 'm6', semis: 8, label: { ru: 'малая секста', en: 'minor 6th' }, level: 3 },
	{ key: 'M6', semis: 9, label: { ru: 'большая секста', en: 'major 6th' }, level: 2 },
	{ key: 'm7', semis: 10, label: { ru: 'малая септима', en: 'minor 7th' }, level: 3 },
	{ key: 'M7', semis: 11, label: { ru: 'большая септима', en: 'major 7th' }, level: 3 },
	{ key: 'P8', semis: 12, label: { ru: 'октава', en: 'octave' }, level: 1 }
];

export const CHORDS: { key: string; steps: number[]; label: L10n; level: number }[] = [
	{ key: 'maj', steps: [0, 4, 7, 12], label: { ru: 'мажор', en: 'major' }, level: 1 },
	{ key: 'min', steps: [0, 3, 7, 12], label: { ru: 'минор', en: 'minor' }, level: 1 },
	{ key: '7', steps: [0, 4, 7, 10], label: { ru: 'доминантсептаккорд (7)', en: 'dominant 7th' }, level: 2 },
	{ key: 'm7', steps: [0, 3, 7, 10], label: { ru: 'минорный септаккорд (m7)', en: 'minor 7th' }, level: 3 },
	{ key: 'maj7', steps: [0, 4, 7, 11], label: { ru: 'большой мажорный (maj7)', en: 'major 7th' }, level: 3 }
];

export const STRINGS = [
	{ key: '6', midi: 40, label: { ru: '6 — ми (E)', en: '6 — E' } },
	{ key: '5', midi: 45, label: { ru: '5 — ля (A)', en: '5 — A' } },
	{ key: '4', midi: 50, label: { ru: '4 — ре (D)', en: '4 — D' } },
	{ key: '3', midi: 55, label: { ru: '3 — соль (G)', en: '3 — G' } },
	{ key: '2', midi: 59, label: { ru: '2 — си (B)', en: '2 — B' } },
	{ key: '1', midi: 64, label: { ru: '1 — ми (E)', en: '1 — E' } }
];

/** a question at a difficulty (1 — the easiest set, 3 — everything); `rnd` for tests */
export function question(mode: Mode, difficulty: number, rnd: () => number = Math.random): Question {
	const pick = <T>(xs: T[]) => xs[Math.floor(rnd() * xs.length)];
	if (mode === 'interval') {
		const set = INTERVALS.filter((i) => i.level <= difficulty);
		const iv = pick(set);
		const low = 45 + Math.floor(rnd() * 12);
		return { notes: [low, low + iv.semis], together: difficulty >= 3 && rnd() < 0.5, answer: iv.key, choices: set.map((i) => ({ key: i.key, label: i.label })) };
	}
	if (mode === 'chord') {
		const set = CHORDS.filter((c) => c.level <= difficulty);
		const ch = pick(set);
		const root = 45 + Math.floor(rnd() * 10);
		return { notes: ch.steps.map((s) => root + s), together: true, answer: ch.key, choices: set.map((c) => ({ key: c.key, label: c.label })) };
	}
	const s = pick(STRINGS);
	return { notes: [s.midi], together: true, answer: s.key, choices: STRINGS.map((x) => ({ key: x.key, label: x.label })) };
}
