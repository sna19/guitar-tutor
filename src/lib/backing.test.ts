import { describe, expect, it } from 'vitest';
import { PROGRESSIONS, STYLES } from './backing.js';
import { shapeFor } from './content/chords.js';
import { transposeChord } from './songs.js';

describe('backing tracks', () => {
	it('every chord of every preset, in every key, has a shape', () => {
		for (const p of PROGRESSIONS)
			for (let k = -5; k <= 6; k++)
				for (const c of p.chords.split(' ')) expect(shapeFor(transposeChord(c, k)), `${p.key} ${k} ${c}`).toBeTruthy();
	});
	it('every preset names a known style', () => {
		for (const p of PROGRESSIONS) expect(STYLES.map((s) => s.key)).toContain(p.style);
	});
});
