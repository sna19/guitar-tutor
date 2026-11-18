/**
 * A plucked-string synth (Karplus–Strong) in Web Audio: chords strummed string by string, single notes picked.
 * No samples to load, works offline. One AudioContext for the app; resumed on every play (iPhone suspends it).
 */
let ctx: AudioContext | null = null;

function audio(): AudioContext {
	if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
	if (ctx.state !== 'running') void ctx.resume();
	return ctx;
}

function pluckBuffer(c: AudioContext, freq: number, seconds: number, bright = 0.5): AudioBuffer {
	const sr = c.sampleRate;
	const n = Math.floor(sr * seconds);
	const buf = c.createBuffer(1, n, sr);
	const out = buf.getChannelData(0);
	const period = Math.max(2, Math.round(sr / freq));
	const ring = new Float32Array(period);
	for (let i = 0; i < period; i++) ring[i] = Math.random() * 2 - 1;
	let idx = 0;
	const damp = 0.996 - (1 - bright) * 0.004;
	for (let i = 0; i < n; i++) {
		const next = (idx + 1) % period;
		const v = (ring[idx] + ring[next]) * 0.5 * damp;
		out[i] = ring[idx];
		ring[idx] = v;
		idx = next;
	}
	return buf;
}

const freqOf = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/** play sounding MIDI pitches; `spread` ms between strings (a strum), downwards unless `up` */
export function strum(pitches: number[], { spread = 28, up = false, seconds = 2.5, volume = 0.5 } = {}) {
	const c = audio();
	const t0 = c.currentTime + 0.02;
	const order = up ? [...pitches].reverse() : pitches;
	order.forEach((p, i) => {
		const src = c.createBufferSource();
		src.buffer = pluckBuffer(c, freqOf(p), seconds, 0.6);
		const g = c.createGain();
		g.gain.value = volume / Math.sqrt(order.length);
		src.connect(g).connect(c.destination);
		src.start(t0 + (i * spread) / 1000);
	});
}

let playing: ReturnType<typeof setTimeout>[] = [];

export function stopAll() {
	playing.forEach(clearTimeout);
	playing = [];
}

/**
 * An accompaniment: each chord for `beats` beats at `bpm`, strummed by the pattern — «D» down, «U» up, «-» a rest,
 * one letter per eighth note («D-DU-UDU» is the usual «шестёрка»). `onChord(i)` tells which chord sounds now.
 */
export function playSequence(chords: number[][], { bpm = 90, beats = 4, pattern = 'D-DU-UDU', loop = false, onChord }: { bpm?: number; beats?: number; pattern?: string; loop?: boolean; onChord?: (i: number) => void } = {}) {
	stopAll();
	const eighth = 60000 / bpm / 2;
	const steps = beats * 2;
	let t = 0;
	const total = chords.length * steps * eighth;
	chords.forEach((pitches, ci) => {
		playing.push(setTimeout(() => onChord?.(ci), t));
		for (let s = 0; s < steps; s++) {
			const c = pattern[s % pattern.length];
			if (c === 'D' || c === 'U') {
				const at = t + s * eighth;
				playing.push(setTimeout(() => strum(c === 'U' ? pitches.slice(-4) : pitches, { up: c === 'U', spread: c === 'U' ? 14 : 22, seconds: 1.6, volume: c === 'U' ? 0.32 : 0.45 }), at));
			}
		}
		t += steps * eighth;
	});
	playing.push(
		setTimeout(() => {
			onChord?.(-1);
			if (loop) playSequence(chords, { bpm, beats, pattern, loop, onChord });
		}, total)
	);
}

export const PATTERNS: { key: string; ru: string; en: string }[] = [
	{ key: 'D-DU-UDU', ru: '«Шестёрка»: ↓ ↓↑ ↑↓↑', en: 'Folk strum: D DU UDU' },
	{ key: 'D-D-D-D-', ru: 'Четверти: ↓ ↓ ↓ ↓', en: 'Quarters: D D D D' },
	{ key: 'DUDUDUDU', ru: 'Восьмые: ↓↑↓↑↓↑↓↑', en: 'Eighths: DUDUDUDU' },
	{ key: 'D-DUD-DU', ru: '«Восьмёрка» рок: ↓ ↓↑↓ ↓↑', en: 'Rock: D DUD DU' },
	{ key: 'D---D---', ru: 'Половинные, баллада', en: 'Halves, ballad' }
];
