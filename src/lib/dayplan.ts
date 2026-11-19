/**
 * Today's session: the chosen minutes split into blocks by course — warm-up (technique), rhythm and songs,
 * repertoire, theory or ear, improvisation — each block a lesson of the student's level: first the ones «в работе»,
 * then the next not done, then any of the level. The same plan all day (seeded by the date).
 */
import type { Area, Lesson } from './content/program.js';

export interface Block {
	area: Area;
	minutes: number;
	lesson: Lesson | null;
}

/** share of the session per course; a course with no lesson gives its time to the rest */
const SHARE: { area: Area; share: number }[] = [
	{ area: 'technique', share: 0.2 },
	{ area: 'rhythm', share: 0.25 },
	{ area: 'repertoire', share: 0.3 },
	{ area: 'theory', share: 0.1 },
	{ area: 'ear', share: 0.05 },
	{ area: 'improv', share: 0.1 }
];

function seeded(date: string) {
	let h = 7;
	for (const c of date) h = (h * 31 + c.charCodeAt(0)) >>> 0;
	return () => {
		h = (h * 1103515245 + 12345) >>> 0;
		return h / 2 ** 32;
	};
}

export function buildPlan(lessons: Lesson[], progress: Record<string, string>, minutes: number, date: string, fallback: Lesson[] = []): Block[] {
	const rnd = seeded(date);
	const pick = (area: Area): Lesson | null => {
		const of = lessons.filter((l) => l.area === area);
		const learning = of.filter((l) => progress[`lesson:${l.id}`] === 'learning');
		const fresh = of.filter((l) => !progress[`lesson:${l.id}`]);
		const pool = learning.length ? learning : fresh.length ? fresh.slice(0, 1) : of.length ? of : fallback.filter((l) => l.area === area);
		return pool.length ? pool[Math.floor(rnd() * pool.length)] : null;
	};
	const chosen = SHARE.map((s) => ({ ...s, lesson: pick(s.area) })).filter((s) => s.lesson);
	// short sessions keep the most important courses only
	const keep = minutes <= 15 ? chosen.filter((s) => ['technique', 'rhythm', 'repertoire'].includes(s.area)) : minutes <= 30 ? chosen.filter((s) => s.area !== 'ear') : chosen;
	const list = keep.length ? keep : chosen;
	const total = list.reduce((n, s) => n + s.share, 0);
	// whole minutes, at least 3 each, the rounding remainder to the repertoire (or the longest block)
	const blocks = list.map((s) => ({ area: s.area, lesson: s.lesson, minutes: Math.max(3, Math.round((minutes * s.share) / total)) }));
	const diff = minutes - blocks.reduce((n, b) => n + b.minutes, 0);
	const main = blocks.find((b) => b.area === 'repertoire') ?? blocks.reduce((a, b) => (b.minutes > a.minutes ? b : a), blocks[0]);
	if (main) main.minutes = Math.max(3, main.minutes + diff);
	return blocks;
}
