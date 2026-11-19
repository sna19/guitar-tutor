<script lang="ts">
	import { onDestroy } from 'svelte';
	import { PROGRESSIONS, STYLES, play, type Player } from './backing.js';
	import { lang, t } from './i18n.js';

	/** A backing track inside a chapter: one tap to play the preset, the chord now sounding. */
	let { preset }: { preset: string } = $props();
	const pr = $derived(PROGRESSIONS.find((x) => x.key === preset)!);
	const chords = $derived(pr.chords.split(' '));
	let p: Player | null = null;
	let now = $state(-1);
	function toggle() {
		if (p) {
			p.stop();
			p = null;
			return;
		}
		p = play(chords, pr.style, STYLES.find((s) => s.key === pr.style)!.bpm, (i) => (now = i));
	}
	onDestroy(() => p?.stop());
</script>

<div class="card jm">
	<div class="top">
		<span><b>{pr[lang()]}</b> <span class="muted small">· {STYLES.find((s) => s.key === pr.style)![lang()]}</span></span>
		<button class="chip" onclick={toggle}>{now >= 0 ? '■ ' + t('song.stop') : '▶ ' + t('jam.play')}</button>
	</div>
	<div class="seq">{#each chords as c, i (i)}<span class:on={i === now}>{c}</span>{/each}</div>
	<a class="small" href="/jam">{t('jam.title')} →</a>
</div>

<style>
	.jm {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 10px 0;
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
	}
	.seq {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}
	.seq span {
		padding: 2px 8px;
		border-radius: 6px;
		background: var(--surface2);
		font-weight: 600;
		font-size: 14px;
	}
	.seq span.on {
		background: var(--accent);
		color: var(--accent-text);
	}
</style>
