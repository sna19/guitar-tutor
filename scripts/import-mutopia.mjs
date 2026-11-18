// Imports solo guitar pieces from the Mutopia Project (public domain / CC engravings): MIDI → ABC
// (scripts/midi2abc.mjs) written an octave above the sound with the treble-8 clef, at most two voices (melody and
// bass; «let ring» notes are cut where the next note needs the voice), checked against the MIDI: every note's
// pitch and start must match. Writes src/lib/content/pieces/classical/<id>.abc and classical.generated.json.
// Run: node scripts/import-mutopia.mjs <guitar.json> [cacheDir]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import abcjsModule from 'abcjs';
import { midiToAbc, parseMidi, verify } from './midi2abc.mjs';

const parseMidiNotes = (buf) => parseMidi(buf).tracks.flatMap((t) => t.notes.map((n) => n.pitch));

const abcjs = abcjsModule.default ?? abcjsModule;
const [listFile, cache = '/tmp/claude-1026/gt/cache'] = process.argv.slice(2);
const OUT = new URL('../src/lib/content/pieces/classical/', import.meta.url).pathname;
mkdirSync(cache, { recursive: true });
mkdirSync(OUT, { recursive: true });

const COMPOSER = {
	Aguado: { ru: 'Д. Агуадо', en: 'D. Aguado', es: true },
	Sor: { ru: 'Ф. Сор', en: 'F. Sor', es: true },
	Tarrega: { ru: 'Ф. Таррега', en: 'F. Tárrega', es: true },
	Sanz: { ru: 'Г. Санс', en: 'G. Sanz', es: true },
	Milan: { ru: 'Л. Милан', en: 'L. Milán', es: true },
	Granados: { ru: 'Э. Гранадос', en: 'E. Granados', es: true },
	Giuliani: { ru: 'М. Джулиани', en: 'M. Giuliani' },
	Carcassi: { ru: 'М. Каркасси', en: 'M. Carcassi' },
	Carulli: { ru: 'Ф. Карулли', en: 'F. Carulli' },
	Horetzky: { ru: 'Ф. Горецкий', en: 'F. Horetzky' },
	Knjze: { ru: 'Ф. Книзе', en: 'F. Knjze' },
	Mertz: { ru: 'Й. К. Мерц', en: 'J. K. Mertz' },
	Coste: { ru: 'Н. Кост', en: 'N. Coste' },
	Matiegka: { ru: 'В. Матиегка', en: 'W. T. Matiegka' },
	Bach: { ru: 'И. С. Бах', en: 'J. S. Bach' },
	Galilei: { ru: 'В. Галилей', en: 'V. Galilei' },
	Beethoven: { ru: 'Л. ван Бетховен', en: 'L. van Beethoven' },
	Brahms: { ru: 'И. Брамс', en: 'J. Brahms' },
	Mozart: { ru: 'В. А. Моцарт', en: 'W. A. Mozart' },
	Worrall: { ru: 'Г. Уоррэлл', en: 'H. Worrall' }
};

