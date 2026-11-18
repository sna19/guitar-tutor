<script lang="ts">
	import { onDestroy } from 'svelte';
	import ChordDiagram from './ChordDiagram.svelte';
	import { pitchesOf, shapeFor } from './content/chords.js';
	import { PATTERNS, playSequence, stopAll, strum } from './pluck.js';
	import { chordsOf, parseSheet, sequenceOf, transposeLines } from './songs.js';
	import { lang, t } from './i18n.js';

	/**
	 * A song on screen: words with the chords above them, the song's chord boxes (tap — it sounds), transpose and
	 * capo, a slow auto-scroll for playing, and an accompaniment strummed by the chosen pattern.
	 */
	interface Props {
		sheet: string;
		tempo?: number;
		pattern?: string;
		capo?: number;
	}
	let { sheet, tempo = 90, pattern = 'D-DU-UDU', capo = 0 }: Props = $props();

	let steps = $state(0);
	// svelte-ignore state_referenced_locally
	let bpm = $state(tempo);
	// svelte-ignore state_referenced_locally
	let strumPattern = $state(pattern);
	let scrolling = $state(false);
	let speed = $state(2);
	let playingIdx = $state(-1);
	let isPlaying = $state(false);

	const lines = $derived(transposeLines(parseSheet(sheet), steps));
	const chords = $derived(chordsOf(lines));
	const seq = $derived(sequenceOf(lines));

	let raf = 0;
	let last = 0;
	function tick(ts: number) {
		if (!scrolling) return;
		if (last) window.scrollBy(0, ((ts - last) / 1000) * speed * 12);
		last = ts;
		raf = requestAnimationFrame(tick);
	}
	function toggleScroll() {
		scrolling = !scrolling;
		last = 0;
		if (scrolling) raf = requestAnimationFrame(tick);
		else cancelAnimationFrame(raf);
	}
	function play() {
		if (isPlaying) {
			stopAll();
			isPlaying = false;
			playingIdx = -1;
			return;
		}
		const shapes = seq.map((c) => shapeFor(c)).map((s) => (s ? pitchesOf(s) : []));
		isPlaying = true;
		playSequence(shapes, {
			bpm,
			beats: 4,
			pattern: strumPattern,
			onChord: (i) => {
				playingIdx = i;
				if (i < 0) isPlaying = false;
			}
		});
	}
	onDestroy(() => {
		stopAll();
		if (typeof window !== 'undefined') cancelAnimationFrame(raf);
	});
	// the index of each chord mark in playing order, to light the one that sounds
	const order = $derived.by(() => {
		let k = 0;
		return lines.map((l) => (l.kind === 'chords' ? l.chords.map(() => k++) : l.kind === 'lyrics' ? l.segments.map((s) => (s.chord ? k++ : -1)) : []));
	});
</script>

<div class="bar">
	<div class="grp" aria-label={t('song.transpose')}>
		<button class="chip" onclick={() => (steps -= 1)} aria-label={t('song.down')}>−½</button>
		<span class="val">{steps > 0 ? `+${steps}` : steps}</span>
		<button class="chip" onclick={() => (steps += 1)} aria-label={t('song.up')}>+½</button>
	</div>
	{#if capo}<span class="muted small">{t('song.capo', { n: capo })}</span>{/if}
	<button class="chip" class:on={scrolling} onclick={toggleScroll}>{scrolling ? t('song.stopScroll') : t('song.scroll')}</button>
	{#if scrolling}<input type="range" min="1" max="6" bind:value={speed} aria-label={t('song.speed')} />{/if}
</div>

<ul class="boxes">
	{#each chords as c (c)}
		{@const s = shapeFor(c)}
		<li>
			<button class="box" onclick={() => s && strum(pitchesOf(s))} aria-label="{c}: {t('chords.play')}">
				<b>{c}</b>
				{#if s}<ChordDiagram shape={s} size={64} />{:else}<span class="muted small">?</span>{/if}
			</button>
		</li>
	{/each}
</ul>

<div class="play card">
	<button class="btn" onclick={play}>{isPlaying ? '■ ' + t('song.stop') : '▶ ' + t('song.accomp')}</button>
	<label class="small">{t('song.tempo')} <input type="number" min="40" max="220" bind:value={bpm} /></label>
	<select bind:value={strumPattern} aria-label={t('song.pattern')}>
		{#each PATTERNS as p (p.key)}<option value={p.key}>{p[lang()]}</option>{/each}
	</select>
</div>

<div class="sheet">
	{#each lines as l, li (li)}
		{#if l.kind === 'section'}
			<p class="sec">{l.title}</p>
		{:else if l.kind === 'blank'}
			<div class="gap"></div>
		{:else if l.kind === 'chords'}
			<p class="chordline">{#each l.chords as c, ci (ci)}<span class="ch" class:now={order[li][ci] === playingIdx}>{c}</span>{/each}</p>
		{:else}
			<p class="ly">
				{#each l.segments as s, si (si)}<span class="seg"
						>{#if s.chord}<span class="ch" class:now={order[li][si] === playingIdx}>{s.chord}</span>{:else if l.segments.some((x) => x.chord)}<span class="ch">&nbsp;</span>{/if}<span class="tx">{s.text || ' '}</span></span
					>{/each}
			</p>
		{/if}
	{/each}
</div>

<style>
	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		margin: 8px 0;
	}
	.grp {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.val {
		min-width: 28px;
		text-align: center;
		font-weight: 600;
	}
	.boxes {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		gap: 6px;
		overflow-x: auto;
		scrollbar-width: none;
	}
	.box {
		display: flex;
		flex-direction: column;
		align-items: center;
		border: none;
		background: var(--surface);
		border-radius: var(--r1);
		padding: 4px 6px;
		cursor: pointer;
	}
	.play {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
		margin: 10px 0;
	}
	.play input {
		width: 64px;
		min-height: 36px;
		border: 1px solid var(--line);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
		padding: 0 6px;
	}
	.play select {
		min-height: 36px;
		border: 1px solid var(--line);
		border-radius: 8px;
		background: var(--bg);
		color: var(--text);
	}
	.sheet {
		font-size: 17px;
		line-height: 1.25;
	}
	.sec {
		margin: 14px 0 4px;
		font-weight: 700;
		color: var(--muted);
		font-size: 14px;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}
	.gap {
		height: 10px;
	}
	.ly,
	.chordline {
		margin: 0 0 6px;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
	}
	.seg {
		display: inline-flex;
		flex-direction: column;
	}
	.ch {
		color: var(--accent);
		font-weight: 700;
		font-size: 15px;
		padding-right: 6px;
		white-space: pre;
	}
	.chordline .ch {
		padding-right: 14px;
	}
	.ch.now {
		background: var(--accent);
		color: var(--accent-text);
		border-radius: 4px;
		padding: 0 4px;
	}
	.tx {
		white-space: pre;
	}
</style>
