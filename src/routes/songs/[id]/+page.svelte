<script lang="ts">
	import { goto } from '$app/navigation';
	import SongView from '#lib/SongView.svelte';
	import { t } from '#lib/i18n.js';
	let { data } = $props();
	const s = $derived(data.song);
	async function remove() {
		if (!confirm(t('song.confirmDelete', { t: s.title }))) return;
		await fetch(`/api/songs/${s.id}`, { method: 'DELETE' });
		goto('/songs');
	}
</script>

<svelte:head><title>{s.title} · {t('app.name')}</title></svelte:head>
<a class="muted small" href="/songs">‹ {t('tab.songs')}</a>
<h1>{s.title}</h1>
<p class="muted">{s.artist}</p>
{#key s.id}<SongView sheet={s.sheet} tempo={s.tempo} pattern={s.pattern} capo={s.capo} />{/key}
<p class="acts"><a class="chip" href="/songs/{s.id}/edit">{t('song.edit')}</a> <button class="chip" onclick={remove}>{t('mine.delete')}</button></p>

<style>
	.acts {
		margin-top: 24px;
		display: flex;
		gap: 8px;
	}
	.acts a {
		text-decoration: none;
	}
</style>
