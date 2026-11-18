<script lang="ts">
	import { onDestroy } from 'svelte';
	import { strum } from '#lib/pluck.js';
	import { centsFrom, detectPitch, noteOf } from '#lib/pitch.js';
	import { lang, t } from '#lib/i18n.js';

	/**
	 * Tuning: a reference tone for every string (tap — it sounds; «repeat» keeps sounding while you turn the peg),
	 * and a microphone tuner — the nearest string of the chosen tuning, how far off in cents.
	 */
	const TUNINGS: { key: string; ru: string; en: string; notes: number[] }[] = [
		{ key: 'std', ru: 'Стандартный E A D G B E', en: 'Standard E A D G B E', notes: [40, 45, 50, 55, 59, 64] },
		{ key: 'dropd', ru: 'Drop D: D A D G B E', en: 'Drop D: D A D G B E', notes: [38, 45, 50, 55, 59, 64] },
		{ key: 'dadgad', ru: 'DADGAD', en: 'DADGAD', notes: [38, 45, 50, 55, 57, 62] },
		{ key: 'openg', ru: 'Открытый соль: D G D G B D', en: 'Open G: D G D G B D', notes: [38, 43, 50, 55, 59, 62] },
		{ key: 'half', ru: 'На полтона ниже: Eb Ab Db Gb Bb Eb', en: 'Half step down: Eb Ab Db Gb Bb Eb', notes: [39, 44, 49, 54, 58, 63] }
	];
	const NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
	const nm = (m: number) => NAMES[m % 12];

	let tuning = $state(TUNINGS[0]);
	let repeat = $state(false);
	let current = $state<number | null>(null);
	let timer: ReturnType<typeof setInterval> | undefined;

	function play(i: number) {
		current = i;
		strum([tuning.notes[i]], { seconds: 4, volume: 0.7 });
		clearInterval(timer);
		if (repeat) timer = setInterval(() => strum([tuning.notes[i]], { seconds: 4, volume: 0.7 }), 2500);
	}
	function stop() {
		clearInterval(timer);
		current = null;
	}

	// ── microphone ──
	let listening = $state(false);
	let micError = $state<string | null>(null);
	let heard = $state<{ name: string; cents: number; string: number; hz: number } | null>(null);
	let stream: MediaStream | null = null;
	let ctx: AudioContext | null = null;
	let raf = 0;

	async function listen() {
		if (listening) return quiet();
		micError = null;
		stop();
		try {
			stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
		} catch {
			micError = t('tuner.noMic');
			return;
		}
		ctx = new AudioContext();
		const src = ctx.createMediaStreamSource(stream);
		const an = ctx.createAnalyser();
		an.fftSize = 4096;
		src.connect(an);
		const buf = new Float32Array(an.fftSize);
		listening = true;
		let hist: number[] = [];
		const loop = () => {
			if (!listening || !ctx) return;
			an.getFloatTimeDomainData(buf);
			const hz = detectPitch(buf, ctx.sampleRate);
			if (hz) {
				// the median of the last readings keeps the needle calm
				hist = [...hist.slice(-4), hz];
				const med = [...hist].sort((a, b) => a - b)[Math.floor(hist.length / 2)];
				const n = noteOf(med);
				// the nearest string of the tuning
				let s = 0;
				for (let i = 1; i < 6; i++) if (Math.abs(n.midi + n.cents / 100 - tuning.notes[i]) < Math.abs(n.midi + n.cents / 100 - tuning.notes[s])) s = i;
				heard = { name: n.name, cents: centsFrom(med, tuning.notes[s]), string: s, hz: med };
			}
			raf = requestAnimationFrame(loop);
		};
		loop();
	}
	function quiet() {
		listening = false;
		cancelAnimationFrame(raf);
		stream?.getTracks().forEach((tr) => tr.stop());
		void ctx?.close();
		ctx = null;
		heard = null;
	}
	onDestroy(() => {
		// runs on the server too, where there is nothing to stop
		if (typeof window === 'undefined') return;
		stop();
		quiet();
	});
	const verdict = $derived(!heard ? '' : Math.abs(heard.cents) <= 5 ? t('tuner.ok') : heard.cents < 0 ? t('tuner.low') : t('tuner.high'));
