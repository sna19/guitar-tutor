<script lang="ts">
	import SongEditor from '#lib/SongEditor.svelte';
	import { t } from '#lib/i18n.js';
	let { data } = $props();
</script>

<svelte:head><title>{t('song.edit')} · {t('app.name')}</title></svelte:head>
<a class="muted small" href="/songs/{data.song.id}">‹ {data.song.title}</a>
<h1>{t('song.edit')}</h1>
<SongEditor song={data.song} />
