/**
 * The guitar program — eight levels, like semesters of a music college, with parallel courses: technique, theory
 * and harmony, ear, repertoire, rhythm and songs, improvisation. Built on the structure of modern college programs
 * (Berklee among them: harmony by function, ensemble and improvisation from the first semester, styles side by
 * side), with our own lessons — not an official program of any school. The Spanish guitar course follows the
 * classical methods in the public domain (Aguado, Sor, Tárrega) plus flamenco basics.
 *
 * A lesson's materials: pieces `piece:<id>`, chords `chord:<name>`, generated exercises `ex:…` (exercises.ts).
 */
import type { L10n, Lang } from '../i18n.js';

export type Area = 'technique' | 'theory' | 'ear' | 'repertoire' | 'rhythm' | 'improv';
export type Track = 'core' | 'classical' | 'spanish' | 'rock' | 'jazz' | 'blues' | 'pop';

export interface Lesson {
	id: string;
	level: number;
	area: Area;
	track: Track;
	title: L10n;
	goal: L10n;
	tasks: L10n[];
	materials: string[];
	done: L10n;
	minutes: number;
}

export const AREAS: { key: Area; title: L10n }[] = [
	{ key: 'technique', title: { ru: 'Техника', en: 'Technique' } },
	{ key: 'rhythm', title: { ru: 'Ритм и песни', en: 'Rhythm and songs' } },
	{ key: 'theory', title: { ru: 'Теория и гармония', en: 'Theory and harmony' } },
	{ key: 'ear', title: { ru: 'Слух', en: 'Ear training' } },
	{ key: 'repertoire', title: { ru: 'Репертуар', en: 'Repertoire' } },
	{ key: 'improv', title: { ru: 'Импровизация', en: 'Improvisation' } }
];

export const TRACK_TITLE: Record<Track, L10n> = {
	core: { ru: 'для всех', en: 'for everyone' },
	classical: { ru: 'классика', en: 'classical' },
	spanish: { ru: 'испанская гитара', en: 'Spanish guitar' },
	rock: { ru: 'рок', en: 'rock' },
	jazz: { ru: 'джаз', en: 'jazz' },
	blues: { ru: 'блюз', en: 'blues' },
	pop: { ru: 'поп', en: 'pop' }
};

const r = (ru: string, en: string): L10n => ({ ru, en });
const L = (level: number, area: Area, track: Track, slug: string, title: L10n, goal: L10n, tasks: L10n[], materials: string[], done: L10n, minutes = 10): Lesson => ({
	id: `l${level}-${slug}`, level, area, track, title, goal, tasks, materials, done, minutes
});

