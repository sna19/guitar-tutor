/**
 * Backing tracks in Web Audio, no samples: synthesized drums (kick, snare, hi-hat, flamenco palmas), a bass, and
 * guitar chords with the plucked-string sound — by style, over a chord progression, looped. Notes are scheduled
 * on the audio clock with a short look-ahead, so the groove does not drift when the screen is busy.
 */
import { pitchesOf, shapeFor } from './content/chords.js';

export type Style = 'rock' | 'shuffle' | 'rumba' | 'ballad' | 'bossa';

interface Groove {
	steps: number; // per bar
	swing?: boolean;
	kick: number[];
	snare: number[];
	hat: number[];
	clap?: number[];
	/** bass: step → interval above the root in semitones */
	bass: [number, number][];
	/** chords: step → D (down strum), U (up), A (arpeggio note, string index from the bass) */
	guitar: [number, string][];
}

const GROOVES: Record<Style, Groove> = {
	rock: { steps: 16, kick: [0, 8, 10], snare: [4, 12], hat: [0, 2, 4, 6, 8, 10, 12, 14], bass: [[0, 0], [2, 0], [4, 0], [6, 0], [8, 0], [10, 0], [12, 0], [14, 7]], guitar: [[0, 'D'], [4, 'D'], [6, 'U'], [10, 'U'], [12, 'D'], [14, 'U']] },
	shuffle: { steps: 12, swing: true, kick: [0, 6], snare: [3, 9], hat: [0, 2, 3, 5, 6, 8, 9, 11], bass: [[0, 0], [2, 0], [3, 4], [5, 4], [6, 7], [8, 7], [9, 9], [11, 7]], guitar: [[3, 'D'], [9, 'D']] },
	rumba: { steps: 16, kick: [0, 6, 8], snare: [], hat: [], clap: [4, 7, 12, 14], bass: [[0, 0], [6, 7], [8, 0]], guitar: [[0, 'D'], [3, 'D'], [6, 'U'], [8, 'D'], [11, 'D'], [14, 'U']] },
	ballad: { steps: 16, kick: [0, 8], snare: [4, 12], hat: [0, 4, 8, 12], bass: [[0, 0], [8, 0]], guitar: [[0, 'A0'], [2, 'A3'], [4, 'A4'], [6, 'A5'], [8, 'A1'], [10, 'A3'], [12, 'A4'], [14, 'A3']] },
	bossa: { steps: 16, kick: [0, 6, 8, 14], snare: [0, 3, 6, 10, 13], hat: [0, 2, 4, 6, 8, 10, 12, 14], bass: [[0, 0], [6, 7], [8, 7], [14, 0]], guitar: [[0, 'D'], [3, 'D'], [6, 'D'], [10, 'D'], [13, 'D']] }
};

export const STYLES: { key: Style; ru: string; en: string; bpm: number }[] = [
	{ key: 'rock', ru: 'Рок', en: 'Rock', bpm: 110 },
	{ key: 'shuffle', ru: 'Блюз-шаффл', en: 'Blues shuffle', bpm: 90 },
	{ key: 'rumba', ru: 'Румба фламенко', en: 'Flamenco rumba', bpm: 100 },
	{ key: 'ballad', ru: 'Баллада перебором', en: 'Fingerpicked ballad', bpm: 72 },
	{ key: 'bossa', ru: 'Босса-нова', en: 'Bossa nova', bpm: 120 }
];

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;
function audio() {
	if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
	if (ctx.state !== 'running') void ctx.resume();
	if (!noise) {
		noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
		const d = noise.getChannelData(0);
		for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
	}
	return ctx;
}

function env(c: AudioContext, at: number, peak: number, decay: number, dest: AudioNode) {
	const g = c.createGain();
	g.gain.setValueAtTime(0.0001, at);
	g.gain.exponentialRampToValueAtTime(peak, at + 0.004);
	g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
	g.connect(dest);
	return g;
}

function kick(c: AudioContext, at: number, out: AudioNode) {
	const o = c.createOscillator();
	o.frequency.setValueAtTime(140, at);
	o.frequency.exponentialRampToValueAtTime(45, at + 0.12);
	o.connect(env(c, at, 0.9, 0.35, out));
	o.start(at);
	o.stop(at + 0.4);
}

function noiseHit(c: AudioContext, at: number, out: AudioNode, { type = 'highpass' as BiquadFilterType, freq = 7000, peak = 0.2, decay = 0.05 } = {}) {
	const s = c.createBufferSource();
	s.buffer = noise;
	const f = c.createBiquadFilter();
	f.type = type;
	f.frequency.value = freq;
	s.connect(f).connect(env(c, at, peak, decay, out));
	s.start(at);
	s.stop(at + decay + 0.05);
}

