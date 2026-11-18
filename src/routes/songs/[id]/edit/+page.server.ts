import { error } from '@sveltejs/kit';
import { getDb } from '#lib/server/db.js';
import { getSong } from '#lib/server/songs.js';

export function load({ params }) {
	const song = getSong(getDb(), Number(params.id));
	if (!song) error(404, 'Нет такой песни');
	return { song };
}
