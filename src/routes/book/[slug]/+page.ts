import { error } from '@sveltejs/kit';
import { chapterBySlug } from '#lib/content/book.js';

export function load({ params }) {
	const found = chapterBySlug(params.slug);
	if (!found) error(404, 'Нет такой главы');
	return found;
}
