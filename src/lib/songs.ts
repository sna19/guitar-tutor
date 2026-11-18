/**
 * Song sheets: text with chords — either chords on their own line above the words (as on most chord sites) or
 * ChordPro-style [Am] inside the words. Parsed into lines of segments (a chord and the text under it), transposed,
 * and the song's chords listed for the diagrams and the accompaniment.
 */

const ROOTS_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const ROOTS_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11, H: 11 };

/** A chord symbol: root (with ♯/♭; H = B as in Russian songbooks), quality, optional bass. */
const CHORD = /^([A-H])([#b]?)((?:m(?!aj)|min|maj|dim|aug|sus|add|M|\+|°|ø|\d|\(|\)|\/(?![A-H])|-)*)(?:\/([A-H])([#b]?))?$/;

export function isChord(token: string): boolean {
	return CHORD.test(token);
}

/** a line made of chords only (and bar marks, repeats like «x2», dashes) */
export function isChordLine(line: string): boolean {
	const tokens = line.trim().split(/\s+/).filter((t) => t && !/^(\||\|\||-+|x\d+|×\d+|\(?x\d+\)?|:\|\||\|\|:|%)$/i.test(t));
	return tokens.length > 0 && tokens.every((t) => isChord(t.replace(/[(),]/g, '')));
}

export function transposeChord(chord: string, steps: number, flats = false): string {
	const m = chord.match(CHORD);
	if (!m) return chord;
	const [, r, acc, q, br, bacc] = m;
	const move = (root: string, a: string) => {
		const pc = (PC[root] + (a === '#' ? 1 : a === 'b' ? -1 : 0) + steps + 120) % 12;
		return (flats ? ROOTS_FLAT : ROOTS_SHARP)[pc];
	};
	return move(r, acc) + q + (br ? '/' + move(br, bacc) : '');
}

export interface Segment {
	chord: string | null;
	text: string;
}
export type Line = { kind: 'lyrics'; segments: Segment[] } | { kind: 'chords'; chords: string[] } | { kind: 'section'; title: string } | { kind: 'blank' };

/** a chord line over a text line → segments, cutting the text at the chords' columns */
function merge(chordLine: string, text: string): Segment[] {
	const marks: { col: number; chord: string }[] = [];
	for (const m of chordLine.matchAll(/\S+/g)) if (isChord(m[0].replace(/[(),]/g, ''))) marks.push({ col: m.index!, chord: m[0].replace(/[(),]/g, '') });
	const segs: Segment[] = [];
	if (!marks.length || marks[0].col > 0) segs.push({ chord: null, text: text.slice(0, marks[0]?.col ?? text.length) });
	marks.forEach((mk, i) => {
		const end = marks[i + 1]?.col ?? Math.max(text.length, mk.col);
		segs.push({ chord: mk.chord, text: text.slice(mk.col, end) });
	});
	return segs.filter((s) => s.chord || s.text);
}

export function parseSheet(src: string): Line[] {
	const raw = src.replace(/\r/g, '').replace(/\t/g, '    ').split('\n');
	const out: Line[] = [];
	for (let i = 0; i < raw.length; i++) {
		const line = raw[i].replace(/\s+$/, '');
		if (!line.trim()) {
			out.push({ kind: 'blank' });
			continue;
		}
		// [Verse], Припев:, Куплет 1:
		const sec = line.trim().match(/^\[?((?:куплет|припев|вступление|проигрыш|кода|бридж|соло|verse|chorus|intro|outro|bridge|solo|interlude)[^\]:]*)\]?:?$/i);
		if (sec) {
			out.push({ kind: 'section', title: sec[1].trim() });
			continue;
		}
		if (isChordLine(line)) {
			const next = raw[i + 1]?.replace(/\s+$/, '');
			if (next && next.trim() && !isChordLine(next) && !/^\[?(куплет|припев|verse|chorus)/i.test(next.trim())) {
				out.push({ kind: 'lyrics', segments: merge(line, next) });
				i++;
			} else out.push({ kind: 'chords', chords: line.trim().split(/\s+/).map((t) => t.replace(/[(),]/g, '')).filter(isChord) });
			continue;
		}
		// ChordPro: [Am]words
		if (/\[[A-H][^\]]*\]/.test(line)) {
			const segs: Segment[] = [];
			const re = /\[([^\]]+)\]/g;
			let last = 0;
			let chord: string | null = null;
			for (const m of line.matchAll(re)) {
				if (!isChord(m[1])) continue;
				if (m.index! > last || chord) segs.push({ chord, text: line.slice(last, m.index) });
				chord = m[1];
				last = m.index! + m[0].length;
			}
			segs.push({ chord, text: line.slice(last) });
			out.push({ kind: 'lyrics', segments: segs.filter((s) => s.chord || s.text) });
			continue;
		}
		out.push({ kind: 'lyrics', segments: [{ chord: null, text: line }] });
	}
	return out;
}

/** every chord of the sheet in order of first use */
export function chordsOf(lines: Line[]): string[] {
	const seen: string[] = [];
	for (const l of lines) {
		const cs = l.kind === 'chords' ? l.chords : l.kind === 'lyrics' ? l.segments.map((s) => s.chord).filter((c): c is string => !!c) : [];
		for (const c of cs) if (!seen.includes(c)) seen.push(c);
	}
	return seen;
}

/** the chords in playing order (for the accompaniment) */
export function sequenceOf(lines: Line[]): string[] {
	return lines.flatMap((l) => (l.kind === 'chords' ? l.chords : l.kind === 'lyrics' ? l.segments.map((s) => s.chord).filter((c): c is string => !!c) : []));
}

export function transposeLines(lines: Line[], steps: number, flats = false): Line[] {
	if (!steps) return lines;
	return lines.map((l) =>
		l.kind === 'chords'
			? { kind: 'chords', chords: l.chords.map((c) => transposeChord(c, steps, flats)) }
			: l.kind === 'lyrics'
				? { kind: 'lyrics', segments: l.segments.map((s) => ({ ...s, chord: s.chord && transposeChord(s.chord, steps, flats) })) }
				: l
	);
}

/** «H» of Russian songbooks is B */
export const normalizeChord = (c: string) => c.replace(/^H/, 'B').replace(/\/H/, '/B');
