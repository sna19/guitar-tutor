<script lang="ts">
	import { onMount } from 'svelte';
	import Settings from '@lucide/svelte/icons/settings';
	import { PIECES, pieceText } from '#lib/content/pieces.js';
	import { levelOf } from '#lib/content/levels.js';
	import { AREAS, LESSONS, lessonsOf, lessonText } from '#lib/content/program.js';
	import { buildPlan } from '#lib/dayplan.js';
	import LangSwitch from '#lib/LangSwitch.svelte';
	import BlockTimer from '#lib/BlockTimer.svelte';
	import { lang, t, tr } from '#lib/i18n.js';

	let { data } = $props();
	const lv = $derived(levelOf(data.settings.level));

	// the student's local date
	const d = new Date();
	const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

	// svelte-ignore state_referenced_locally
	let minutes = $state(data.settings.minutes);
	const lessons = $derived(lessonsOf(data.settings.level, data.settings.tracks));
	// a course with no lesson at this level borrows one from the level below
	const fallback = $derived(LESSONS.filter((l) => l.level === Math.max(1, data.settings.level - 1)));
	const plan = $derived(buildPlan(lessons, data.progress, minutes, today, fallback));

	let summary = $state<{ today: { ref: string | null; minutes: number }[]; days: { date: string; minutes: number }[]; week: number } | null>(null);
	async function load() {
		const r = await fetch(`/api/practice?today=${today}`).catch(() => null);
		if (r?.ok) summary = await r.json();
	}
	onMount(load);
	const doneRefs = $derived(new Set(summary?.today.map((x) => x.ref) ?? []));
	const doneMinutes = $derived(plan.filter((b) => b.lesson && doneRefs.has(`lesson:${b.lesson.id}`)).reduce((n, b) => n + b.minutes, 0));

	async function mark(b: (typeof plan)[number], on: boolean, spent?: number) {
		if (!b.lesson) return;
		const ref = `lesson:${b.lesson.id}`;
		await fetch('/api/practice', {
			method: on ? 'POST' : 'DELETE',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(on ? { date: today, area: b.area, ref, minutes: Math.max(1, spent ?? b.minutes) } : { date: today, ref })
		});
		await load();
	}

	const pieceOfDay = $derived.by(() => {
		const mine = PIECES.filter((p) => p.level === data.settings.level && !p.draft);
		return mine.length ? mine[[...today].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % mine.length] : null;
	});
	const dayLabel = (s: string) => new Date(`${s}T12:00:00`).toLocaleDateString(lang() === 'en' ? 'en-GB' : 'ru-RU', { weekday: 'short' });
	const maxDay = $derived(Math.max(30, ...(summary?.days.map((x) => x.minutes) ?? [0])));
</script>

<svelte:head><title>{t('today.title')} · {t('app.name')}</title></svelte:head>

<header>
	<h1>{t('today.title')}</h1>
	<span class="tools">
		<a class="chip tun" href="/tuner">{t('tuner.open')}</a>
		<LangSwitch />
		<a href="/settings" aria-label={t('settings')} class="gear"><Settings size={22} /></a>
	</span>
</header>
<p class="muted small">{t('level')} {lv.n} · {tr(lv.title)}</p>

<h2>{t('plan.title')}</h2>
<div class="chips" role="radiogroup" aria-label={t('plan.howLong')}>
	{#each [15, 30, 45, 60, 90] as m (m)}
		<button class="chip" class:on={minutes === m} role="radio" aria-checked={minutes === m} onclick={() => (minutes = m)}>{m} {t('min')}</button>
	{/each}
</div>

{#if plan.length}
	<p class="muted small">{doneMinutes >= minutes ? t('plan.allDone') : t('plan.progress', { d: doneMinutes, n: minutes })}</p>
	<div class="total"><span style="width: {Math.min(100, (doneMinutes / minutes) * 100)}%"></span></div>
	<ol class="blocks">
		{#each plan as b (b.area)}
			{@const lt = b.lesson ? lessonText(b.lesson, lang()) : null}
			{@const done = b.lesson ? doneRefs.has(`lesson:${b.lesson.id}`) : false}
			<li class="card" class:done>
				<div class="head">
					<span class="area">{tr(AREAS.find((a) => a.key === b.area)!.title)} · {b.minutes} {t('min')}</span>
					<label class="ok"><input type="checkbox" checked={done} onchange={(e) => mark(b, e.currentTarget.checked)} /> {t('plan.done')}</label>
				</div>
				{#if b.lesson && lt}
					<a class="title" href="/program/{b.lesson.id}">{lt.title}</a>
					<p class="small muted goal">{lt.goal}</p>
					<BlockTimer id="{today}:{b.lesson.id}" minutes={b.minutes} onfinish={(spent) => mark(b, true, spent)} />
				{/if}
			</li>
		{/each}
	</ol>
{:else}
	<p class="muted">{t('plan.empty')}</p>
{/if}

{#if pieceOfDay}
	{@const pt = pieceText(pieceOfDay, lang())}
	<a class="card piece" href="/pieces/{pieceOfDay.id}">
		<span class="muted small">{t('today.piece')}</span>
		<b>{pt.title}</b>
		<span class="muted small">{pt.composer} · {pt.collection}</span>
	</a>
{/if}

{#if summary}
	<h2>{t('plan.week')}</h2>
	<div class="week">
		{#each summary.days as x (x.date)}
			<div class="day" class:today={x.date === today}>
				<span class="col"><span style="height: {(x.minutes / maxDay) * 100}%"></span></span>
				<span class="n">{x.minutes || ''}</span>
				<span class="lbl">{dayLabel(x.date)}</span>
			</div>
		{/each}
	</div>
	<p class="muted small">{t('plan.weekTotal', { m: summary.week })}</p>
{/if}

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.tools {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.tun {
		text-decoration: none;
	}
	.gear {
		display: inline-flex;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 8px;
	}
	.total {
		height: 8px;
		border-radius: 4px;
		background: var(--surface2);
		overflow: hidden;
		margin-bottom: 10px;
	}
	.total span {
		display: block;
		height: 100%;
		background: var(--good);
		transition: width 0.3s;
	}
	.blocks {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.blocks li {
		display: flex;
		flex-direction: column;
		gap: 6px;
		border-left: 4px solid var(--accent);
	}
	.blocks li.done {
		border-left-color: var(--good);
		opacity: 0.75;
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
	}
	.area {
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: var(--muted);
	}
	.ok {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 14px;
	}
	.ok input {
		width: 20px;
		height: 20px;
	}
	.title {
		font-weight: 700;
		font-size: 17px;
		text-decoration: none;
	}
	.goal {
		margin: 0;
	}
	.piece {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin: 14px 0;
		text-decoration: none;
	}
	.week {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 6px;
		align-items: end;
	}
	.day {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
	}
	.col {
		width: 100%;
		height: 70px;
		display: flex;
		align-items: flex-end;
		background: var(--surface2);
		border-radius: 6px;
		overflow: hidden;
	}
	.col span {
		width: 100%;
		background: var(--accent);
	}
	.day.today .col span {
		background: var(--good);
	}
	.n {
		font-size: 12px;
		font-weight: 600;
		min-height: 15px;
	}
	.lbl {
		font-size: 11px;
		color: var(--muted);
	}
</style>
