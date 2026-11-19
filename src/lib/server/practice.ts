import { and, eq, gte, lte } from 'drizzle-orm';
import type { Db } from './db.js';
import { practiceLog } from './schema.js';
import { InputError } from './settings.js';

const AREAS = ['technique', 'rhythm', 'repertoire', 'theory', 'ear', 'improv', 'reading'];
const isDate = (d: unknown): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d);

/** a practised block: the day (the student's local date), the course, what (lesson:…), minutes */
export function logPractice(db: Db, b: { date?: unknown; area?: unknown; ref?: unknown; minutes?: unknown }) {
	if (!isDate(b.date)) throw new InputError('Дата в виде ГГГГ-ММ-ДД');
	if (!AREAS.includes(String(b.area))) throw new InputError('Неизвестный курс');
	const m = Number(b.minutes);
	if (!Number.isInteger(m) || m < 1 || m > 240) throw new InputError('Минуты 1–240');
	const ref = typeof b.ref === 'string' ? b.ref.slice(0, 120) : null;
	// one record per block a day: marking it again replaces the minutes
	if (ref) db.delete(practiceLog).where(and(eq(practiceLog.date, b.date), eq(practiceLog.ref, ref))).run();
	return db.insert(practiceLog).values({ date: b.date, area: String(b.area), ref, minutes: m }).returning().get();
}

export function unlogPractice(db: Db, date: unknown, ref: unknown) {
	if (!isDate(date) || typeof ref !== 'string') throw new InputError('Дата и блок');
	db.delete(practiceLog).where(and(eq(practiceLog.date, date), eq(practiceLog.ref, ref))).run();
}

const addDays = (d: string, n: number) => {
	const x = new Date(`${d}T12:00:00Z`);
	x.setUTCDate(x.getUTCDate() + n);
	return x.toISOString().slice(0, 10);
};

/** today's records and the last 7 days: minutes per day and per course */
export function practiceSummary(db: Db, today: string) {
	if (!isDate(today)) throw new InputError('Дата в виде ГГГГ-ММ-ДД');
	const from = addDays(today, -6);
	const rows = db.select().from(practiceLog).where(and(gte(practiceLog.date, from), lte(practiceLog.date, today))).all();
	const days = Array.from({ length: 7 }, (_, i) => addDays(from, i)).map((d) => ({ date: d, minutes: rows.filter((r) => r.date === d).reduce((n, r) => n + r.minutes, 0) }));
	const byArea: Record<string, number> = {};
	for (const r of rows) byArea[r.area] = (byArea[r.area] ?? 0) + r.minutes;
	return {
		today: rows.filter((r) => r.date === today).map((r) => ({ ref: r.ref, area: r.area, minutes: r.minutes })),
		days,
		byArea,
		week: rows.reduce((n, r) => n + r.minutes, 0)
	};
}
