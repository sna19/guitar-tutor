<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { strum } from './pluck.js';
	import { t } from './i18n.js';

	/**
	 * A block's timer: start / pause, counts down the block's minutes; at the end a soft strum and a buzz. The time
	 * spent survives a reload (browser storage by date and block).
	 */
	let { id, minutes, onfinish }: { id: string; minutes: number; onfinish?: (spent: number) => void } = $props();
	let spent = $state(0); // seconds
	let running = $state(false);
	let ticker: ReturnType<typeof setInterval> | undefined;
	let lastTick = 0;
	const key = $derived(`timer:${id}`);
	const left = $derived(Math.max(0, minutes * 60 - spent));
	const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

	onMount(() => {
		try {
			spent = Number(localStorage.getItem(key)) || 0;
		} catch {
			/* no storage */
		}
	});
	function save() {
		try {
			localStorage.setItem(key, String(Math.round(spent)));
		} catch {
			/* no storage */
		}
	}
	function toggle() {
		if (running) {
			running = false;
			clearInterval(ticker);
			save();
			return;
		}
		running = true;
		lastTick = Date.now();
		ticker = setInterval(() => {
			const now = Date.now();
			spent += (now - lastTick) / 1000;
			lastTick = now;
			if (Math.round(spent) % 10 === 0) save();
			if (spent >= minutes * 60) {
				running = false;
				clearInterval(ticker);
				save();
				strum([40, 47, 52, 55, 59, 64], { seconds: 3, volume: 0.6 });
				navigator.vibrate?.([200, 100, 200]);
				onfinish?.(Math.round(spent / 60));
			}
		}, 250);
	}
	function reset() {
		running = false;
		clearInterval(ticker);
		spent = 0;
		save();
	}
	onDestroy(() => {
		clearInterval(ticker);
		if (typeof window !== 'undefined' && spent) save();
	});
</script>

<div class="tm">
	<button class="go" class:on={running} onclick={toggle} aria-label={running ? t('timer.pause') : t('timer.start')}>{running ? '❚❚' : '▶'}</button>
	<span class="left" class:over={left === 0}>{fmt(left)}</span>
	<span class="bar"><span style="width: {Math.min(100, (spent / (minutes * 60)) * 100)}%"></span></span>
	{#if spent > 0 && !running}<button class="rs" onclick={reset} aria-label={t('timer.reset')}>↺</button>{/if}
</div>

<style>
	.tm {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.go {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: none;
		background: var(--accent);
		color: var(--accent-text);
		font-size: 15px;
		cursor: pointer;
	}
	.go.on {
		background: var(--text);
		color: var(--bg);
	}
	.left {
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		min-width: 44px;
	}
	.left.over {
		color: var(--good);
	}
	.bar {
		flex: 1;
		height: 6px;
		border-radius: 3px;
		background: var(--surface2);
		overflow: hidden;
	}
	.bar span {
		display: block;
		height: 100%;
		background: var(--good);
	}
	.rs {
		border: none;
		background: none;
		color: var(--muted);
		font-size: 18px;
		cursor: pointer;
		min-width: 32px;
		min-height: 32px;
	}
</style>
