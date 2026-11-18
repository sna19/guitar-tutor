<script lang="ts">
	import SongView from '#lib/SongView.svelte';
	import { lang, t } from '#lib/i18n.js';
	let { data } = $props();
	const s = $derived(data.song);
</script>

<svelte:head><title>{s.title} · {t('app.name')}</title></svelte:head>
<a class="muted small" href="/songs">‹ {t('tab.songs')}</a>
<h1>{s.title}</h1>
<p class="muted small">{s.note[lang()]}</p>
{#key s.slug}<SongView sheet={s.sheet} tempo={s.tempo} pattern={s.pattern} />{/key}
