import { json } from '@sveltejs/kit';
import { getDb } from '#lib/server/db.js';
import { removeSong, updateSong } from '#lib/server/songs.js';
import { InputError } from '#lib/server/settings.js';

export async function PATCH({ params, request }) {
	try {
		return json(updateSong(getDb(), Number(params.id), await request.json()));
	} catch (e) {
		if (e instanceof InputError) return json({ message: e.message }, { status: 400 });
		throw e;
	}
}

export function DELETE({ params }) {
	removeSong(getDb(), Number(params.id));
	return json({ ok: true });
}
