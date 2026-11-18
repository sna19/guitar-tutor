/**
 * Guitar chord shapes: frets from the 6th (low E) to the 1st string; -1 — not played, 0 — open. `barre` — the
 * fret held by the index finger across `from`–6 strings. Sounding pitches follow the standard tuning.
 */
export const TUNING = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4

export type Group = 'open' | 'seventh' | 'sus' | 'barre' | 'power';

export interface Shape {
	name: string;
	frets: number[];
	fingers?: number[];
	barre?: { fret: number; from: number };
	group: Group;
}

export const GROUPS: { key: Group; ru: string; en: string }[] = [
	{ key: 'open', ru: 'Открытые', en: 'Open' },
	{ key: 'seventh', ru: 'Септаккорды', en: 'Sevenths' },
	{ key: 'sus', ru: 'sus и add', en: 'sus and add' },
	{ key: 'barre', ru: 'Баррэ', en: 'Barre' },
	{ key: 'power', ru: 'Пауэр-аккорды', en: 'Power chords' }
];

const S = (group: Group, name: string, frets: number[], fingers?: number[], barre?: Shape['barre']): Shape => ({ name, frets, fingers, barre, group });

export const SHAPES: Shape[] = [
	S('open', 'Em', [0, 2, 2, 0, 0, 0], [0, 2, 3, 0, 0, 0]),
	S('open', 'E', [0, 2, 2, 1, 0, 0], [0, 2, 3, 1, 0, 0]),
	S('open', 'Am', [-1, 0, 2, 2, 1, 0], [0, 0, 2, 3, 1, 0]),
	S('open', 'A', [-1, 0, 2, 2, 2, 0], [0, 0, 1, 2, 3, 0]),
	S('open', 'Dm', [-1, -1, 0, 2, 3, 1], [0, 0, 0, 2, 3, 1]),
	S('open', 'D', [-1, -1, 0, 2, 3, 2], [0, 0, 0, 1, 3, 2]),
	S('open', 'C', [-1, 3, 2, 0, 1, 0], [0, 3, 2, 0, 1, 0]),
	S('open', 'G', [3, 2, 0, 0, 0, 3], [2, 1, 0, 0, 0, 3]),
	S('seventh', 'E7', [0, 2, 0, 1, 0, 0], [0, 2, 0, 1, 0, 0]),
	S('seventh', 'A7', [-1, 0, 2, 0, 2, 0], [0, 0, 2, 0, 3, 0]),
	S('seventh', 'D7', [-1, -1, 0, 2, 1, 2], [0, 0, 0, 2, 1, 3]),
	S('seventh', 'G7', [3, 2, 0, 0, 0, 1], [3, 2, 0, 0, 0, 1]),
	S('seventh', 'C7', [-1, 3, 2, 3, 1, 0], [0, 3, 2, 4, 1, 0]),
	S('seventh', 'B7', [-1, 2, 1, 2, 0, 2], [0, 2, 1, 3, 0, 4]),
	S('seventh', 'Am7', [-1, 0, 2, 0, 1, 0], [0, 0, 2, 0, 1, 0]),
	S('seventh', 'Em7', [0, 2, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0]),
	S('seventh', 'Dm7', [-1, -1, 0, 2, 1, 1], [0, 0, 0, 2, 1, 1]),
	S('seventh', 'Cmaj7', [-1, 3, 2, 0, 0, 0], [0, 3, 2, 0, 0, 0]),
	S('seventh', 'Fmaj7', [-1, -1, 3, 2, 1, 0], [0, 0, 3, 2, 1, 0]),
	S('sus', 'Asus2', [-1, 0, 2, 2, 0, 0], [0, 0, 1, 2, 0, 0]),
	S('sus', 'Asus4', [-1, 0, 2, 2, 3, 0], [0, 0, 1, 2, 3, 0]),
	S('sus', 'Dsus2', [-1, -1, 0, 2, 3, 0], [0, 0, 0, 1, 3, 0]),
	S('sus', 'Dsus4', [-1, -1, 0, 2, 3, 3], [0, 0, 0, 1, 3, 4]),
	S('sus', 'Cadd9', [-1, 3, 2, 0, 3, 0], [0, 2, 1, 0, 3, 0]),
	S('sus', 'Esus4', [0, 2, 2, 2, 0, 0], [0, 2, 3, 4, 0, 0]),
	S('barre', 'F', [1, 3, 3, 2, 1, 1], [1, 3, 4, 2, 1, 1], { fret: 1, from: 1 }),
	S('barre', 'Fm', [1, 3, 3, 1, 1, 1], [1, 3, 4, 1, 1, 1], { fret: 1, from: 1 }),
	S('barre', 'F#m', [2, 4, 4, 2, 2, 2], [1, 3, 4, 1, 1, 1], { fret: 2, from: 1 }),
	S('barre', 'Gm', [3, 5, 5, 3, 3, 3], [1, 3, 4, 1, 1, 1], { fret: 3, from: 1 }),
	S('barre', 'Bm', [-1, 2, 4, 4, 3, 2], [0, 1, 3, 4, 2, 1], { fret: 2, from: 1 }),
	S('barre', 'B', [-1, 2, 4, 4, 4, 2], [0, 1, 2, 3, 4, 1], { fret: 2, from: 1 }),
	S('barre', 'Bb', [-1, 1, 3, 3, 3, 1], [0, 1, 2, 3, 4, 1], { fret: 1, from: 1 }),
	S('barre', 'Cm', [-1, 3, 5, 5, 4, 3], [0, 1, 3, 4, 2, 1], { fret: 3, from: 1 }),
	S('barre', 'C#m', [-1, 4, 6, 6, 5, 4], [0, 1, 3, 4, 2, 1], { fret: 4, from: 1 }),
	S('barre', 'B7 (баррэ)', [-1, 2, 4, 2, 4, 2], [0, 1, 3, 1, 4, 1], { fret: 2, from: 1 }),
	S('power', 'E5', [0, 2, 2, -1, -1, -1], [0, 1, 2, 0, 0, 0]),
	S('power', 'A5', [-1, 0, 2, 2, -1, -1], [0, 0, 1, 2, 0, 0]),
	S('power', 'D5', [-1, -1, 0, 2, 3, -1], [0, 0, 0, 1, 2, 0]),
	S('power', 'G5', [3, 5, 5, -1, -1, -1], [1, 3, 4, 0, 0, 0]),
	S('power', 'C5', [-1, 3, 5, 5, -1, -1], [0, 1, 3, 4, 0, 0]),
	S('power', 'F5', [1, 3, 3, -1, -1, -1], [1, 3, 4, 0, 0, 0])
];

export const shapeByName = (n: string) => SHAPES.find((s) => s.name === n);

/** sounding MIDI pitches of a shape, low string first */
export const pitchesOf = (s: Shape) => s.frets.map((f, i) => (f < 0 ? -1 : TUNING[i] + f)).filter((p) => p >= 0);