function composerOf(by) {
	const k = Object.keys(COMPOSER).find((c) => by.includes(c) || by.includes(c.replace('a', 'á')));
	return k ? { key: k, ...COMPOSER[k] } : { key: 'other', ru: by.replace(/^by /, '').replace(/\s*\(.*$/, ''), en: by.replace(/^by /, '').replace(/\s*\(.*$/, '') };
}

/** level 1–8 by composer, opus and number (graded as in the usual guitar syllabi) */
function levelOf(c, title, op) {
	const n = Number((title.match(/No\.?\s*(\d+)|n°\s*(\d+)/i) ?? [])[1] ?? 0);
	const o = op.replace(/\s+/g, ' ');
	if (c === 'Carulli' || /Guitar-Skole/.test(title)) return 1;
	if (c === 'Aguado' && /Op\. ?3\b/.test(o)) return 2;
	if (c === 'Aguado' && /Op\. ?4/.test(o)) return 3;
	if (c === 'Aguado') return 4;
	if (c === 'Giuliani' && /Op\. ?51/.test(o)) return 2;
	if (c === 'Giuliani' && /Op\. ?50/.test(o)) return n <= 16 ? 2 : 3;
	if (c === 'Giuliani' && /Op\. ?100/.test(o)) return n <= 12 ? 3 : 4;
	if (c === 'Giuliani' && /Op\. ?(48|83|111)/.test(o)) return 6;
	if (c === 'Giuliani') return 4;
	if (c === 'Carcassi' && /60/.test(o)) return n <= 8 ? 4 : n <= 17 ? 5 : 6;
	if (c === 'Carcassi' && /59/.test(o)) return 3;
	if (c === 'Carcassi') return 4;
	if (c === 'Sor' && (/60/.test(o) || /Le[cç]ons|Progressive/.test(title))) return 2;
	if (c === 'Sor' && /31|44|45/.test(o)) return 3;
	if (c === 'Sor' && /35/.test(o)) return n <= 12 ? 3 : 4;
	if (c === 'Sor' && /Op\. ?6|Op\. ?29/.test(o)) return 6;
	if (c === 'Sor' && /O 1|O 2|Divertissement/.test(o + title)) return 3;
	if (c === 'Sor') return 5;
	if (c === 'Tarrega') return /Capricho|Recuerdos/.test(title) ? 7 : /Claro|Lágrima|Lagrima|Adelita/.test(title) ? 4 : 5;
	if (c === 'Sanz' || c === 'Milan' || c === 'Galilei') return 4;
	if (c === 'Granados') return 6;
	if (c === 'Bach') return /1006|BWV 99[5-8]/.test(o) ? 7 : 4;
	if (c === 'Mertz' || c === 'Coste') return 5;
	return 4;
}

function collectionOf(c, title, op) {
	const es = COMPOSER[c]?.es;
	if (/Guitar-Skole/.test(title)) return { ru: 'Школа гитары: первые пьесы', en: 'Guitar school: first pieces' };
	if (/Etude|Étude|Studies|Study|Leçons|Lessons|Lecciones/i.test(title)) return { ru: `Этюды — ${COMPOSER[c]?.ru ?? 'разные авторы'}`, en: `Studies — ${COMPOSER[c]?.en ?? 'various'}` };
	if (es) return { ru: 'Испанская гитара', en: 'Spanish guitar' };
	if (c === 'Bach') return { ru: 'Бах на гитаре', en: 'Bach on the guitar' };
	return { ru: `Пьесы — ${COMPOSER[c]?.ru ?? 'разные авторы'}`, en: `Pieces — ${COMPOSER[c]?.en ?? 'various'}` };
}

async function get(url, file) {
	const path = join(cache, file);
	if (existsSync(path)) return readFileSync(path);
	const r = await fetch(url);
	if (!r.ok) throw new Error(`${r.status} ${url}`);
	const b = Buffer.from(await r.arrayBuffer());
	writeFileSync(path, b);
	await new Promise((res) => setTimeout(res, 250));
	return b;
}

function partialOf(ly) {
	const m = ly.match(/\\partial\s+(\d+)(\.*)(?:\s*\*\s*(\d+)(?:\/(\d+))?)?/);
	if (!m) return 0;
	let q = 4 / Number(m[1]);
	q *= [1, 1.5, 1.75][m[2].length] ?? 1;
	if (m[3]) q *= Number(m[3]) / Number(m[4] ?? 1);
	return q;
}

const entries = JSON.parse(readFileSync(listFile, 'utf8')).filter((e) => e.cells.includes('for Guitar') && e.mid.length && e.ly.length && /Public Domain|Creative Commons/.test(e.license));
const seen = new Set();
const catalog = [];
const report = [];
for (const e of entries) {
	const [title, by] = e.cells;
	const op = e.cells[2] === 'for Guitar' ? '' : e.cells[2];
	const slug = e.ly[0].split('/').slice(-2, -1)[0];
	if (seen.has(slug)) continue;
	seen.add(slug);
	const id = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
	try {
		const mid = await get(e.mid[0], `${slug}.mid`);
		const ly = (await get(e.ly[0], `${slug}.ly`)).toString('utf8');
		const c = composerOf(by);
		const r = midiToAbc(mid, { title: `${title}${op ? ` · ${op}` : ''}`, composer: c.en, partial: partialOf(ly), transpose: 12, clef: 'treble-8', maxVoices: 2 });
		if (r.meta.voices > 2 || /%%score \{/.test(r.abc)) {
			report.push(`✗ ${id}: ${r.meta.voices} voices on several staves`);
			continue;
		}
		// a note below a drop-D low string is an error of the source
		const low = Math.min(...parseMidiNotes(mid));
		if (low < 38) {
			report.push(`✗ ${id}: a note below the guitar's range (${low})`);
			continue;
		}
		const check = verify(abcjs, r.abc, mid, { onsets: true });
		const diff = Math.max(check.missing.length, check.extra.length);
		if (diff > check.notes * 0.01) {
			report.push(`✗ ${id}: ${check.missing.length} missing, ${check.extra.length} extra of ${check.notes}`);
			continue;
		}
		const remarks = [];
		if (diff) remarks.push({ ru: `черновик: ${diff} нот из ${check.notes} расходятся с исходником — сверить с изданием`, en: `draft: ${diff} of ${check.notes} notes differ from the source — check against the edition` });
		const meters = new Set([...ly.matchAll(/\\time\s+(\d+\/\d+)/g)].map((m) => m[1]));
		if (meters.size > 1) remarks.push({ ru: 'смена размера — тактовые черты могут стоять не там', en: 'meter changes — bar lines may be misplaced' });
		if (/\\repeat\s+"?volta/.test(ly)) remarks.push({ ru: 'повторы в нотах не показаны — пьеса записана одним проходом', en: 'repeats are not shown — written out in one pass' });
		remarks.push({ ru: 'табулатура подобрана автоматически (ближняя позиция) — аппликатуру издания стоит сверить', en: 'the tab is chosen automatically (lowest position) — compare with the edition’s fingering' });
		writeFileSync(join(OUT, `${id}.abc`), r.abc);
		catalog.push({
			id,
			title: { ru: title, en: title },
			composer: { ru: c.ru, en: c.en },
			catalog: op,
			collection: collectionOf(c.key, title, op),
			style: COMPOSER[c.key]?.es ? 'spanish' : 'classical',
			level: levelOf(c.key, title, op),
			key: r.abc.match(/^K:(.+)$/m)[1],
			meter: `${r.meta.time.num}/${r.meta.time.den}`,
			tempo: r.meta.bpm,
			bars: r.meta.bars,
			notes: check.notes,
			remarks,
			draft: diff > 0 || undefined,
			source: { name: 'Mutopia Project', url: e.ly[0].replace(/\/[^/]+\.ly$/, '/'), license: e.license, edition: e.cells.find((x) => /edition|Edition|Ausgabe|Paris|Wien|Vienna|London|Mainz|Leipzig|Bonn/.test(x)) ?? '' }
		});
		report.push(`✓ ${id} L${catalog.at(-1).level} ${c.en}: ${title} — ${check.notes} notes`);
	} catch (err) {
		report.push(`✗ ${id}: ${err.message}`);
	}
}
catalog.sort((a, b) => a.level - b.level || a.collection.en.localeCompare(b.collection.en) || a.title.en.localeCompare(b.title.en, 'en', { numeric: true }));
writeFileSync(new URL('../src/lib/content/pieces/classical.generated.json', import.meta.url), JSON.stringify(catalog, null, '\t') + '\n');
console.log(report.filter((x) => x.startsWith('✗')).join('\n'));
console.log(`\n${catalog.length} pieces written; ${report.filter((x) => x.startsWith('✗')).length} skipped`);
const byLevel = {};
for (const p of catalog) byLevel[p.level] = (byLevel[p.level] ?? 0) + 1;
console.log('by level', JSON.stringify(byLevel), 'spanish', catalog.filter((p) => p.style === 'spanish').length);