</script>

<svelte:head><title>{t('tuner.title')} · {t('app.name')}</title></svelte:head>

<a class="muted small" href="/chords">‹ {t('tab.chords')}</a>
<h1>{t('tuner.title')}</h1>

<select bind:value={tuning} aria-label={t('tuner.tuning')}>
	{#each TUNINGS as tu (tu.key)}<option value={tu}>{tu[lang()]}</option>{/each}
</select>

<h2>{t('tuner.ref')}</h2>
<p class="muted small">{t('tuner.refHelp')}</p>
<div class="strings">
	{#each tuning.notes as m, i (i)}
		<button class="str" class:on={current === i} onclick={() => play(i)} aria-label="{6 - i}: {nm(m)}">
			<span class="num">{6 - i}</span>
			<b>{nm(m)}</b>
		</button>
	{/each}
</div>
<div class="row">
	<label class="chip"><input type="checkbox" bind:checked={repeat} onchange={() => current !== null && play(current)} /> {t('tuner.repeat')}</label>
	{#if current !== null}<button class="chip" onclick={stop}>{t('song.stop')}</button>{/if}
</div>

<h2>{t('tuner.mic')}</h2>
<p class="muted small">{t('tuner.micHelp')}</p>
<button class="btn" onclick={listen}>{listening ? t('tuner.micStop') : t('tuner.micStart')}</button>
{#if micError}<p class="err">{micError}</p>{/if}
{#if listening}
	<div class="card meter">
		{#if heard}
			<p class="big">{heard.name} <span class="muted small">· {t('tuner.string')} {6 - heard.string} ({nm(tuning.notes[heard.string])})</span></p>
			<div class="scale"><span class="needle" style="left: {50 + Math.max(-50, Math.min(50, heard.cents))}%" class:ok={Math.abs(heard.cents) <= 5}></span><span class="mid"></span></div>
			<p class="verdict" class:ok={Math.abs(heard.cents) <= 5}>{verdict} · {heard.cents > 0 ? '+' : ''}{heard.cents} {t('tuner.cents')}</p>
		{:else}
			<p class="muted">{t('tuner.pluck')}</p>
		{/if}
	</div>
{/if}

<style>
	select {
		min-height: 40px;
		border: 1px solid var(--line);
		border-radius: var(--r1);
		background: var(--surface);
		color: var(--text);
		font: inherit;
		padding: 0 8px;
	}
	.strings {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 6px;
	}
	.str {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		min-height: 72px;
		justify-content: center;
		border: none;
		border-radius: var(--r1);
		background: var(--surface);
		font-size: 20px;
		cursor: pointer;
	}
	.str.on {
		background: var(--accent);
		color: var(--accent-text);
	}
	.num {
		font-size: 12px;
		opacity: 0.7;
	}
	.row {
		display: flex;
		gap: 8px;
		margin-top: 8px;
	}
	.meter {
		margin-top: 12px;
	}
	.big {
		font-size: 34px;
		font-weight: 700;
		margin: 0;
	}
	.scale {
		position: relative;
		height: 24px;
		margin: 10px 0;
		border-radius: 12px;
		background: linear-gradient(90deg, var(--bad), var(--surface2) 40%, var(--good) 50%, var(--surface2) 60%, var(--bad));
	}
	.mid {
		position: absolute;
		left: 50%;
		top: -4px;
		bottom: -4px;
		width: 2px;
		background: var(--text);
	}
	.needle {
		position: absolute;
		top: -6px;
		width: 6px;
		height: 36px;
		margin-left: -3px;
		border-radius: 3px;
		background: var(--text);
		transition: left 0.12s;
	}
	.needle.ok {
		background: var(--good);
	}
	.verdict {
		font-size: 18px;
		font-weight: 600;
		margin: 0;
	}
	.verdict.ok {
		color: var(--good);
	}
	.err {
		color: var(--bad);
	}
</style>
