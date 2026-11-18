import { describe, expect, it } from 'vitest';
import { centsFrom, detectPitch, noteOf } from './pitch.js';

const tone = (hz: number, sr = 44100, n = 4096) => {
	const b = new Float32Array(n);
	// a string: the fundamental and two overtones
	for (let i = 0; i < n; i++) b[i] = 0.5 * Math.sin((2 * Math.PI * hz * i) / sr) + 0.3 * Math.sin((4 * Math.PI * hz * i) / sr) + 0.15 * Math.sin((6 * Math.PI * hz * i) / sr);
	return b;
};

describe('the tuner', () => {
	it('finds the pitch of every open string within 5 cents, and silence is no pitch', () => {
		for (const [hz, name] of [[82.41, 'E2'], [110, 'A2'], [146.83, 'D3'], [196, 'G3'], [246.94, 'B3'], [329.63, 'E4']] as const) {
			const f = detectPitch(tone(hz), 44100)!;
			expect(noteOf(f).name, name).toBe(name);
			expect(Math.abs(centsFrom(f, noteOf(f).midi)), name).toBeLessThanOrEqual(5);
		}
		expect(detectPitch(new Float32Array(4096), 44100)).toBeNull();
	});
	it('says how far off a flat string is', () => {
		const f = detectPitch(tone(108), 44100)!; // A string ~32 cents flat
		expect(noteOf(f).name).toBe('A2');
		expect(centsFrom(f, 45)).toBeLessThan(-25);
	});
});
