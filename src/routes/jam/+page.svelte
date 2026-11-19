<script lang="ts">
	import { onDestroy } from 'svelte';
	import ChordDiagram from '#lib/ChordDiagram.svelte';
	import { shapeFor } from '#lib/content/chords.js';
	import { PROGRESSIONS, STYLES, play, type Player, type Style } from '#lib/backing.js';
	import { isChord, transposeChord } from '#lib/songs.js';
	import { lang, t } from '#lib/i18n.js';

	/**
	 * Backing tracks: a progression (preset or own chords), style, key and tempo — drums, bass and a strummed
	 * guitar, looped; the chord now sounding is shown big with its box, and a scale to solo with.
	 */
	let preset = $state(PROGRESSIONS[0]);
	let text = $state(PROGRESSIONS[0].chords);
	let style = $state<Style>(PROGRESSIONS[0].style);
	let bpm = $state(STYLES.find((s) => s.key === PROGRESSIONS[0].style)!.bpm);
	let shift = $state(0);
	let player: Player | null = null;
	let playing = $state(false);
	let now = $state(-1);

	function choose(p: (typeof PROGRESSIONS)[number]) {
		preset = p;
		text = p.chords;
		style = p.style;
		bpm = STYLES.find((s) => s.key === p.style)!.bpm;
		restart();
	}
	const chords = $derived(text.split(/[\s,|]+/).filter((c) => isChord(c)).map((c) => transposeChord(c, shift)));
	const bad = $derived(text.split(/[\s,|]+/).filter((c) => c && !isChord(c)));

	function start() {
		if (!chords.length) return;
		player = play(chords, style, bpm, (i) => (now = i));
		playing = true;
	}
	function stop() {
		player?.stop();
		player = null;
		playing = false;
		now = -1;
	}
	function restart() {
		if (playing) {
			stop();
			start();
		}
	}
	$effect(() => {
		player?.setTempo(bpm);
	});
	onDestroy(stop);

	// a scale to solo with, from the progression's first chord
	const NOTE_RU: Record<string, string> = { C: 'до', 'C#': 'до-диез', D: 'ре', 'D#': 'ре-диез', E: 'ми', F: 'фа', 'F#': 'фа-диез', G: 'соль', 'G#': 'соль-диез', A: 'ля', 'A#': 'ля-диез', B: 'си' };
	const scale = $derived.by(() => {
		const c = chords[0];
		if (!c) return '';
		const root = c.match(/^[A-G][#b]?/)![0];
		const minorish = /^[A-G][#b]?m(?!aj)/.test(c) || style === 'shuffle' || style === 'rumba';
		if (style === 'rumba') return lang() === 'en' ? `${root} Phrygian (the flamenco mode) — over the last chord` : `Фригийский лад от ${NOTE_RU[transposeChord(root, 7)] ?? root} — лад фламенко`;
		if (lang() === 'en') return `${root} ${minorish ? 'minor' : 'major'} pentatonic${style === 'shuffle' ? ' with the blue note' : ''}`;
		return `${minorish ? 'Минорная' : 'Мажорная'} пентатоника от ${NOTE_RU[root] ?? root}${style === 'shuffle' ? ' + блюзовая нота' : ''}`;
	});
	const current = $derived(now >= 0 ? chords[now] : chords[0]);
	const KEYS = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
</script>

<svelte:head><title>{t('jam.title')} · {t('app.name')}</title></svelte:head>

<a class="muted small" href="/chords">‹ {t('tab.chords')}</a>
<h1>{t('jam.title')}</h1>
<p class="muted small">{t('jam.intro')}</p>

<div class="chips">
	{#each PROGRESSIONS as p (p.key)}<button class="chip" class:on={preset.key === p.key} onclick={() => choose(p)}>{p[lang()]}</button>{/each}
</div>

<label class="field">{t('jam.chords')} <input bind:value={text} onchange={restart} /></label>
{#if bad.length}<p class="err small">{t('jam.bad', { list: bad.join(' ') })}</p>{/if}

<div class="row">
	<label class="field"
		>{t('jam.style')}
		<select bind:value={style} onchange={() => ((bpm = STYLES.find((s) => s.key === style)!.bpm), restart())}>
			{#each STYLES as s (s.key)}<option value={s.key}>{s[lang()]}</option>{/each}
		</select>
	</label>
	<label class="field"
		>{t('jam.key')}
		<select bind:value={shift} onchange={restart}>
			{#each KEYS as k (k)}<option value={k}>{k > 0 ? `+${k}` : k} · {transposeChord(text.split(/\s+/)[0] || 'C', k)}</option>{/each}
		</select>
	</label>
</div>
<label class="field">{t('song.tempo')}: {bpm} <input type="range" min="50" max="180" bind:value={bpm} /></label>

<button class="btn big" onclick={() => (playing ? stop() : start())}>{playing ? '■ ' + t('song.stop') : '▶ ' + t('jam.play')}</button>

<div class="card now">
	<div class="name">{current ?? '—'}</div>
	{#if current && shapeFor(current)}<ChordDiagram shape={shapeFor(current)!} size={110} />{/if}
	<div class="seq">
		{#each chords as c, i (i)}<span class:on={i === now}>{c}</span>{/each}
	</div>
	<p class="small"><b>{t('jam.solo')}:</b> {scale}</p>
</div>

<style>
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin: 10px 0;
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 13px;
		color: var(--muted);
		margin-bottom: 8px;
	}
	.field input:not([type='range']),
	.field select {
		min-height: 40px;
		padding: 0 10px;
		border: 1px solid var(--line);
		border-radius: var(--r1);
		background: var(--surface);
		color: var(--text);
		font: inherit;
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.big {
		width: 100%;
		min-height: 52px;
		font-size: 18px;
		margin: 6px 0 12px;
	}
	.now {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.name {
		font-size: 48px;
		font-weight: 800;
		line-height: 1;
	}
	.seq {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.seq span {
		padding: 2px 8px;
		border-radius: 6px;
		background: var(--surface2);
		font-weight: 600;
	}
	.seq span.on {
		background: var(--accent);
		color: var(--accent-text);
	}
	.err {
		color: var(--bad);
	}
</style>
