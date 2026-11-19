<script lang="ts">
	import { onDestroy } from 'svelte';
	import { COMPAS, playCompas, type Player } from './backing.js';
	import { lang, t } from './i18n.js';

	/** A flamenco compás metronome: the count shown, the accents lit. */
	let { compas }: { compas: string } = $props();
	const k = $derived(COMPAS.find((c) => c.key === compas)!);
	// svelte-ignore state_referenced_locally
	let bpm = $state(COMPAS.find((c) => c.key === compas)!.bpm);
	let p: Player | null = null;
	let beat = $state(-1);
	function toggle() {
		if (p) {
			p.stop();
			p = null;
			return;
		}
		p = playCompas(compas, bpm, (n) => (beat = n));
	}
	$effect(() => p?.setTempo(bpm));
	onDestroy(() => p?.stop());
</script>

<div class="card cp">
	<div class="top">
		<b>{k[lang()]}</b>
		<button class="chip" onclick={toggle}>{beat >= 0 ? '■ ' + t('song.stop') : '▶ ' + t('jam.play')}</button>
	</div>
	<div class="beats">
		{#each k.beats as n (n)}<span class:acc={k.accents.includes(n)} class:now={beat === n}>{n}</span>{/each}
	</div>
	<input type="range" min="60" max="240" bind:value={bpm} aria-label={t('song.tempo')} />
</div>

<style>
	.cp {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 10px 0;
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.beats {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}
	.beats span {
		min-width: 28px;
		height: 28px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: var(--surface2);
		font-size: 13px;
	}
	.beats span.acc {
		font-weight: 800;
		border: 2px solid var(--accent);
	}
	.beats span.now {
		background: var(--accent);
		color: var(--accent-text);
	}
</style>
