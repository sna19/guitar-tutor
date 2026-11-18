/**
 * Pitch of a plucked string from the microphone: autocorrelation over a window (fine for a single guitar note,
 * 70–1000 Hz), with parabolic interpolation of the best lag. Returns Hz or null for silence / no clear pitch.
 */
export function detectPitch(buf: Float32Array, sampleRate: number): number | null {
	let rms = 0;
	for (const x of buf) rms += x * x;
	rms = Math.sqrt(rms / buf.length);
	if (rms < 0.01) return null;
	const minLag = Math.floor(sampleRate / 1000);
	const maxLag = Math.floor(sampleRate / 70);
	let best = -1;
	let bestCorr = 0;
	const corr = new Float32Array(maxLag + 2);
	for (let lag = minLag; lag <= maxLag + 1; lag++) {
		let s = 0;
		for (let i = 0; i + lag < buf.length; i++) s += buf[i] * buf[i + lag];
		corr[lag] = s;
	}
	// the first strong peak after the correlation has dipped — avoids octave errors
	let dipped = false;
	const top = Math.max(...corr.slice(minLag));
	for (let lag = minLag + 1; lag <= maxLag; lag++) {
		if (!dipped && corr[lag] < corr[lag - 1]) continue;
		dipped = true;
		if (corr[lag] > bestCorr && corr[lag] >= corr[lag - 1] && corr[lag] >= corr[lag + 1] && corr[lag] > top * 0.8) {
			bestCorr = corr[lag];
			best = lag;
			break;
		}
	}
	if (best < 0) return null;
	const a = corr[best - 1];
	const b = corr[best];
	const c = corr[best + 1];
	const shift = (a - c) / (2 * (a - 2 * b + c) || 1);
	return sampleRate / (best + shift);
}

const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/** Hz → the nearest note, its MIDI number and how far off in cents */
export function noteOf(hz: number) {
	const midi = 69 + 12 * Math.log2(hz / 440);
	const n = Math.round(midi);
	return { midi: n, name: `${NAMES[((n % 12) + 12) % 12]}${Math.floor(n / 12) - 1}`, cents: Math.round((midi - n) * 100) };
}

/** cents from a target MIDI note */
export const centsFrom = (hz: number, midi: number) => Math.round(1200 * Math.log2(hz / (440 * 2 ** ((midi - 69) / 12))));
