import { describe, expect, it } from 'vitest';
import { buildPlan } from './dayplan.js';
import { LESSONS, lessonsOf } from './content/program.js';

const sum = (b: { minutes: number }[]) => b.reduce((n, x) => n + x.minutes, 0);

describe('the day plan', () => {
	it('fills exactly the chosen minutes with lessons of the level', () => {
		const ls = lessonsOf(3, ['classical', 'spanish', 'rock', 'blues']);
		for (const m of [15, 30, 45, 60, 90]) {
			const p = buildPlan(ls, {}, m, '2026-11-18');
			expect(sum(p), String(m)).toBe(m);
			for (const b of p) expect(b.lesson!.level).toBe(3);
		}
	});
	it('a short session keeps warm-up, rhythm and repertoire; a long one adds theory and improvisation', () => {
		const ls = lessonsOf(3, ['classical', 'rock', 'blues']);
		expect(buildPlan(ls, {}, 15, '2026-11-18').map((b) => b.area).sort()).toEqual(['repertoire', 'rhythm', 'technique']);
		expect(buildPlan(ls, {}, 60, '2026-11-18').map((b) => b.area)).toContain('improv');
	});
	it('lessons «в работе» come first; the plan is the same all day', () => {
		const ls = lessonsOf(2, ['classical', 'rock', 'blues']);
		const progress = { 'lesson:l2-first-pieces': 'learning' };
		const a = buildPlan(ls, progress, 45, '2026-11-18');
		expect(a.find((b) => b.area === 'repertoire')!.lesson!.id).toBe('l2-first-pieces');
		expect(buildPlan(ls, progress, 45, '2026-11-18')).toEqual(a);
		expect(LESSONS.length).toBeGreaterThan(0);
	});
});
