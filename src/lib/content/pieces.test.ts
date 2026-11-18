import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import abcjsModule from 'abcjs';
import { PIECES, keyName } from './pieces.js';

const abcjs = (abcjsModule as unknown as { default?: typeof abcjsModule }).default ?? abcjsModule;
const root = new URL('./pieces/', import.meta.url).pathname;

describe('the pieces', () => {
	it('every catalog entry has its notes and every file is in the catalog', () => {
		const files = ['classical'].flatMap((d) => readdirSync(root + d).map((f) => f.replace(/\.abc$/, '')));
		expect(files.sort()).toEqual(PIECES.map((p) => p.id).sort());
	});
	it('every piece parses, plays its notes, is in guitar range and has a license', () => {
		for (const p of PIECES) {
			const abc = readFileSync(`${root}classical/${p.id}.abc`, 'utf8');
			expect(abc, p.id).toContain('clef=treble-8');
			const tune = abcjs.parseOnly(abc)[0] as unknown as { warnings?: string[]; setUpAudio: () => { tracks: { cmd: string; pitch: number }[][] } };
			expect(tune.warnings ?? [], p.id).toEqual([]);
			const notes = tune.setUpAudio().tracks.flat().filter((e) => e.cmd === 'note');
			// a low string tuned to D … harmonics up to F#6, as it sounds
			expect(Math.min(...notes.map((n) => n.pitch)), p.id).toBeGreaterThanOrEqual(38);
			expect(Math.max(...notes.map((n) => n.pitch)), p.id).toBeLessThanOrEqual(90);
			expect(p.source.license, p.id).toMatch(/Public Domain|Creative Commons/);
		}
	});
	it('names keys in both languages', () => {
		expect(keyName('Em')).toBe('ми минор');
		expect(keyName('Em', 'en')).toBe('E minor');
	});
});
