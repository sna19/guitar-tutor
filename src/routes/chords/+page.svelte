<script lang="ts">
	import ChordDiagram from '#lib/ChordDiagram.svelte';
	import { GROUPS, SHAPES, pitchesOf } from '#lib/content/chords.js';
	import { strum } from '#lib/pluck.js';
	import { lang, t } from '#lib/i18n.js';
</script>

<svelte:head><title>{t('tab.chords')} · {t('app.name')}</title></svelte:head>

<h1>{t('tab.chords')}</h1>
<p class="muted small">{t('chords.intro')}</p>

{#each GROUPS as g (g.key)}
	<h2>{g[lang()]}</h2>
	<ul class="grid">
		{#each SHAPES.filter((s) => s.group === g.key) as s (s.name)}
			<li>
				<button class="card ch" onclick={() => strum(pitchesOf(s))} aria-label="{s.name}: {t('chords.play')}">
					<b>{s.name}</b>
					<ChordDiagram shape={s} size={96} />
				</button>
			</li>
		{/each}
	</ul>
{/each}

<style>
	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
		gap: 8px;
	}
	.ch {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		border: none;
		cursor: pointer;
		padding: 8px 4px;
	}
</style>
