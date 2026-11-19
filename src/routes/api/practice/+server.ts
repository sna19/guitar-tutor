import { json } from '@sveltejs/kit';
import { getDb } from '#lib/server/db.js';
import { logPractice, practiceSummary, unlogPractice } from '#lib/server/practice.js';
import { InputError } from '#lib/server/settings.js';

const wrap = async (f: () => unknown) => {
	try {
		return json(await f());
	} catch (e) {
		if (e instanceof InputError) return json({ message: e.message }, { status: 400 });
		throw e;
	}
};

/** GET ?today=YYYY-MM-DD — today's blocks and the week */
export const GET = ({ url }) => wrap(() => practiceSummary(getDb(), url.searchParams.get('today') ?? ''));
/** POST { date, area, ref, minutes } — a block done */
export const POST = ({ request }) => wrap(async () => logPractice(getDb(), await request.json()));
/** DELETE { date, ref } — not done after all */
export const DELETE = ({ request }) => wrap(async () => {
	const b = await request.json();
	unlogPractice(getDb(), b.date, b.ref);
	return { ok: true };
});
