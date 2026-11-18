<script lang="ts">
	import { page } from '$app/state';
	import SongEditor from '#lib/SongEditor.svelte';
	import { t } from '#lib/i18n.js';
</script>

<svelte:head><title>{t('song.add')} · {t('app.name')}</title></svelte:head>
<a class="muted small" href="/songs">‹ {t('tab.songs')}</a>
<h1>{t('song.add')}</h1>
<SongEditor title={page.url.searchParams.get('title') ?? ''} artist={page.url.searchParams.get('artist') ?? ''} />