export const LESSONS: Lesson[] = [
	// ── 1. Первые аккорды ────────────────────────────────────────────────────────────────────────────────────
	L(1, 'technique', 'core', 'posture', r('Посадка, настройка, звукоизвлечение', 'Posture, tuning, the first sounds'), r('Держать гитару удобно, настроить её и извлечь чистый звук.', 'Hold the guitar comfortably, tune it and play a clean note.'), [
		r('Строй от толстой струны: ми – ля – ре – соль – си – ми (E A D G B E). Настройте по тюнеру.', 'Tuning from the thickest string: E A D G B E. Tune with a tuner.'),
		r('Прижимайте струну кончиком пальца у самой ладовой пластины — меньше силы, чище звук.', 'Press the string with the fingertip right behind the fret — less force, a cleaner sound.'),
		r('«Паук» медленно: лады 1-2-3-4 каждым пальцем на каждой струне.', 'The spider slowly: frets 1-2-3-4 with each finger on every string.')
	], ['ex:spider'], r('«Паук» без жужжания струн на 60 ударов, восьмыми.', 'The spider without buzzing at 60 bpm in eighths.')),
	L(1, 'rhythm', 'core', 'first-chords', r('Первые аккорды: Em, Am, C, G, D', 'First chords: Em, Am, C, G, D'), r('Брать пять открытых аккордов и менять их.', 'Play five open chords and change between them.'), [
		r('Каждый аккорд: поставьте пальцы, сыграйте струны по одной — все звучат?', 'Each chord: place the fingers, play the strings one by one — do they all ring?'),
		r('Смена Em ↔ Am, Am ↔ C, C ↔ G: «одна минута смен» — сколько раз успеете.', 'Changes Em ↔ Am, Am ↔ C, C ↔ G: “one-minute changes” — count how many.'),
		r('Бой вниз на каждую долю под прогрессию.', 'Strum down on every beat with the progression.')
	], ['chord:Em', 'chord:Am', 'chord:C', 'chord:G', 'chord:D', 'ex:prog:Am-C-G-Em:4'], r('Прогрессия Am–C–G–Em без остановок на 70, смена в ритме.', 'Am–C–G–Em without stopping at 70, changing in time.'), 15),
	L(1, 'rhythm', 'core', 'strum-1', r('Бой «шестёрка» и счёт', 'The basic strum and counting'), r('Держать ровный ритм правой рукой.', 'Keep a steady rhythm with the strumming hand.'), [
		r('Рука ходит постоянно вниз-вверх восьмыми; задевайте струны только там, где нужно.', 'The hand keeps moving down-up in eighths; touch the strings only where needed.'),
		r('Схема «вниз, вниз-вверх, вверх-вниз-вверх» — считайте «раз-и-два-и…».', 'Pattern “down, down-up, up-down-up” — count “one-and-two-and…”.')
	], ['ex:prog:Em-C-G-D:4'], r('Две минуты боя на Em–C–G–D без сбоев.', 'Two minutes of strumming on Em–C–G–D without slips.')),
	L(1, 'theory', 'core', 'tab', r('Табулатура и ноты на первых ладах', 'Tab and the notes on the first frets'), r('Читать табулатуру и знать ноты открытых струн.', 'Read tab and know the open-string notes.'), [
		r('Табулатура: шесть линий — струны (верхняя — тонкая), цифры — лады.', 'Tab: six lines are strings (top is the thin one), numbers are frets.'),
		r('Ноты гаммы ми минор на открытых струнах и первых ладах.', 'The E minor scale on open strings and the first frets.')
	], ['ex:scale:E:minor'], r('Сыграть гамму ми минор по табулатуре вверх и вниз.', 'Play the E minor scale from tab up and down.')),

	// ── 2. Песни у костра ────────────────────────────────────────────────────────────────────────────────────
	L(2, 'technique', 'core', 'fingerpick', r('Перебор: p-i-m-a', 'Fingerpicking: p-i-m-a'), r('Большой палец — басы, i-m-a — тонкие струны.', 'The thumb plays the basses, i-m-a the treble strings.'), [
		r('p — 6/5/4 струна (бас аккорда), i — 3-я, m — 2-я, a — 1-я.', 'p — 6th/5th/4th (the chord’s bass), i — 3rd, m — 2nd, a — 1st.'),
		r('Перебор p-i-m-a-m-i на Am, C, G, E.', 'Pattern p-i-m-a-m-i on Am, C, G, E.')
	], ['ex:prog:Am-C-G-E:4', 'piece:sor-op60-01'], r('Перебор на прогрессии и первый урок Сора ор. 60.', 'The pattern on the progression and Sor Op. 60 No. 1.'), 15),
	L(2, 'rhythm', 'rock', 'songs-open', r('Песни на открытых аккордах', 'Songs on open chords'), r('Играть песню целиком: смена аккордов в ритме, бой, вступление и окончание.', 'Play a whole song: changes in time, strumming, an intro and an ending.'), [
		r('Возьмите песню из раздела «Песни» вашего уровня — сначала только смены, потом с боем.', 'Take a song from “Songs” at your level — first only the changes, then with strumming.'),
		r('Пойте или напевайте мелодию — так проще держать форму.', 'Sing or hum the tune — it keeps the form.')
	], ['ex:prog:Am-Dm-E-Am:4', 'chord:E7', 'chord:Dm'], r('Две песни от начала до конца без остановок.', 'Two songs from start to end without stopping.'), 15),
	L(2, 'theory', 'core', 'keys-chords', r('Аккорды тональности', 'The chords of a key'), r('Какие аккорды «живут» в ля миноре и до мажоре.', 'Which chords live in A minor and C major.'), [
		r('Ля минор: Am – Dm – E (гармонический) — тоника, субдоминанта, доминанта.', 'A minor: Am – Dm – E (harmonic) — tonic, subdominant, dominant.'),
		r('До мажор: C – F – G7 — те же функции.', 'C major: C – F – G7 — the same functions.')
	], ['ex:prog:Am-Dm-E-Am:4', 'ex:scale:C:major'], r('Подберёте аккомпанемент к простой песне в ля миноре на слух.', 'You find the chords of a simple A minor song by ear.')),
	L(2, 'repertoire', 'classical', 'first-pieces', r('Первые пьесы: Агуадо и Сор', 'First pieces: Aguado and Sor'), r('Мелодия и бас вместе.', 'Melody and bass together.'), [
		r('Сначала бас (p), потом мелодию (i-m), потом вместе медленно.', 'First the bass (p), then the melody (i-m), then together slowly.')
	], ['piece:aguado-op03n01', 'piece:sor-op60-02', 'piece:giuliani-op50n01'], r('Одна пьеса наизусть, ровно.', 'One piece by heart, evenly.'), 15),
	L(2, 'improv', 'blues', 'penta-1', r('Пентатоника ля минор: первые фразы', 'A minor pentatonic: first phrases'), r('Импровизировать на одной позиции.', 'Improvise in one position.'), [
		r('Гамма с 5 лада, по одной ноте на удар — потом фразы по 3–4 ноты с паузами.', 'The scale from the 5th fret, one note a beat — then phrases of 3–4 notes with rests.')
	], ['ex:penta:A', 'ex:prog:Am-Dm-E-Am:4'], r('Две минуты фраз под прогрессию.', 'Two minutes of phrases over the progression.')),

	// ── 3. Баррэ и ритм ──────────────────────────────────────────────────────────────────────────────────────
	L(3, 'technique', 'core', 'barre', r('Баррэ: F и Bm', 'Barre: F and Bm'), r('Чистое баррэ без лишней силы.', 'A clean barre without extra force.'), [
		r('Указательный — чуть на рёбрышке, близко к ладу; давит рука, а не только палец.', 'The index finger slightly on its side, close to the fret; the arm pulls, not only the finger.'),
		r('Сначала малое баррэ (Fmaj7 → F), смена C → F медленно.', 'First a small barre (Fmaj7 → F), C → F slowly.')
	], ['chord:F', 'chord:Bm', 'chord:Fmaj7', 'ex:prog:Am-F-C-G:4'], r('Am–F–C–G без провалов звука на 80.', 'Am–F–C–G without dead notes at 80.'), 15),
	L(3, 'rhythm', 'rock', 'power', r('Рок-ритм: пауэр-аккорды и глушение', 'Rock rhythm: power chords and palm muting'), r('Плотный рок-ритм восьмыми.', 'A tight rock rhythm in eighths.'), [
		r('Пауэр-аккорды E5, A5, D5, G5 — два-три звука, медиатор вниз.', 'Power chords E5, A5, D5, G5 — two or three notes, downstrokes.'),
		r('Ребро ладони на струнах у подставки — глухой «чаг»; восьмые, акцент на 2 и 4.', 'The palm edge on the strings at the bridge — a muted “chug”; eighths, accents on 2 and 4.')
	], ['chord:E5', 'chord:A5', 'chord:D5', 'chord:G5', 'ex:prog:E5-G5-A5-E5:4'], r('Рифф на пауэр-аккордах 2 минуты ровно.', 'A power-chord riff for 2 minutes, steady.'), 15),
	L(3, 'repertoire', 'classical', 'giuliani', r('Джулиани ор. 50 и Сор ор. 35', 'Giuliani Op. 50 and Sor Op. 35'), r('Арпеджио и ведение мелодии.', 'Arpeggios and carrying a melody.'), [
		r('Мелодия — с опорой (апояндо), арпеджио — легко.', 'The melody rest-stroke (apoyando), the arpeggio light.')
	], ['piece:giuliani-op50n17', 'piece:sorf-op35-no1', 'piece:sorf-op35-no2'], r('Два этюда в темпе.', 'Two studies at tempo.'), 20),
	L(3, 'theory', 'core', 'caged-1', r('Ноты на 6-й и 5-й струнах', 'Notes on the 6th and 5th strings'), r('Находить любую ноту на басовых струнах — основа баррэ.', 'Find any note on the bass strings — the basis of barre chords.'), [
		r('6-я: ми(0) фа(1) соль(3) ля(5) си(7) до(8) ре(10) ми(12). 5-я: ля(0) си(2) до(3) ре(5) ми(7) фа(8) соль(10).', '6th: E0 F1 G3 A5 B7 C8 D10 E12. 5th: A0 B2 C3 D5 E7 F8 G10.'),
		r('Баррэ формы E и A от любой ноты: Gm (3 лад), Cm (3 лад, 5-я струна).', 'E- and A-shape barres from any note: Gm (fret 3), Cm (fret 3, 5th string).')
	], ['chord:Gm', 'chord:Cm', 'chord:F#m'], r('Назовёте лад любой ноты на 6-й и 5-й струне за 3 секунды.', 'You name the fret of any note on the 6th and 5th strings within 3 seconds.')),
	L(3, 'improv', 'blues', 'blues-12', r('Блюз в ля: 12 тактов', 'A blues in A: 12 bars'), r('Форма блюза и пентатоника над ней.', 'The blues form and the pentatonic over it.'), [
		r('A7 (4 такта) – D7 (2) – A7 (2) – E7 – D7 – A7 – E7.', 'A7 (4 bars) – D7 (2) – A7 (2) – E7 – D7 – A7 – E7.'),
		r('Пентатоника ля минор, фразы заканчивайте на ля.', 'The A minor pentatonic; end phrases on A.')
	], ['ex:prog:A7-D7-A7-E7:4', 'ex:penta:A'], r('Три квадрата блюза: ритм, потом соло.', 'Three choruses: rhythm, then a solo.'), 15),

	// ── 4. Гриф целиком ──────────────────────────────────────────────────────────────────────────────────────
	L(4, 'technique', 'core', 'scales-pos', r('Гаммы в позициях', 'Scales in positions'), r('Мажорные гаммы двумя октавами, апояндо и тирандо.', 'Two-octave major scales, rest and free strokes.'), [
		r('Чередуйте i-m, не повторяйте один палец; темп постепенно до 100.', 'Alternate i-m, never repeat a finger; tempo up to 100 gradually.')
	], ['ex:scale:C:major', 'ex:scale:G:major', 'ex:scale:A:minor', 'ex:scale:E:minor'], r('Четыре гаммы на 100 восьмыми.', 'Four scales at 100 in eighths.'), 15),
	L(4, 'repertoire', 'classical', 'carcassi', r('Этюды Каркасси ор. 60', 'Carcassi Op. 60 studies'), r('Арпеджио, легато, позиции.', 'Arpeggios, slurs, positions.'), [
		r('Этюд № 1 (гаммы), № 3 (арпеджио) — каждый неделю.', 'Study No. 1 (scales), No. 3 (arpeggios) — a week each.')
	], ['piece:carcassi-op60-01', 'piece:carcassi-op60-03', 'piece:carcassi-op60-07'], r('Два этюда в темпе.', 'Two studies at tempo.'), 20),
	L(4, 'repertoire', 'spanish', 'adelita', r('Таррега: «Аделита», «Испанский романс»', 'Tárrega: Adelita; the Spanish Romance'), r('Певучая мелодия в позициях и тремоло-подобные арпеджио.', 'A singing melody in positions and tremolo-like arpeggios.'), [
		r('Мелодию «Аделиты» — апояндо, переходы позиций без пауз.', 'Adelita’s melody rest-stroke, position shifts without gaps.'),
		r('«Романс» — триоли p-a-m-i ровно, мелодия на 1-й струне громче.', 'The Romance — even p-a-m-i triplets, the melody on the 1st string louder.')
	], ['piece:adelita', 'piece:spanish-romance'], r('Одна пьеса целиком выразительно.', 'One piece through, expressively.'), 20),
	L(4, 'improv', 'blues', 'penta-boxes', r('Пентатоника: пять позиций', 'The pentatonic: five boxes'), r('Связать позиции по всему грифу.', 'Connect the boxes over the whole neck.'), [
		r('Позиция 1 (5 лад) → 2 (8 лад) — переходите на одной струне.', 'Box 1 (fret 5) → 2 (fret 8) — shift along one string.')
	], ['ex:penta:A', 'ex:penta:E'], r('Соло на блюз в двух позициях.', 'A blues solo in two boxes.'), 15),

	// ── 5. Испанская гитара ──────────────────────────────────────────────────────────────────────────────────
	L(5, 'technique', 'spanish', 'rasgueado', r('Расгеадо и пикадо', 'Rasgueado and picado'), r('Основные приёмы фламенко.', 'The basic flamenco techniques.'), [
		r('Расгеадо в 4 удара: a-m-i раскрываются по очереди, затем i вверх; на Am и E.', 'Four-stroke rasgueado: a-m-i flick out in turn, then i up; on Am and E.'),
		r('Пикадо: i-m апояндо на одной струне, затем гамма фригийская от ми.', 'Picado: i-m rest strokes on one string, then the E Phrygian scale.')
	], ['ex:prog:Am-G-F-E:4', 'ex:scale:A:minor'], r('Расгеадо ровно на 80, пикадо гаммы на 100.', 'Rasgueado evenly at 80, picado scale at 100.'), 15),
	L(5, 'rhythm', 'spanish', 'andalusian', r('Андалузская каденция и компас', 'The Andalusian cadence and compás'), r('Am–G–F–E: гармония фламенко; 12-дольный компас солеа.', 'Am–G–F–E: the harmony of flamenco; the 12-beat soleá compás.'), [
		r('Каденция Am–G–F–E боем, акцент на E.', 'The cadence strummed, accent on E.'),
		r('Компас: 1 2 [3] 4 5 [6] 7 [8] 9 [10] 11 12 — хлопайте акценты.', 'Compás: 1 2 [3] 4 5 [6] 7 [8] 9 [10] 11 12 — clap the accents.')
	], ['ex:prog:Am-G-F-E:4', 'chord:E', 'chord:F'], r('Каденция с расгеадо 2 минуты, акценты компаса на месте.', 'The cadence with rasgueado for 2 minutes, the compás accents in place.'), 15),
	L(5, 'repertoire', 'spanish', 'spanish-pieces', r('Испанские пьесы: Сор, Агуадо, Санс', 'Spanish pieces: Sor, Aguado, Sanz'), r('Стиль испанской школы.', 'The style of the Spanish school.'), [
		r('Агуадо — аппликатура левой руки по его «Школе»; Санс — барочные украшения.', 'Aguado — left-hand fingering after his Method; Sanz — baroque ornaments.')
	], ['piece:sanz-1', 'piece:spanishfandango1882', 'piece:sorf-op35-no13'], r('Две пьесы в темпе.', 'Two pieces at tempo.'), 20),

	// ── 6. Гармония и джаз ───────────────────────────────────────────────────────────────────────────────────
	L(6, 'theory', 'jazz', 'sevenths', r('Септаккорды и ii–V–I', 'Seventh chords and ii–V–I'), r('maj7, m7, 7 и главный джазовый оборот.', 'maj7, m7, 7 and the main jazz progression.'), [
		r('Dm7 – G7 – Cmaj7 в открытой позиции, затем баррэ-формы.', 'Dm7 – G7 – Cmaj7 in open position, then barre shapes.')
	], ['chord:Dm7', 'chord:G7', 'chord:Cmaj7', 'ex:prog:Dm7-G7-Cmaj7-Cmaj7:4'], r('ii–V–I в до и фа без остановок.', 'ii–V–I in C and F without stopping.'), 15),
	L(6, 'repertoire', 'classical', 'sor-op6', r('Этюды Сора ор. 6', 'Sor Op. 6 studies'), r('Концертные этюды: полифония на гитаре.', 'Concert studies: polyphony on the guitar.'), [
		r('Ведите голоса: верхний — legato, бас — держите полную длительность.', 'Carry the voices: the top legato, the bass held its full length.')
	], ['piece:sorf-op6n01', 'piece:sorf-op6n02', 'piece:carcassi-op60-19'], r('Этюд в темпе.', 'A study at tempo.'), 25),
	L(6, 'improv', 'jazz', 'changes', r('Импровизация по гармонии', 'Improvising through the changes'), r('Целевые ноты: 3-я и 7-я каждого аккорда.', 'Target notes: the 3rd and 7th of each chord.'), [
		r('На Dm7 цель — фа или до, на G7 — си или фа, на Cmaj7 — ми или си.', 'On Dm7 aim for F or C, on G7 for B or F, on Cmaj7 for E or B.')
	], ['ex:prog:Dm7-G7-Cmaj7-Cmaj7:4', 'ex:scale:C:major'], r('Соло на ii–V–I с попаданием в целевые ноты.', 'A solo on ii–V–I landing on the targets.'), 15),

	// ── 7. Концертные пьесы ──────────────────────────────────────────────────────────────────────────────────
	L(7, 'repertoire', 'spanish', 'capricho', r('Таррега: «Арабское каприччио»', 'Tárrega: Capricho árabe'), r('Концертная пьеса испанской школы.', 'A concert piece of the Spanish school.'), [
		r('Речитатив вступления — свободно; основная тема — певуче на басовых струнах.', 'The introduction’s recitative freely; the main theme singing on the bass strings.')
	], ['piece:capricho-arabe'], r('Пьеса целиком.', 'The whole piece.'), 30),
	L(7, 'repertoire', 'classical', 'bach', r('Бах на гитаре: BWV 1006a, 997', 'Bach on the guitar: BWV 1006a, 997'), r('Барочная полифония и танцы.', 'Baroque polyphony and dances.'), [
		r('Гавот в форме рондо — рефрен одинаково, эпизоды контрастно.', 'The Gavotte en Rondeau — the refrain the same each time, the episodes in contrast.')
	], ['piece:bwv-1006a-3g', 'piece:bwv-1006a-4g', 'piece:bach-preludio-bwv997'], r('Одна часть сюиты в темпе.', 'One movement of the suite at tempo.'), 30),

	// ── 8. Мастерство ────────────────────────────────────────────────────────────────────────────────────────
	L(8, 'repertoire', 'core', 'program', r('Своя концертная программа', 'Your own concert programme'), r('Программа на 20 минут из пьес разных стилей.', 'A 20-minute programme of pieces in several styles.'), [
		r('Выберите 4–5 пьес: Бах, Сор, Таррега, своя аранжировка песни.', 'Choose 4–5 pieces: Bach, Sor, Tárrega, your own song arrangement.'),
		r('Сыграйте программу целиком раз в неделю, запишите на видео.', 'Play the whole programme once a week and film it.')
	], ['piece:bwv-1006a-1g', 'piece:capricho-arabe'], r('Программа сыграна подряд без остановок.', 'The programme played through without stopping.'), 30),
	L(8, 'improv', 'core', 'arrange', r('Аранжировка песни для соло-гитары', 'Arranging a song for solo guitar'), r('Мелодия, бас и гармония одной гитарой.', 'Melody, bass and harmony on one guitar.'), [
		r('Мелодия на 1–2 струне, бас — открытые струны, аккорды — между ними.', 'The melody on strings 1–2, the bass on open strings, chords in between.')
	], ['ex:prog:Am-F-C-G:4'], r('Своя аранжировка одной песни.', 'Your own arrangement of one song.'), 20)
];

export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);
export const lessonsOf = (level: number, tracks: string[]) => LESSONS.filter((l) => l.level === level && (l.track === 'core' || tracks.includes(l.track)));
export const allExerciseIds = () => [...new Set(LESSONS.flatMap((l) => l.materials.filter((m) => m.startsWith('ex:'))))];

export function lessonText(l: Lesson, lang: Lang) {
	return { title: l.title[lang], goal: l.goal[lang], tasks: l.tasks.map((x) => x[lang]), done: l.done[lang] };
}
