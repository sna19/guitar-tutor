<script lang="ts">
	import { BOOK } from '#lib/content/book.js';
	import { lang, t } from '#lib/i18n.js';
</script>

<svelte:head><title>{t('tab.book')} · {t('app.name')}</title></svelte:head>

<a class="muted small" href="/program">‹ {t('tab.program')}</a>
<h1>{t('tab.book')}</h1>
<p class="muted small">{t('book.intro')}</p>

{#each BOOK as part (part.key)}
	<h2>{part.title[lang()]}</h2>
	<ol class="list">
		{#each part.chapters as ch (ch.slug)}<li><a class="card" href="/book/{ch.slug}">{ch.title[lang()]}</a></li>{/each}
	</ol>
{/each}

<style>
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
		font-weight: 600;
	}
</style>
