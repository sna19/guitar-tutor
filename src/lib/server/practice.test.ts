import { describe, expect, it } from 'vitest';
import { openDb } from './db.js';
import { logPractice, practiceSummary, unlogPractice } from './practice.js';

describe('practice log', () => {
	it('logs blocks, replaces a block marked again, sums the week', () => {
		const { db } = openDb(':memory:');
		logPractice(db, { date: '2026-11-18', area: 'rhythm', ref: 'lesson:l1-first-chords', minutes: 10 });
		logPractice(db, { date: '2026-11-18', area: 'rhythm', ref: 'lesson:l1-first-chords', minutes: 12 });
		logPractice(db, { date: '2026-11-15', area: 'technique', ref: 'lesson:l1-posture', minutes: 6 });
		logPractice(db, { date: '2026-11-10', area: 'technique', ref: 'lesson:l1-posture', minutes: 30 });
		const s = practiceSummary(db, '2026-11-18');
		expect(s.today).toEqual([{ ref: 'lesson:l1-first-chords', area: 'rhythm', minutes: 12 }]);
		expect(s.week).toBe(18);
		expect(s.days.map((d) => d.minutes)).toEqual([0, 0, 0, 6, 0, 0, 12]);
		expect(s.byArea).toEqual({ rhythm: 12, technique: 6 });
		unlogPractice(db, '2026-11-18', 'lesson:l1-first-chords');
		expect(practiceSummary(db, '2026-11-18').today).toEqual([]);
		expect(() => logPractice(db, { date: 'x', area: 'rhythm', minutes: 5 })).toThrow();
	});
});
