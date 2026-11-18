import { getDb } from '#lib/server/db.js';
import { listSongs } from '#lib/server/songs.js';

export function load() {
	return { mine: listSongs(getDb()).map((s) => ({ id: s.id, title: s.title, artist: s.artist })) };
}
