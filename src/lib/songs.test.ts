import { describe, expect, it } from 'vitest';
import { chordsOf, isChord, isChordLine, parseSheet, sequenceOf, transposeChord, transposeLines } from './songs.js';

describe('song sheets', () => {
	it('recognises chord symbols and chord lines', () => {
		for (const c of ['Am', 'C', 'F#m', 'Bb', 'G7', 'Cmaj7', 'Dsus4', 'Asus2', 'Em7', 'D/F#', 'Hm', 'E5', 'Cadd9', 'Bdim']) expect(isChord(c), c).toBe(true);
		for (const w of ['Ах', 'Мама', 'And', 'Cat', 'Go', 'Bad']) expect(isChord(w), w).toBe(false);
		expect(isChordLine('Am      C    Dm   G')).toBe(true);
		expect(isChordLine('Am C Dm G x2')).toBe(true);
		expect(isChordLine('Вот новый поворот')).toBe(false);
	});
	it('puts chords over the words at their columns', () => {
		const lines = parseSheet('Куплет 1:\nAm        C\nСлова первой строки\n\nПрипев:\n[Dm]Ещё [G]строка');
		expect(lines[0]).toEqual({ kind: 'section', title: 'Куплет 1' });
		expect(lines[1]).toEqual({ kind: 'lyrics', segments: [{ chord: 'Am', text: 'Слова перв' }, { chord: 'C', text: 'ой строки' }] });
		expect(lines[4]).toEqual({ kind: 'lyrics', segments: [{ chord: 'Dm', text: 'Ещё ' }, { chord: 'G', text: 'строка' }] });
		expect(chordsOf(lines)).toEqual(['Am', 'C', 'Dm', 'G']);
	});
	it('a chord line with nothing under it stays a line of chords (an intro)', () => {
		const lines = parseSheet('Вступление:\nAm F C G\n\nAm\nслова');
		expect(lines[1]).toEqual({ kind: 'chords', chords: ['Am', 'F', 'C', 'G'] });
		expect(sequenceOf(lines)).toEqual(['Am', 'F', 'C', 'G', 'Am']);
	});
	it('transposes, with the bass and H', () => {
		expect(transposeChord('Am', 2)).toBe('Bm');
		expect(transposeChord('D/F#', -2)).toBe('C/E');
		expect(transposeChord('Hm', 1)).toBe('Cm');
		expect(transposeChord('F#m7', 1, true)).toBe('Gm7');
		const t = transposeLines(parseSheet('Am C\nтекст тут'), 3);
		expect(chordsOf(t)).toEqual(['Cm', 'D#']);
	});
});

import { FOLK, RUSSIAN_ROCK } from './content/songbook.js';
import { shapeFor } from './content/chords.js';
describe('the songbook', () => {
	it('every chord of the folk songs has a shape; the rock list has no words or chords', () => {
		for (const f of FOLK) for (const c of chordsOf(parseSheet(f.sheet))) expect(shapeFor(c), `${f.slug}: ${c}`).toBeTruthy();
		for (const r of RUSSIAN_ROCK) expect(Object.keys(r).sort()).toEqual(['artist', 'decade', 'title']);
	});
});
