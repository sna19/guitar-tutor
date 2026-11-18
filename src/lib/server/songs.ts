import { asc, eq } from 'drizzle-orm';
import type { Db } from './db.js';
import { songs } from './schema.js';
import { InputError } from './settings.js';

export interface SongInput {
	title?: unknown;
	artist?: unknown;
	sheet?: unknown;
	capo?: unknown;
	tempo?: unknown;
	pattern?: unknown;
	level?: unknown;
}

function clean(b: SongInput, partial: boolean) {
	const v: Partial<typeof songs.$inferInsert> = {};
	if (!partial || b.title !== undefined) {
		const t = String(b.title ?? '').trim();
		if (!t) throw new InputError('Название песни');
		v.title = t.slice(0, 200);
	}
	if (b.artist !== undefined) v.artist = String(b.artist).trim().slice(0, 200);
	if (!partial || b.sheet !== undefined) {
		const s = String(b.sheet ?? '');
		if (!s.trim()) throw new InputError('Текст с аккордами');
		if (s.length > 50_000) throw new InputError('Слишком длинный текст');
		v.sheet = s;
	}
	if (b.capo !== undefined) {
		const c = Number(b.capo);
		if (!Number.isInteger(c) || c < 0 || c > 9) throw new InputError('Каподастр: лад 0–9');
		v.capo = c;
	}
	if (b.tempo !== undefined) {
		const t = Number(b.tempo);
		if (!Number.isInteger(t) || t < 40 || t > 220) throw new InputError('Темп 40–220');
		v.tempo = t;
	}
	if (b.pattern !== undefined) {
		const p = String(b.pattern);
		if (!/^[DU-]{4,16}$/.test(p)) throw new InputError('Бой: буквы D, U и «-»');
		v.pattern = p;
	}
	if (b.level !== undefined) v.level = b.level === null ? null : Math.min(8, Math.max(1, Number(b.level) || 1));
	return v;
}

export const listSongs = (db: Db) => db.select().from(songs).orderBy(asc(songs.artist), asc(songs.title)).all();
export const getSong = (db: Db, id: number) => db.select().from(songs).where(eq(songs.id, id)).get() ?? null;

export function addSong(db: Db, b: SongInput) {
	return db.insert(songs).values(clean(b, false) as typeof songs.$inferInsert).returning().get();
}

export function updateSong(db: Db, id: number, b: SongInput) {
	if (!getSong(db, id)) throw new InputError('Нет такой песни');
	db.update(songs).set({ ...clean(b, true), updatedAt: new Date().toISOString() }).where(eq(songs.id, id)).run();
	return getSong(db, id)!;
}

export function removeSong(db: Db, id: number) {
	db.delete(songs).where(eq(songs.id, id)).run();
}
