import { describe, expect, it } from 'vitest';
import { LESSONS } from './program.js';
import { PIECES } from './pieces.js';
import { exerciseAbc } from './exercises.js';
import { shapeByName } from './chords.js';

describe('the guitar program', () => {
	it('every level has lessons', () => {
		for (let n = 1; n <= 8; n++) expect(LESSONS.filter((l) => l.level === n).length, `level ${n}`).toBeGreaterThanOrEqual(2);
	});
	it('ids are unique, both languages filled, every material exists', () => {
		expect(new Set(LESSONS.map((l) => l.id)).size).toBe(LESSONS.length);
		for (const l of LESSONS) {
			for (const x of [l.title, l.goal, l.done, ...l.tasks]) expect(x.ru && x.en, l.id).toBeTruthy();
			for (const m of l.materials) {
				if (m.startsWith('piece:')) expect(PIECES.some((p) => p.id === m.slice(6)), `${l.id}: ${m}`).toBe(true);
				else if (m.startsWith('chord:')) expect(shapeByName(m.slice(6)), `${l.id}: ${m}`).toBeTruthy();
				else expect(exerciseAbc(m), `${l.id}: ${m}`).not.toBeNull();
			}
		}
	});
});
