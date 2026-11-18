<script lang="ts">
	import type { Shape } from './content/chords.js';

	/** A chord box: six strings, frets from the nut (or from the barre's fret), dots with finger numbers, × and ○. */
	let { shape, size = 120 }: { shape: Shape; size?: number } = $props();
	const played = $derived(shape.frets.filter((f) => f > 0));
	const base = $derived(Math.max(1, played.length && Math.max(...played) > 4 ? Math.min(...played) : 1));
	const W = 100;
	const H = 120;
	const x = (s: number) => 15 + s * 14;
	const y = (f: number) => 25 + (f - base + 0.5) * 18;
</script>

<svg viewBox="0 0 {W} {H}" width={size} height={(size * H) / W} role="img" aria-label="{shape.name}: {shape.frets.map((f) => (f < 0 ? 'x' : f)).join(' ')}">
	<!-- nut or the first fret's number -->
	{#if base === 1}<rect x={x(0)} y="22" width={x(5) - x(0)} height="4" fill="currentColor" />{:else}<text x="2" y={y(base) + 4} font-size="10" fill="currentColor">{base}</text>{/if}
	{#each [0, 1, 2, 3, 4, 5] as f (f)}<line x1={x(0)} x2={x(5)} y1={25 + f * 18} y2={25 + f * 18} stroke="currentColor" stroke-width="1" opacity="0.6" />{/each}
	{#each [0, 1, 2, 3, 4, 5] as s (s)}<line x1={x(s)} x2={x(s)} y1="25" y2="115" stroke="currentColor" stroke-width={1 + (5 - s) * 0.25} opacity="0.8" />{/each}
	{#if shape.barre}
		<rect x={x(shape.barre.from - 1) - 5} y={y(shape.barre.fret) - 5} width={x(5) - x(shape.barre.from - 1) + 10} height="10" rx="5" fill="var(--accent)" />
	{/if}
	{#each shape.frets as f, s (s)}
		{#if f < 0}
			<text x={x(s)} y="16" font-size="11" text-anchor="middle" fill="currentColor" opacity="0.7">×</text>
		{:else if f === 0}
			<circle cx={x(s)} cy="12" r="4" fill="none" stroke="currentColor" />
		{:else if !(shape.barre && shape.barre.fret === f && shape.fingers?.[s] === 1)}
			<circle cx={x(s)} cy={y(f)} r="6" fill="var(--accent)" />
			{#if shape.fingers?.[s]}<text x={x(s)} y={y(f) + 3.5} font-size="9" text-anchor="middle" fill="var(--accent-text)">{shape.fingers[s]}</text>{/if}
		{/if}
	{/each}
</svg>

<style>
	svg {
		color: var(--text);
		display: block;
	}
</style>
