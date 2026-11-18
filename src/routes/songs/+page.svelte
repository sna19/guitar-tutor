<script lang="ts">
	import { FOLK, RUSSIAN_ROCK } from '#lib/content/songbook.js';
	import { t } from '#lib/i18n.js';
	let { data } = $props();
	let decade = $state<'all' | '80' | '90' | '2000'>('all');
	const mineKeys = $derived(new Set(data.mine.map((s) => `${s.artist}|${s.title}`.toLowerCase())));
	const rock = $derived(RUSSIAN_ROCK.filter((s) => decade === 'all' || s.decade === decade));
	const artists = $derived([...new Set(rock.map((s) => s.artist))]);
	const mineId = (a: string, ti: string) => data.mine.find((s) => s.artist.toLowerCase() === a.toLowerCase() && s.title.toLowerCase() === ti.toLowerCase())?.id;
</script>

<svelte:head><title>{t('tab.songs')} · {t('app.name')}</title></svelte:head>

<header class="hd"><h1>{t('tab.songs')}</h1><a class="btn" href="/songs/new">+ {t('song.add')}</a></header>

<h2>{t('song.mine')}</h2>
{#if data.mine.length}
	<ul class="list">
		{#each data.mine as s (s.id)}<li><a class="card" href="/songs/{s.id}"><b>{s.title}</b> <span class="muted small">{s.artist}</span></a></li>{/each}
	</ul>
{:else}
	<p class="muted small">{t('song.mineEmpty')}</p>
{/if}

<h2>{t('song.folk')}</h2>
<ul class="list">
	{#each FOLK as f (f.slug)}<li><a class="card" href="/songs/folk/{f.slug}"><b>{f.title}</b> <span class="muted small">{t('level.lc')} {f.level}</span></a></li>{/each}
</ul>

<h2>{t('song.rock')}</h2>
<p class="muted small">{t('song.rockIntro')}</p>
<div class="chips">
	{#each [['all', t('pieces.all')], ['80', '80-е'], ['90', '90-е'], ['2000', '2000-е']] as [k, label] (k)}
		<button class="chip" class:on={decade === k} onclick={() => (decade = k as typeof decade)}>{label}</button>
	{/each}
</div>
{#each artists as a (a)}
	<h3>{a}</h3>
	<ul class="rock">
		{#each rock.filter((s) => s.artist === a) as s (s.title)}
			{@const id = mineId(s.artist, s.title)}
			<li>
				<span>{s.title}</span>
				{#if id}<a class="chip on" href="/songs/{id}">{t('song.open')}</a>{:else}<a class="chip" href="/songs/new?title={encodeURIComponent(s.title)}&artist={encodeURIComponent(s.artist)}">+ {t('song.addShort')}</a>{/if}
			</li>
		{/each}
	</ul>
{/each}
<span hidden>{mineKeys.size}</span>

<style>
	.hd {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.hd .btn {
		display: inline-flex;
		align-items: center;
		text-decoration: none;
	}
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.list a {
		display: block;
		text-decoration: none;
	}
	.chips {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
		margin-bottom: 6px;
	}
	h3 {
		margin: 14px 0 6px;
		font-size: 15px;
	}
	.rock {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.rock li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		border-bottom: 1px solid var(--line);
	}
	.rock a {
		text-decoration: none;
	}
</style>