function snare(c: AudioContext, at: number, out: AudioNode, soft = false) {
	noiseHit(c, at, out, { type: 'highpass', freq: 1500, peak: soft ? 0.15 : 0.4, decay: 0.18 });
	const o = c.createOscillator();
	o.frequency.value = 190;
	o.connect(env(c, at, soft ? 0.08 : 0.2, 0.08, out));
	o.start(at);
	o.stop(at + 0.12);
}

function clap(c: AudioContext, at: number, out: AudioNode) {
	for (const d of [0, 0.011, 0.023]) noiseHit(c, at + d, out, { type: 'bandpass', freq: 1400, peak: 0.35, decay: 0.09 });
}

function bass(c: AudioContext, at: number, midi: number, len: number, out: AudioNode) {
	const o = c.createOscillator();
	o.type = 'triangle';
	o.frequency.value = 440 * 2 ** ((midi - 69) / 12);
	const f = c.createBiquadFilter();
	f.type = 'lowpass';
	f.frequency.value = 600;
	o.connect(f).connect(env(c, at, 0.5, len, out));
	o.start(at);
	o.stop(at + len + 0.05);
}

/** a plucked string (Karplus–Strong), scheduled */
function pluck(c: AudioContext, at: number, midi: number, out: AudioNode, vol = 0.25, seconds = 1.4) {
	const sr = c.sampleRate;
	const n = Math.floor(sr * seconds);
	const buf = c.createBuffer(1, n, sr);
	const d = buf.getChannelData(0);
	const period = Math.max(2, Math.round(sr / (440 * 2 ** ((midi - 69) / 12))));
	const ring = new Float32Array(period);
	for (let i = 0; i < period; i++) ring[i] = Math.random() * 2 - 1;
	let idx = 0;
	for (let i = 0; i < n; i++) {
		const next = (idx + 1) % period;
		d[i] = ring[idx];
		ring[idx] = (ring[idx] + ring[next]) * 0.4975;
		idx = next;
	}
	const s = c.createBufferSource();
	s.buffer = buf;
	const g = c.createGain();
	g.gain.value = vol;
	s.connect(g).connect(out);
	s.start(at);
}

export interface Player {
	stop: () => void;
	setTempo: (bpm: number) => void;
}

/**
 * Plays `chords` (names), one bar each (a name repeated takes more bars), in `style`, looped until stopped.
 * `onBar(i)` — the index of the chord now sounding.
 */
export function play(chords: string[], style: Style, bpm: number, onBar?: (i: number) => void): Player {
	const c = audio();
	const g = GROOVES[style];
	const out = c.createGain();
	out.gain.value = 0.8;
	out.connect(c.destination);
	const voiced = chords.map((name) => {
		const s = shapeFor(name);
		const p = s ? pitchesOf(s) : [];
		// the bass an octave below the chord's lowest note, kept in the E1–E2 range
		let root = p[0] ?? 40;
		while (root > 40) root -= 12;
		while (root < 28) root += 12;
		return { pitches: p, root };
	});
	let tempo = bpm;
	let bar = 0;
	let step = 0;
	let next = c.currentTime + 0.1;
	const stepLen = () => (60 / tempo) * (4 / g.steps);

	function schedule(at: number) {
		const v = voiced[bar % voiced.length];
		if (step === 0) {
			const b = bar % voiced.length;
			setTimeout(() => onBar?.(b), Math.max(0, (at - c.currentTime) * 1000));
		}
		if (g.kick.includes(step)) kick(c, at, out);
		if (g.snare.includes(step)) snare(c, at, out, style === 'bossa' || style === 'ballad');
		if (g.hat.includes(step)) noiseHit(c, at, out, { peak: step % 4 === 0 ? 0.12 : 0.07 });
		if (g.clap?.includes(step)) clap(c, at, out);
		const bs = g.bass.find(([s]) => s === step);
		if (bs) bass(c, at, v.root + bs[1], stepLen() * 1.8, out);
		const gt = g.guitar.find(([s]) => s === step);
		if (gt && v.pitches.length) {
			const kind = gt[1];
			if (kind.startsWith('A')) {
				const i = Math.min(v.pitches.length - 1, Number(kind.slice(1)));
				pluck(c, at, v.pitches[i], out, 0.3, 1.8);
			} else {
				const notes = kind === 'U' ? v.pitches.slice(-4).reverse() : v.pitches;
				notes.forEach((p, k) => pluck(c, at + k * (kind === 'U' ? 0.012 : 0.018), p, out, kind === 'U' ? 0.13 : 0.18));
			}
		}
	}

	const timer = setInterval(() => {
		while (next < c.currentTime + 0.15) {
			// swing: in a 12-step (triplet) grid the steps are already uneven by design
			schedule(next);
			next += stepLen();
			step++;
			if (step >= g.steps) {
				step = 0;
				bar++;
			}
		}
	}, 25);

	return {
		stop() {
			clearInterval(timer);
			out.gain.setTargetAtTime(0, c.currentTime, 0.05);
			setTimeout(() => out.disconnect(), 400);
			onBar?.(-1);
		},
		setTempo(b: number) {
			tempo = b;
		}
	};
}

