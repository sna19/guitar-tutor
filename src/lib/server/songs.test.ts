import { describe, expect, it } from 'vitest';
import { openDb } from './db.js';
import { addSong, getSong, listSongs, removeSong, updateSong } from './songs.js';

describe('my songs', () => {
	it('adds, edits, lists and removes; checks the fields', () => {
		const { db } = openDb(':memory:');
		const s = addSong(db, { title: 'Песня', artist: 'Группа', sheet: 'Am C\nслова' });
		expect(s.tempo).toBe(90);
		updateSong(db, s.id, { capo: 2, tempo: 120, pattern: 'D-D-D-D-' });
		expect(getSong(db, s.id)).toMatchObject({ capo: 2, tempo: 120, pattern: 'D-D-D-D-' });
		expect(() => addSong(db, { title: '', sheet: 'x' })).toThrow();
		expect(() => updateSong(db, s.id, { pattern: 'abc' })).toThrow();
		expect(listSongs(db)).toHaveLength(1);
		removeSong(db, s.id);
		expect(listSongs(db)).toHaveLength(0);
	});
});
