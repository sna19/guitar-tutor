import { describe, expect, it } from 'vitest';
import { BOOK } from './book.js';
import { pieceById } from './pieces.js';
import { lessonById } from './program.js';
import { exerciseAbc } from './exercises.js';
import { shapeFor } from './chords.js';
import { COMPAS, PROGRESSIONS } from '../backing.js';

describe('the textbook', () => {
	it('every live block points to something that exists, both languages filled', () => {
		const slugs = new Set<string>();
		for (const part of BOOK)
			for (const ch of part.chapters) {
				expect(slugs.has(ch.slug), ch.slug).toBe(false);
				slugs.add(ch.slug);
				expect(ch.title.ru && ch.title.en).toBeTruthy();
				for (const b of ch.blocks) {
					if ('p' in b) expect(b.p.ru && b.p.en, ch.slug).toBeTruthy();
					if ('chords' in b) for (const c of b.chords) expect(shapeFor(c), `${ch.slug} ${c}`).toBeTruthy();
					if ('ex' in b) expect(exerciseAbc(b.ex), `${ch.slug} ${b.ex}`).not.toBeNull();
					if ('piece' in b) expect(pieceById(b.piece), `${ch.slug} ${b.piece}`).toBeTruthy();
					if ('lesson' in b) expect(lessonById(b.lesson), `${ch.slug} ${b.lesson}`).toBeTruthy();
					if ('jam' in b) expect(PROGRESSIONS.some((p) => p.key === b.jam), `${ch.slug} ${b.jam}`).toBe(true);
					if ('compas' in b) expect(COMPAS.some((c) => c.key === b.compas), `${ch.slug} ${b.compas}`).toBe(true);
				}
			}
	});
});