export const PROGRESSIONS: { key: string; ru: string; en: string; chords: string; style: Style }[] = [
	{ key: 'blues', ru: 'Блюз 12 тактов в ля', en: '12-bar blues in A', chords: 'A7 A7 A7 A7 D7 D7 A7 A7 E7 D7 A7 E7', style: 'shuffle' },
	{ key: 'andalusian', ru: 'Андалузская каденция', en: 'Andalusian cadence', chords: 'Am G F E', style: 'rumba' },
	{ key: 'pop', ru: 'Поп: I–V–vi–IV', en: 'Pop: I–V–vi–IV', chords: 'C G Am F', style: 'ballad' },
	{ key: 'rockminor', ru: 'Рок в миноре: Am–F–C–G', en: 'Minor rock: Am–F–C–G', chords: 'Am F C G', style: 'rock' },
	{ key: 'power', ru: 'Пауэр-рифф: E5–G5–A5', en: 'Power riff: E5–G5–A5', chords: 'E5 G5 A5 E5', style: 'rock' },
	{ key: 'jazz', ru: 'Джаз: ii–V–I', en: 'Jazz: ii–V–I', chords: 'Dm7 G7 Cmaj7 Cmaj7', style: 'bossa' },
	{ key: 'russian', ru: 'Минорный «дворовый»: Am–Dm–E–Am', en: 'Minor folk: Am–Dm–E–Am', chords: 'Am Dm E Am', style: 'ballad' }
];

/**
 * Flamenco compás: palmas on every beat, strong on the accents. Soleá and bulerías count 12 (bulerías usually
 * starts on 12), tangos 4/4 with the palmas on 2–3–4, sevillanas 3/4 with the accent on 1.
 */
export const COMPAS: { key: string; ru: string; en: string; beats: number[]; accents: number[]; bpm: number; start?: number }[] = [
	{ key: 'solea', ru: 'Солеа (12)', en: 'Soleá (12)', beats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], accents: [3, 6, 8, 10, 12], bpm: 120 },
	{ key: 'bulerias', ru: 'Булериас (12, с 12)', en: 'Bulerías (12, from 12)', beats: [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], accents: [12, 3, 6, 8, 10], bpm: 210 },
	{ key: 'tangos', ru: 'Тангос (4/4)', en: 'Tangos (4/4)', beats: [1, 2, 3, 4], accents: [2, 3, 4], bpm: 110 },
	{ key: 'sevillanas', ru: 'Севильяна (3/4)', en: 'Sevillanas (3/4)', beats: [1, 2, 3], accents: [1], bpm: 160 }
];

export function playCompas(key: string, bpm: number, onBeat?: (n: number) => void): Player {
	const c = audio();
	const k = COMPAS.find((x) => x.key === key) ?? COMPAS[0];
	const out = c.createGain();
	out.gain.value = 0.9;
	out.connect(c.destination);
	let tempo = bpm;
	let i = 0;
	let next = c.currentTime + 0.1;
	const timer = setInterval(() => {
		while (next < c.currentTime + 0.15) {
			const n = k.beats[i % k.beats.length];
			const strong = k.accents.includes(n);
			const at = next;
			setTimeout(() => onBeat?.(n), Math.max(0, (at - c.currentTime) * 1000));
			if (strong) {
				clap(c, at, out);
				kick(c, at, out);
			} else noiseHit(c, at, out, { type: 'bandpass', freq: 2200, peak: 0.12, decay: 0.05 });
			next += 60 / tempo;
			i++;
		}
	}, 25);
	return {
		stop() {
			clearInterval(timer);
			out.gain.setTargetAtTime(0, c.currentTime, 0.05);
			setTimeout(() => out.disconnect(), 400);
			onBeat?.(-1);
		},
		setTempo(b: number) {
			tempo = b;
		}
	};
}
