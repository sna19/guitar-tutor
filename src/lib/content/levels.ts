import type { L10n } from '../i18n.js';

/** Guitar levels — like college semesters; the day plan and the suggested material follow the chosen one. */
export interface Level {
	n: number;
	title: L10n;
	can: L10n;
	grade: L10n;
}

export const LEVELS: Level[] = [
	{ n: 1, title: { ru: 'Первые аккорды', en: 'First chords' }, can: { ru: 'Настраиваю гитару, держу медиатор и играю пальцами; беру Em, Am, C, G, D и меняю их медленно; простой бой на 4/4.', en: 'I tune the guitar, hold a pick and play fingerstyle; I play Em, Am, C, G, D and change them slowly; a simple 4/4 strum.' }, grade: { ru: 'начинающий', en: 'beginner' } },
	{ n: 2, title: { ru: 'Песни у костра', en: 'Campfire songs' }, can: { ru: 'Играю песни на открытых аккордах с боем и перебором, смена аккорда в ритме; читаю табулатуру; первые пьесы Агуадо и Сора.', en: 'I play songs on open chords with strumming and fingerpicking, change chords in time; read tab; first pieces by Aguado and Sor.' }, grade: { ru: '1–2 год музыкальной школы', en: 'grades 1–2' } },
	{ n: 3, title: { ru: 'Баррэ и ритм', en: 'Barre and rhythm' }, can: { ru: 'Беру баррэ F и Bm, играю пауэр-аккорды и глушение (рок-ритм), пентатонику в первой позиции, этюды Джулиани ор. 50.', en: 'I play F and Bm barre chords, power chords and palm muting (rock rhythm), the pentatonic in first position, Giuliani Op. 50 studies.' }, grade: { ru: '3 год', en: 'grade 3' } },
	{ n: 4, title: { ru: 'Гриф целиком', en: 'The whole neck' }, can: { ru: 'Знаю ноты на грифе до 12 лада, CAGED, гаммы в позициях, этюды Каркасси, «Аделиту»; блюз в ля с пентатоникой.', en: 'I know the notes up to the 12th fret, CAGED, scales in positions, Carcassi studies, Adelita; A blues with the pentatonic.' }, grade: { ru: '4–5 год', en: 'grades 4–5' } },
	{ n: 5, title: { ru: 'Испанская гитара', en: 'Spanish guitar' }, can: { ru: 'Расгеадо, пикадо, апояндо; андалузская каденция и компас солеа; пьесы Тарреги и Сора средней трудности.', en: 'Rasgueado, picado, apoyando; the Andalusian cadence and the soleá compás; Tárrega and Sor pieces of medium difficulty.' }, grade: { ru: '6 год', en: 'grade 6' } },
	{ n: 6, title: { ru: 'Гармония и джаз', en: 'Harmony and jazz' }, can: { ru: 'Септаккорды и ii–V–I на грифе, джазовые голосоведения на 4 струнах, импровизация по гармонии; этюды Сора ор. 6.', en: 'Seventh chords and ii–V–I on the neck, 4-string jazz voicings, improvising through the changes; Sor Op. 6 studies.' }, grade: { ru: '7–8 год', en: 'grades 7–8' } },
	{ n: 7, title: { ru: 'Концертные пьесы', en: 'Concert pieces' }, can: { ru: '«Арабское каприччио», Бах на гитаре, тремоло; свободная импровизация в стилях.', en: 'Capricho árabe, Bach on the guitar, tremolo; free improvisation in several styles.' }, grade: { ru: 'училище', en: 'conservatory, first years' } },
	{ n: 8, title: { ru: 'Мастерство', en: 'Mastery' }, can: { ru: 'Свой репертуар и аранжировки, концертное исполнение.', en: 'Own repertoire and arrangements, concert performance.' }, grade: { ru: 'училище, старшие курсы', en: 'conservatory, senior years' } }
];

export const levelOf = (n: number) => LEVELS.find((l) => l.n === n) ?? LEVELS[0];
