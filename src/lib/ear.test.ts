import { describe, expect, it } from 'vitest';
import { question, INTERVALS } from './ear.js';

const seq = (...xs: number[]) => {
	let i = 0;
	return () => xs[i++ % xs.length];
};

describe('ear training', () => {
	it('an interval question plays its interval and the answer is among the choices', () => {
		for (let k = 0; k < 50; k++) {
			const q = question('interval', 3);
			const iv = INTERVALS.find((i) => i.key === q.answer)!;
			expect(q.notes[1] - q.notes[0]).toBe(iv.semis);
			expect(q.choices.map((c) => c.key)).toContain(q.answer);
		}
	});
	it('the easy level asks only thirds, fourth, fifth, octave; chords at level 1 are major or minor', () => {
		expect(question('interval', 1, seq(0.99, 0)).choices.map((c) => c.key)).toEqual(['m3', 'M3', 'P4', 'P5', 'P8']);
		const c = question('chord', 1, seq(0.6, 0));
		expect(c.answer).toBe('min');
		expect(c.notes).toEqual([45, 48, 52, 57]);
		expect(question('string', 1, seq(0)).notes).toEqual([40]);
	});
});
