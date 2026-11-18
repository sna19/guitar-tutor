<script lang="ts">
	import { goto } from '$app/navigation';
	import { PATTERNS } from './pluck.js';
	import { chordsOf, parseSheet } from './songs.js';
	import { lang, t } from './i18n.js';

	/** Add or edit a song of my own: the sheet is pasted as it is on a chord site; the chords are found by the app. */
	interface Props {
		song?: { id: number; title: string; artist: string; sheet: string; capo: number; tempo: number; pattern: string };
		title?: string;
		artist?: string;
	}
	let { song, title: t0 = '', artist: a0 = '' }: Props = $props();
	// svelte-ignore state_referenced_locally
	let title = $state(song?.title ?? t0);
	// svelte-ignore state_referenced_locally
	let artist = $state(song?.artist ?? a0);
	// svelte-ignore state_referenced_locally
	let sheet = $state(song?.sheet ?? '');
	// svelte-ignore state_referenced_locally
	let capo = $state(song?.capo ?? 0);
	// svelte-ignore state_referenced_locally
	let tempo = $state(song?.tempo ?? 90);
	// svelte-ignore state_referenced_locally
	let pattern = $state(song?.pattern ?? 'D-DU-UDU');
	let problem = $state<string | null>(null);
	const found = $derived(chordsOf(parseSheet(sheet)));

	async function save() {
		problem = null;
		const body = JSON.stringify({ title, artist, sheet, capo, tempo, pattern });
		const r = song
			? await fetch(`/api/songs/${song.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body })
			: await fetch('/api/songs', { method: 'POST', headers: { 'content-type': 'application/json' }, body });
		const j = await r.json().catch(() => ({}));
		if (!r.ok) return (problem = j.message ?? t('settings.saveFail'));
		goto(`/songs/${j.id}`);
	}
</script>

<div class="form">
	<label>{t('song.title')} <input bind:value={title} /></label>
	<label>{t('song.artist')} <input bind:value={artist} /></label>
	<label
		>{t('song.sheet')}
		<textarea bind:value={sheet} rows="14" placeholder={t('song.sheetPh')}></textarea>
	</label>
	<p class="muted small">{found.length ? t('song.found', { list: found.join(' ') }) : t('song.sheetHelp')}</p>
	<div class="row">
		<label>{t('song.capoLabel')} <input type="number" min="0" max="9" bind:value={capo} /></label>
		<label>{t('song.tempo')} <input type="number" min="40" max="220" bind:value={tempo} /></label>
	</div>
	<label
		>{t('song.pattern')}
		<select bind:value={pattern}>{#each PATTERNS as p (p.key)}<option value={p.key}>{p[lang()]}</option>{/each}</select>
	</label>
	<p class="muted small">{t('song.private')}</p>
	{#if problem}<p class="err">{problem}</p>{/if}
	<button class="btn" onclick={save}>{t('song.save')}</button>
</div>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 13px;
		color: var(--muted);
	}
	input,
	textarea,
	select {
		min-height: 40px;
		padding: 6px 10px;
		border: 1px solid var(--line);
		border-radius: var(--r1);
		background: var(--surface);
		color: var(--text);
		font: inherit;
	}
	textarea {
		font-family: ui-monospace, Menlo, monospace;
		font-size: 14px;
		white-space: pre;
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.err {
		color: var(--bad);
	}
</style>
