import { json } from '@sveltejs/kit';
import { getDb } from '#lib/server/db.js';
import { addSong, listSongs } from '#lib/server/songs.js';
import { InputError } from '#lib/server/settings.js';

export function GET() {
	return json(listSongs(getDb()));
}

export async function POST({ request }) {
	try {
		return json(addSong(getDb(), await request.json()), { status: 201 });
	} catch (e) {
		if (e instanceof InputError) return json({ message: e.message }, { status: 400 });
		throw e;
	}
}
