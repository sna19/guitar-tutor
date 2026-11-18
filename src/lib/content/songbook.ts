/**
 * Songs in the app itself: Russian folk songs (the words are traditional, in the public domain) with our own simple
 * harmonisation for the guitar — a first repertoire to strum and sing. Copyrighted songs are not stored here: the
 * list below only names them, the owner adds the sheets to «Мои песни» (kept on the NAS only).
 */
import type { L10n } from '../i18n.js';

export interface Folk {
	slug: string;
	title: string;
	note: L10n;
	level: number;
	tempo: number;
	pattern: string;
	sheet: string;
}

export const FOLK: Folk[] = [
	{
		slug: 'chorny-voron',
		title: 'Чёрный ворон',
		note: { ru: 'Народная песня; гармонизация — ля минор, три аккорда.', en: 'A folk song; harmonised in A minor with three chords.' },
		level: 1,
		tempo: 72,
		pattern: 'D---D-DU',
		sheet: `Куплет:
[Am]Чёрный ворон, [Dm]чёрный ворон,
[E]Что ты вьёшься [Am]надо мной?
[Am]Ты добычи [Dm]не дождёшься,
[E]Чёрный ворон, [Am]я не твой!`
	},
	{
		slug: 'oy-to-ne-vecher',
		title: 'Ой, то не вечер',
		note: { ru: 'Казачья народная песня; ля минор, с доминантой E7.', en: 'A Cossack folk song; A minor with the E7 dominant.' },
		level: 1,
		tempo: 66,
		pattern: 'D-DU-UDU',
		sheet: `Куплет:
Ой, то не [Am]вечер, то не [Dm]вечер,
Мне малым-[E7]мало спало[Am]сь.
Мне малым-[Am]мало спало[Dm]сь,
Ох, да во [E7]сне привиде[Am]лось.`
	},
	{
		slug: 'vo-pole-beryoza',
		title: 'Во поле берёза стояла',
		note: { ru: 'Народная хороводная; можно перебором p-i-m-a.', en: 'A folk round-dance song; try the p-i-m-a fingerpicking.' },
		level: 1,
		tempo: 96,
		pattern: 'D-DU-UDU',
		sheet: `Куплет:
[Am]Во поле берёза стояла,
[Dm]Во поле кудрявая [Am]стояла,
[Am]Люли, люли, [E]стояла,
[E]Люли, люли, [Am]стояла.`
	},
	{
		slug: 'kalinka',
		title: 'Калинка',
		note: { ru: 'Песня И. Ларионова (1860), давно в общественном достоянии; ускоряйтесь в припеве.', en: 'A song by I. Larionov (1860), long in the public domain; speed up in the chorus.' },
		level: 2,
		tempo: 110,
		pattern: 'D-DUD-DU',
		sheet: `Припев:
[Am]Калинка, калинка, [E7]калинка моя!
В саду ягода [E7]малинка, малинка [Am]моя!`
	}
];

/** Russian rock to add to «Мои песни»: names only — the words and chords come from the owner’s own sources. */
export interface RockSong {
	artist: string;
	title: string;
	decade: '80' | '90' | '2000';
}

const R = (artist: string, decade: RockSong['decade'], ...titles: string[]): RockSong[] => titles.map((title) => ({ artist, title, decade }));

export const RUSSIAN_ROCK: RockSong[] = [
	...R('Кино', '80', 'Группа крови', 'Звезда по имени Солнце', 'Пачка сигарет', 'Хочу перемен', 'Спокойная ночь', 'Апрель', 'Последний герой'),
	...R('Кино', '90', 'Кукушка', 'Кончится лето'),
	...R('Наутилус Помпилиус', '80', 'Я хочу быть с тобой', 'Скованные одной цепью', 'Гудбай, Америка'),
	...R('Наутилус Помпилиус', '90', 'Прогулки по воде', 'Крылья'),
	...R('Аквариум', '80', 'Город золотой', 'Поезд в огне'),
	...R('Алиса', '80', 'Моё поколение'),
	...R('Алиса', '90', 'Трасса Е95'),
	...R('ДДТ', '90', 'Что такое осень', 'Это всё', 'Родина', 'В последнюю осень'),
	...R('Король и Шут', '90', 'Лесник', 'Кукла колдуна', 'Прыгну со скалы', 'Дурак и молния', 'Камнем по голове'),
	...R('Король и Шут', '2000', 'Проклятый старый дом', 'Танец злобного гения'),
	...R('Чайф', '90', 'Аргентина — Ямайка 5:0', 'Не спеши', 'Оранжевое настроение'),
	...R('Агата Кристи', '90', 'Как на войне', 'Опиум для никого', 'Ковёр-вертолёт'),
	...R('Сплин', '90', 'Моё сердце', 'Романс', 'Орбит без сахара'),
	...R('Сплин', '2000', 'Выхода нет'),
	...R('Мумий Тролль', '90', 'Утекай', 'Владивосток 2000'),
	...R('Земфира', '90', 'Ариведерчи'),
	...R('Земфира', '2000', 'Хочешь?'),
	...R('Би-2', '2000', 'Полковнику никто не пишет'),
	...R('Ария', '90', 'Потерянный рай'),
	...R('Звери', '2000', 'Районы-кварталы'),
	...R('Lumen', '2000', 'Гореть')
];
