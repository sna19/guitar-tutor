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
