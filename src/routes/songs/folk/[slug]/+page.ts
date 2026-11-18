import { error } from '@sveltejs/kit';
import { FOLK } from '#lib/content/songbook.js';

export function load({ params }) {
	const song = FOLK.find((f) => f.slug === params.slug);
	if (!song) error(404, 'Нет такой песни');
	return { song };
}
