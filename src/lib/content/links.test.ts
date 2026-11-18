import { describe, expect, it } from 'vitest';
import { SITES, searchable } from './links.js';

describe('song catalogue links', () => {
	it('https links, both languages, searches encode the query', () => {
		for (const s of SITES) {
			expect(s.url, s.name).toMatch(/^https:\/\//);
			expect(s.note.ru && s.note.en, s.name).toBeTruthy();
		}
		const akk = searchable().find((s) => s.name === 'akkords.pro')!;
		expect(akk.search!('Король и Шут Лесник')).toBe('https://akkords.pro/?s=%D0%9A%D0%BE%D1%80%D0%BE%D0%BB%D1%8C%20%D0%B8%20%D0%A8%D1%83%D1%82%20%D0%9B%D0%B5%D1%81%D0%BD%D0%B8%D0%BA');
	});
});
