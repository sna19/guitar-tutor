<script lang="ts">
	import ChordDiagram from '#lib/ChordDiagram.svelte';
	import Score from '#lib/Score.svelte';
	import CompasPlayer from '#lib/CompasPlayer.svelte';
	import JamMini from '#lib/JamMini.svelte';
	import { pitchesOf, shapeFor } from '#lib/content/chords.js';
	import { exerciseAbc, exerciseTitle } from '#lib/content/exercises.js';
	import { pieceById, pieceText } from '#lib/content/pieces.js';
	import { lessonById, lessonText } from '#lib/content/program.js';
	import { BOOK } from '#lib/content/book.js';
	import { strum } from '#lib/pluck.js';
	import { lang, t } from '#lib/i18n.js';

	let { data } = $props();
	const ch = $derived(data.chapter);
	const all = BOOK.flatMap((p) => p.chapters);
	const idx = $derived(all.findIndex((c) => c.slug === ch.slug));
	let openEx = $state<string | null>(null);
</script>

<svelte:head><title>{ch.title[lang()]} · {t('app.name')}</title></svelte:head>

<a class="muted small" href="/book">‹ {t('tab.book')} · {data.part.title[lang()]}</a>
<h1>{ch.title[lang()]}</h1>

{#each ch.blocks as b, i (i)}
	{#if 'p' in b}
		<p>{b.p[lang()]}</p>
	{:else if 'h' in b}
		<h2>{b.h[lang()]}</h2>
	{:else if 'list' in b}
		<ul class="ul">{#each b.list as x, j (j)}<li>{x[lang()]}</li>{/each}</ul>
	{:else if 'chords' in b}
		<ul class="chords">
			{#each b.chords as c (c)}
				{@const s = shapeFor(c)}
				<li><button class="card ch" onclick={() => s && strum(pitchesOf(s))}><b>{c}</b>{#if s}<ChordDiagram shape={s} size={80} />{/if}</button></li>
			{/each}
		</ul>
	{:else if 'ex' in b}
		<div class="card ex">
			<button class="chip" class:on={openEx === b.ex} onclick={() => (openEx = openEx === b.ex ? null : b.ex)}>🎼 {exerciseTitle(b.ex, lang())}</button>
			{#if openEx === b.ex}{#key `${b.ex}|${lang()}`}<Score abc={exerciseAbc(b.ex, lang()) ?? ''} />{/key}{/if}
		</div>
	{:else if 'piece' in b}
		{@const pc = pieceById(b.piece)}
		{#if pc}{@const pt = pieceText(pc, lang())}<a class="card link" href="/pieces/{pc.id}">🎵 <b>{pt.title}</b> <span class="muted small">{pt.composer}</span></a>{/if}
	{:else if 'lesson' in b}
		{@const ls = lessonById(b.lesson)}
		{#if ls}<a class="card link" href="/program/{ls.id}">🎓 {lessonText(ls, lang()).title}</a>{/if}
	{:else if 'jam' in b}
		<JamMini preset={b.jam} />
	{:else if 'compas' in b}
		<CompasPlayer compas={b.compas} />
	{/if}
{/each}

<nav class="pn">
	{#if idx > 0}<a class="chip" href="/book/{all[idx - 1].slug}">‹ {all[idx - 1].title[lang()]}</a>{:else}<span></span>{/if}
	{#if idx < all.length - 1}<a class="chip" href="/book/{all[idx + 1].slug}">{all[idx + 1].title[lang()]} ›</a>{/if}
</nav>

<style>
	p {
		line-height: 1.55;
	}
	.ul {
		padding-left: 20px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.chords {
		list-style: none;
		margin: 10px 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
		gap: 8px;
	}
	.ch {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		border: none;
		cursor: pointer;
	}
	.ex {
		margin: 10px 0;
	}
	.link {
		display: block;
		margin: 10px 0;
		text-decoration: none;
	}
	.pn {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		margin-top: 24px;
	}
	.pn a {
		text-decoration: none;
		max-width: 48%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
