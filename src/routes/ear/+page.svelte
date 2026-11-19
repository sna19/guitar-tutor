<script lang="ts">
	import { strum } from '#lib/pluck.js';
	import { question, type Mode, type Question } from '#lib/ear.js';
	import { lang, t } from '#lib/i18n.js';

	/** Ear training: listen, answer, the right one lights up; the score of this sitting. */
	let mode = $state<Mode>('interval');
	let difficulty = $state(1);
	let q = $state<Question | null>(null);
	let picked = $state<string | null>(null);
	let right = $state(0);
	let asked = $state(0);

	function listen() {
		if (!q) return;
		if (q.together) strum(q.notes, { spread: 20, seconds: 2.5 });
		else q.notes.forEach((n, i) => setTimeout(() => strum([n], { seconds: 1.8 }), i * 700));
	}
	function next() {
		q = question(mode, difficulty);
		picked = null;
		listen();
	}
	function answer(k: string) {
		if (!q || picked) return;
		picked = k;
		asked++;
		if (k === q.answer) right++;
	}
	function setMode(m: Mode) {
		mode = m;
		q = null;
		picked = null;
	}
	const MODES: { key: Mode; ru: string; en: string }[] = [
		{ key: 'interval', ru: 'Интервалы', en: 'Intervals' },
		{ key: 'chord', ru: 'Аккорды', en: 'Chords' },
		{ key: 'string', ru: 'Струны', en: 'Strings' }
	];
</script>

<svelte:head><title>{t('ear.title')} · {t('app.name')}</title></svelte:head>

<a class="muted small" href="/program">‹ {t('tab.program')}</a>
<h1>{t('ear.title')}</h1>
<p class="muted small">{t('ear.intro')}</p>

<div class="chips">
	{#each MODES as m (m.key)}<button class="chip" class:on={mode === m.key} onclick={() => setMode(m.key)}>{m[lang()]}</button>{/each}
</div>
{#if mode !== 'string'}
	<div class="chips">
		{#each [1, 2, 3] as d (d)}<button class="chip" class:on={difficulty === d} onclick={() => ((difficulty = d), (q = null))}>{t('ear.level', { n: d })}</button>{/each}
	</div>
{/if}

<div class="card box">
	{#if !q}
		<button class="btn big" onclick={next}>▶ {t('ear.start')}</button>
	{:else}
		<div class="row">
			<button class="chip" onclick={listen}>🔁 {t('ear.again')}</button>
			<span class="muted small">{t('ear.score', { r: right, n: asked })}</span>
		</div>
		<div class="answers">
			{#each q.choices as c (c.key)}
				<button class="ans" class:ok={picked && c.key === q.answer} class:bad={picked === c.key && c.key !== q.answer} onclick={() => answer(c.key)}>{c.label[lang()]}</button>
			{/each}
		</div>
		{#if picked}<button class="btn" onclick={next}>{picked === q.answer ? t('ear.right') : t('ear.wrong')} · {t('ear.next')} ›</button>{/if}
	{/if}
</div>

<style>
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin: 8px 0;
	}
	.box {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 10px;
	}
	.big {
		min-height: 56px;
		font-size: 18px;
	}
	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.answers {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
	}
	.ans {
		min-height: 48px;
		border: 1px solid var(--line);
		border-radius: var(--r1);
		background: var(--bg);
		cursor: pointer;
		font-size: 15px;
	}
	.ans.ok {
		background: var(--good);
		border-color: var(--good);
		color: #fff;
	}
	.ans.bad {
		background: var(--bad);
		border-color: var(--bad);
		color: #fff;
	}
</style>
