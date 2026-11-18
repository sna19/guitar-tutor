import { describe, expect, it } from 'vitest';
import abcjsModule from 'abcjs';
import { exerciseAbc } from './exercises.js';

const abcjs = (abcjsModule as unknown as { default?: typeof abcjsModule }).default ?? abcjsModule;
type Ev = { cmd: string; pitch: number };
const pitches = (abc: string) =>
	(abcjs.parseOnly(abc)[0] as unknown as { setUpAudio: () => { tracks: Ev[][] } }).setUpAudio().tracks.flat().filter((e) => e.cmd === 'note').map((e) => e.pitch);

describe('guitar exercises (they sound an octave below the written notes)', () => {
	it('E minor scale from the open 6th string, G major with F sharp', () => {
		expect(pitches(exerciseAbc('ex:scale:E:minor')!).slice(0, 8)).toEqual([40, 42, 43, 45, 47, 48, 50, 52]);
		expect(pitches(exerciseAbc('ex:scale:G:major')!).slice(0, 8)).toEqual([43, 45, 47, 48, 50, 52, 54, 55]);
		expect(pitches(exerciseAbc('ex:scale:C:major')!)[0]).toBe(48);
	});
	it('the A minor pentatonic from the 5th fret, the spider from F on the 6th string', () => {
		expect(pitches(exerciseAbc('ex:penta:A')!).slice(0, 5)).toEqual([45, 48, 50, 52, 55]);
		expect(pitches(exerciseAbc('ex:spider')!).slice(0, 4)).toEqual([41, 42, 43, 44]);
	});
	it('a progression plays the chord shapes: Am is A2 E3 A3 C4 E4', () => {
		const p = pitches(exerciseAbc('ex:prog:Am-G-F-E:4')!);
		expect(p.slice(0, 5)).toEqual([45, 52, 57, 60, 64]);
		expect(exerciseAbc('ex:prog:Xx:4')).toBeNull();
	});
});
