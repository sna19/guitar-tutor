/**
 * The textbook: parts by direction (basics, classical, Spanish guitar, pop and rock, jazz and blues), chapters of
 * short text with live blocks — chord boxes that sound, exercises with tab, pieces, a backing track, a flamenco
 * compás. Our own texts; the Spanish part follows the order of the classical methods (Aguado, Sor) and the basics
 * of flamenco.
 */
import type { L10n } from '../i18n.js';

export type Block =
	| { p: L10n }
	| { h: L10n }
	| { list: L10n[] }
	| { chords: string[] }
	| { ex: string }
	| { piece: string }
	| { jam: string }
	| { compas: string }
	| { lesson: string };

export interface Chapter {
	slug: string;
	title: L10n;
	blocks: Block[];
}
export interface Part {
	key: string;
	title: L10n;
	chapters: Chapter[];
}

const r = (ru: string, en: string): L10n => ({ ru, en });
const P = (ru: string, en: string): Block => ({ p: r(ru, en) });
const H = (ru: string, en: string): Block => ({ h: r(ru, en) });
const LI = (...items: [string, string][]): Block => ({ list: items.map(([a, b]) => r(a, b)) });

export const BOOK: Part[] = [
	{
		key: 'basics',
		title: r('Основы', 'Basics'),
		chapters: [
			{
				slug: 'guitar',
				title: r('Гитара, посадка, настройка', 'The guitar, posture, tuning'),
				blocks: [
					P('Шесть струн настроены снизу вверх по толщине: ми – ля – ре – соль – си – ми (E A D G B E). Первая струна — самая тонкая, шестая — самая толстая. Лады считаются от головки грифа.', 'Six strings tuned thickest to thinnest: E A D G B E. The 1st string is the thinnest, the 6th the thickest. Frets are counted from the headstock.'),
					H('Посадка', 'Posture'),
					LI(['Классическая: гитара на левом бедре (подставка под левую ногу), гриф поднят на 30–45°.', 'Classical: the guitar on the left thigh (a footstool under the left foot), the neck raised 30–45°.'], ['Эстрадная: на правом бедре, гриф почти горизонтально — удобно для боя.', 'Popular: on the right thigh, the neck nearly level — handy for strumming.'], ['Плечи свободны, большой палец левой руки — за грифом, напротив 2-го пальца.', 'Shoulders loose, the left thumb behind the neck, opposite the 2nd finger.']),
					H('Настройка', 'Tuning'),
					P('Настройте каждую струну по тюнеру приложения: он даёт эталонный звук и показывает по микрофону, выше струна или ниже. Подтягивайте снизу вверх к ноте — так строй держится лучше.', 'Tune each string with the app’s tuner: it plays the reference and shows by microphone whether the string is sharp or flat. Tune up to the note from below — the tuning holds better.'),
					{ lesson: 'l1-posture' }
				]
			},
			{
				slug: 'tab-chords',
				title: r('Табулатура и первые аккорды', 'Tab and the first chords'),
				blocks: [
					P('Табулатура — шесть линий-струн (верхняя — тонкая первая), цифра — лад, 0 — открытая струна. Ритм в табах часто не указан, поэтому в приложении табы стоят под нотами.', 'Tab is six string lines (the top one is the thin 1st), a number is a fret, 0 an open string. Tabs often omit rhythm, so in the app they sit under the staff.'),
					P('Аккордовая диаграмма — гриф стоя: вертикальные линии — струны (слева шестая), горизонтальные — лады; цифры в точках — пальцы, × — струна не звучит, ○ — открытая.', 'A chord box is the neck standing up: vertical lines are strings (the 6th on the left), horizontal ones are frets; numbers are fingers, × — not played, ○ — open.'),
					{ chords: ['Em', 'Am', 'C', 'G', 'D', 'E'] },
					P('Первая цель — менять Em ↔ Am ↔ C ↔ G в ритме, не останавливая правую руку. Пальцы ставьте все сразу, а не по одному.', 'First goal: change Em ↔ Am ↔ C ↔ G in time without stopping the strumming hand. Place the fingers all at once, not one by one.'),
					{ ex: 'ex:prog:Am-C-G-Em:4' }
				]
			},
			{
				slug: 'rhythm',
				title: r('Ритм и бой', 'Rhythm and strumming'),
				blocks: [
					P('Правая рука ходит маятником вниз-вверх восьмыми всё время — даже там, где струн не касается. Так ритм не сбивается при смене аккордов.', 'The strumming hand swings down-up in eighths all the time — even where it does not touch the strings. Then the rhythm survives the chord changes.'),
					LI(['«Шестёрка»: ↓ ↓↑ ↑↓↑ — главный бой дворовой и бардовской песни.', 'Folk strum: D DU UDU — the main campfire pattern.'], ['«Восьмёрка» рок: ↓ ↓↑↓ ↓↑ с акцентом на 2 и 4.', 'Rock: D DUD DU with accents on 2 and 4.'], ['Перебор p-i-m-a: большой палец — бас, i-m-a — тонкие струны.', 'Fingerpicking p-i-m-a: the thumb on the bass, i-m-a on the treble strings.']),
					{ jam: 'russian' }
				]
			}
		]
	},
	{
		key: 'classical',
		title: r('Классическая гитара', 'Classical guitar'),
		chapters: [
			{
				slug: 'right-hand',
				title: r('Правая рука: апояндо и тирандо', 'The right hand: rest and free strokes'),
				blocks: [
					P('Пальцы правой руки обозначаются по-испански: p — большой, i — указательный, m — средний, a — безымянный. Апояндо — удар с опорой на соседнюю струну (полный, певучий звук, для мелодии); тирандо — без опоры (для арпеджио и аккордов).', 'Right-hand fingers carry Spanish names: p — thumb, i — index, m — middle, a — ring. Apoyando — a rest stroke landing on the next string (full, singing — for melody); tirando — a free stroke (for arpeggios and chords).'),
					P('Чередуйте i-m на гамме и никогда не играйте одним пальцем дважды подряд.', 'Alternate i-m on scales and never use one finger twice in a row.'),
					{ ex: 'ex:scale:C:major' },
					{ piece: 'sor-op60-01' }
				]
			},
			{
				slug: 'reading',
				title: r('Ноты на гитаре', 'Reading music on the guitar'),
				blocks: [
					P('Гитара пишется в скрипичном ключе с восьмёркой внизу: звучит на октаву ниже написанного. Открытые струны: ми малой октавы на первой добавочной под станом (6-я), …, ми первой октавы — на четвёртом промежутке (1-я).', 'The guitar is written in the treble clef with an 8 below: it sounds an octave lower. The open low E sits three ledger lines below the staff; the open high E is in the top space.'),
					P('Учите ноты позиции I (лады 0–4) — в ней написаны первые пьесы Сора, Агуадо и Джулиани.', 'Learn the notes of position I (frets 0–4) — the first pieces of Sor, Aguado and Giuliani are written in it.'),
					{ ex: 'ex:scale:E:minor' },
					{ piece: 'aguado-op03n01' }
				]
			},
			{
				slug: 'arpeggio',
				title: r('Арпеджио и ведение мелодии', 'Arpeggios and carrying a melody'),
				blocks: [
					P('Этюды Джулиани ор. 50 и Каркасси ор. 60 учат главному в классике: мелодия звучит ярче арпеджио. Мелодию — апояндо, аккомпанемент — тирандо и тише.', 'Giuliani’s Op. 50 and Carcassi’s Op. 60 teach the classical essential: the melody sounds above the arpeggio. Melody rest-stroke, accompaniment free-stroke and softer.'),
					{ piece: 'giuliani-op50n01' },
					{ piece: 'carcassi-op60-03' }
				]
			}
		]
	},
	{
		key: 'spanish',
		title: r('Испанская гитара: самоучитель', 'Spanish guitar: a method'),
		chapters: [
			{
				slug: 'school',
				title: r('Испанская школа: Агуадо, Сор, Таррега', 'The Spanish school: Aguado, Sor, Tárrega'),
				blocks: [
					P('Дионисио Агуадо (1784–1849) и Фернандо Сор (1778–1839) написали школы игры, на которых учатся до сих пор; Франсиско Таррега (1852–1909) создал современную технику классической гитары. Их пьесы — основа этой части.', 'Dionisio Aguado (1784–1849) and Fernando Sor (1778–1839) wrote the methods still in use; Francisco Tárrega (1852–1909) shaped modern classical technique. Their pieces are the core of this part.'),
					LI(['Начало: Агуадо ор. 3, Сор ор. 60 — пьесы в первой позиции.', 'Start: Aguado Op. 3, Sor Op. 60 — pieces in the first position.'], ['Середина: Сор ор. 35, «Аделита» и «Испанский романс».', 'Middle: Sor Op. 35, Adelita and the Spanish Romance.'], ['Вершина: «Арабское каприччио» Тарреги.', 'Summit: Tárrega’s Capricho árabe.']),
					{ piece: 'aguado-op03n02' },
					{ piece: 'adelita' }
				]
			},
			{
				slug: 'rasgueado',
				title: r('Расгеадо, пикадо, альсапуа', 'Rasgueado, picado, alzapúa'),
				blocks: [
					P('Расгеадо — «веер»: пальцы a-m-i по очереди раскрываются из кулака по струнам вниз, затем i вверх; ровная дробь из 4–5 ударов. Пикадо — быстрые гаммы i-m с опорой (апояндо). Альсапуа — большой палец как медиатор: вниз по басам, вверх, и удар по струне.', 'Rasgueado — the “fan”: a-m-i flick out of the fist down across the strings in turn, then i up; an even roll of 4–5 strokes. Picado — fast i-m rest-stroke scales. Alzapúa — the thumb as a pick: down on the basses, up, and a stroke.'),
					P('Учите медленно под пальмас: каждый удар расгеадо — на долю.', 'Learn slowly with palmas: each rasgueado stroke on a beat.'),
					{ chords: ['Am', 'G', 'F', 'E'] },
					{ jam: 'andalusian' },
					{ lesson: 'l5-rasgueado' }
				]
			},
			{
				slug: 'compas',
				title: r('Компас: солеа, булериас, тангос, севильяна', 'Compás: soleá, bulerías, tangos, sevillanas'),
				blocks: [
					P('Компас — ритмический цикл стиля фламенко. Солеа и булериас считают 12 долей с акцентами на 3, 6, 8, 10, 12; булериас начинается с 12 и идёт быстро. Тангос — четыре доли, пальмас на 2-3-4. Севильяна — 3/4 с акцентом на раз.', 'Compás is the rhythmic cycle of a flamenco style. Soleá and bulerías count 12 beats with accents on 3, 6, 8, 10, 12; bulerías starts on 12 and runs fast. Tangos — four beats, palmas on 2-3-4. Sevillanas — 3/4 with the accent on one.'),
					{ compas: 'solea' },
					P('Хлопайте вместе с метрономом, потом играйте на акцентах аккорд E (фригийская тоника), между ними — F и G.', 'Clap with the metronome, then play E (the Phrygian tonic) on the accents and F and G between them.'),
					{ compas: 'bulerias' },
					{ compas: 'tangos' },
					{ compas: 'sevillanas' }
				]
			},
			{
				slug: 'phrygian',
				title: r('Андалузская каденция и фригийский лад', 'The Andalusian cadence and the Phrygian mode'),
				blocks: [
					P('Am – G – F – E: нисходящий бас ля–соль–фа–ми, и последний аккорд — E — звучит как тоника. Лад, в котором живёт фламенко, — фригийский от ми: ми–фа–соль–ля–си–до–ре с характерной полутоновой «фа» над тоникой; в мелодиях часто повышают соль до соль-диеза.', 'Am – G – F – E: the bass falls A–G–F–E, and the last chord, E, sounds like home. The mode of flamenco is E Phrygian: E–F–G–A–B–C–D, with the half step F above the tonic; melodies often raise G to G sharp.'),
					{ jam: 'andalusian' }
				]
			}
		]
	},
	{
		key: 'pop',
		title: r('Поп и рок', 'Pop and rock'),
		chapters: [
			{
				slug: 'barre-power',
				title: r('Баррэ и пауэр-аккорды', 'Barre and power chords'),
				blocks: [
					P('Баррэ — указательный палец кладётся на все струны, остальные строят форму E или A выше по грифу; так из пяти форм получается любой аккорд. Пауэр-аккорд — основной тон и квинта: ни мажор, ни минор, звучит плотно с перегрузом.', 'A barre lays the index finger across all strings while the others make an E or A shape higher up; five shapes give any chord. A power chord is root and fifth: neither major nor minor, tight with distortion.'),
					{ chords: ['F', 'Bm', 'E5', 'A5', 'D5', 'G5'] },
					{ jam: 'power' }
				]
			},
			{
				slug: 'songs',
				title: r('Как разбирать песню', 'How to learn a song'),
				blocks: [
					LI(['Найдите аккорды (страница «Ссылки» в «Песнях») и вставьте в «Мои песни».', 'Find the chords (“Links” in Songs) and paste them into “My songs”.'], ['Проверьте тональность на слух: при необходимости транспонируйте или поставьте каподастр.', 'Check the key by ear: transpose or use a capo if needed.'], ['Сначала только смены аккордов на каждый такт, потом бой, потом пение.', 'First only the chord changes a bar each, then the strumming, then the singing.']),
					{ jam: 'rockminor' }
				]
			}
		]
	},
	{
		key: 'jazz',
		title: r('Джаз и блюз', 'Jazz and blues'),
		chapters: [
			{
				slug: 'blues',
				title: r('Блюз: 12 тактов и пентатоника', 'Blues: 12 bars and the pentatonic'),
				blocks: [
					P('Форма блюза: I7 четыре такта, IV7 два, I7 два, V7 – IV7 – I7 – V7. В ля: A7, D7, E7. Для соло — минорная пентатоника от ля (ля–до–ре–ми–соль) плюс «блюзовая нота» ми-бемоль.', 'The blues form: I7 for four bars, IV7 two, I7 two, V7 – IV7 – I7 – V7. In A: A7, D7, E7. To solo: the A minor pentatonic (A–C–D–E–G) plus the blue note E flat.'),
					{ ex: 'ex:penta:A' },
					{ jam: 'blues' }
				]
			},
			{
				slug: 'ii-v-i',
				title: r('Септаккорды и ii–V–I', 'Seventh chords and ii–V–I'),
				blocks: [
					P('Джаз строится на септаккордах: maj7 (мягкий, тоника), m7 (вторая ступень), 7 (доминанта). Оборот ii–V–I — Dm7 – G7 – Cmaj7 — встречается почти в каждом стандарте. Слушайте, как септима одного аккорда сползает в терцию следующего.', 'Jazz is built on seventh chords: maj7 (soft, the tonic), m7 (the second degree), 7 (the dominant). ii–V–I — Dm7 – G7 – Cmaj7 — is in almost every standard. Hear the seventh of one chord slide into the third of the next.'),
					{ chords: ['Dm7', 'G7', 'Cmaj7', 'Am7', 'E7'] },
					{ jam: 'jazz' }
				]
			}
		]
	}
];

export const chapterBySlug = (slug: string) => {
	for (const part of BOOK) for (const ch of part.chapters) if (ch.slug === slug) return { part, chapter: ch };
	return null;
};
