<script lang="ts">
	import { KINDS, SITES, searchable } from '#lib/content/links.js';
	import { lang, t } from '#lib/i18n.js';
	let query = $state('');
</script>

<svelte:head><title>{t('links.title')} · {t('app.name')}</title></svelte:head>

<a class="muted small" href="/songs">‹ {t('tab.songs')}</a>
<h1>{t('links.title')}</h1>
<p class="muted small">{t('links.intro')}</p>

<form class="card find" onsubmit={(e) => e.preventDefault()}>
	<input bind:value={query} placeholder={t('links.searchPh')} aria-label={t('links.search')} enterkeyhint="search" />
	{#if query.trim()}
		<div class="go">
			{#each searchable() as s (s.name)}<a class="chip" href={s.search!(query.trim())} target="_blank" rel="noopener">{s.name} ↗</a>{/each}
		</div>
	{/if}
</form>

{#each KINDS as k (k.key)}
	<h2>{k.title[lang()]}</h2>
	<ul class="list">
		{#each SITES.filter((s) => s.kind === k.key) as s (s.name)}
			<li>
				<a class="card" href={s.url} target="_blank" rel="noopener">
					<span class="top"><b>{s.name}</b><span class="muted small">{s.lang === 'ru' ? 'RU' : 'EN'}{s.paste ? ` · ${t('links.paste')}` : ''} ↗</span></span>
					<span class="small">{s.note[lang()]}</span>
				</a>
			</li>
		{/each}
	</ul>
{/each}

<p class="muted small foot">{t('links.how')}</p>

<style>
	.find {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 10px 0;
	}
	.find input {
		min-height: var(--tap);
		padding: 0 12px;
		border: 1px solid var(--line);
		border-radius: var(--r1);
		background: var(--bg);
		color: var(--text);
		font: inherit;
	}
	.go {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.go a {
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
		display: flex;
		flex-direction: column;
		gap: 2px;
		text-decoration: none;
	}
	.top {
		display: flex;
		justify-content: space-between;
		gap: 8px;
	}
	.foot {
		margin-top: 16px;
	}
</style>
