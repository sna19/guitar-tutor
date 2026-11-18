import { page } from '$app/state';
import { invalidateAll } from '$app/navigation';

/**
 * Two languages, Russian and English. The choice lives in the «lang» cookie (a year); without it — the browser's
 * language. `t(key)` reads the language of the current page, so a switch re-renders everything at once.
 */
import type { Lang } from './lang.js';
export type { Lang } from './lang.js';
export const LANGS: Lang[] = ['ru', 'en'];

/** a text in both languages */
export type L10n = { ru: string; en: string };

export function lang(): Lang {
	return (page.data?.lang as Lang) ?? 'ru';
}

/** pick the current language from a pair */
export function tr(x: L10n | string): string {
	return typeof x === 'string' ? x : x[lang()];
}

export async function setLang(l: Lang) {
	document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
	document.documentElement.lang = l;
	await invalidateAll();
}

const D = {
	// tabs
	'tab.today': { ru: 'Сегодня', en: 'Today' },
	'tab.program': { ru: 'Программа', en: 'Program' },
	'tab.pieces': { ru: 'Ноты', en: 'Scores' },
	'tab.chords': { ru: 'Аккорды', en: 'Chords' },
	'chords.intro': { ru: 'Тап по аккорду — он звучит. Цифры — пальцы левой руки, × — струна не звучит, ○ — открытая, полоса — баррэ.', en: 'Tap a chord to hear it. Numbers are left-hand fingers, × — not played, ○ — open, a bar — barre.' },
	'chords.play': { ru: 'сыграть', en: 'play' },
	'lesson.chords': { ru: 'Аккорды', en: 'Chords' },
	'tab.book': { ru: 'Учебник', en: 'Textbook' },
	'app.name': { ru: 'Гитара', en: 'Guitar' },
	sections: { ru: 'Разделы', en: 'Sections' },
	// today
	'today.title': { ru: 'Сегодня', en: 'Today' },
	'today.level': { ru: 'Уровень {n} · {title}. Занятие {m} мин.', en: 'Level {n} · {title}. Session {m} min.' },
	'today.piece': { ru: 'Пьеса дня', en: 'Piece of the day' },
	'today.lessons': { ru: 'Уроки', en: 'Lessons' },
	'today.soon': { ru: 'Скоро здесь', en: 'Coming here' },
	'today.soonText': {
		ru: 'План занятия на выбранное время с таймером: разминка и техника, теория, пьеса, импровизация под backing track, слух — из уроков вашего уровня (этап 3).',
		en: 'A session plan for the time you have, with a timer: warm-up and technique, theory, a piece, improvisation over a backing track, ear training — from the lessons of your level (stage 3).'
	},
	settings: { ru: 'Настройки', en: 'Settings' },
	min: { ru: 'мин', en: 'min' },
	// pieces
	'pieces.title': { ru: 'Ноты', en: 'Scores' },
	'pieces.mine': { ru: 'Мои ноты (PDF)', en: 'My scores (PDF)' },
	'pieces.intro': {
		ru: '{n} пьес для гитары из изданий в общественном достоянии — классика и испанская школа, с табулатурой. Ваш уровень — {lv}; песни появятся в следующем этапе.',
		en: '{n} guitar pieces from public-domain editions — classical and the Spanish school, with tab. Your level is {lv}; songs come in the next stage.'
	},
	'pieces.search': { ru: 'Название, автор, сборник', en: 'Title, composer, collection' },
	'pieces.all': { ru: 'Все', en: 'All' },
	'pieces.mineLevel': { ru: 'мой', en: 'mine' },
	'pieces.allCollections': { ru: 'Все сборники', en: 'All collections' },
	'pieces.none': { ru: 'Ничего не нашлось.', en: 'Nothing found.' },
	draft: { ru: 'черновик', en: 'draft' },
	level: { ru: 'Уровень', en: 'Level' },
	'level.lc': { ru: 'уровень', en: 'level' },
	collection: { ru: 'Сборник', en: 'Collection' },
	search: { ru: 'Поиск', en: 'Search' },
	'piece.back': { ru: '‹ Ноты', en: '‹ Scores' },
	'piece.source': { ru: 'Источник', en: 'Source' },
	'piece.fromMidi': { ru: 'Ноты переведены из MIDI издания и сверены с ним нота в ноту.', en: 'Converted from the edition’s MIDI and checked against it note by note.' },
	'piece.fromScan': { ru: 'Ноты набраны со скана издания.', en: 'Typeset from a scan of the edition.' },
	// score
	'score.both': { ru: 'Обе руки', en: 'Both hands' },
	'score.rh': { ru: 'Правая', en: 'Right' },
	'score.lh': { ru: 'Левая', en: 'Left' },
	'score.hands': { ru: 'Руки', en: 'Hands' },
	'score.zoom': { ru: 'Масштаб', en: 'Zoom' },
	'score.bigger': { ru: 'Крупнее', en: 'Larger' },
	'score.smaller': { ru: 'Мельче', en: 'Smaller' },
	'score.loading': { ru: 'Загружаю звук гитары…', en: 'Loading the guitar sound…' },
	'score.noAudio': { ru: 'Этот браузер не умеет проигрывать звук', en: 'This browser cannot play sound' },
	'score.audioFail': { ru: 'Звук не загрузился', en: 'The sound did not load' },
	'score.hint': {
		ru: 'Под нотами — табулатура (лады подобраны в ближней позиции). Темп — поле с процентами в плеере, ⟳ — повтор.',
		en: 'Under the staff is the tab (frets in the lowest position). Tempo is the % field in the player, ⟳ repeats.'
	},
	// status
	'st.none': { ru: 'Начать', en: 'Start' },
	'st.learning': { ru: 'В работе', en: 'Learning' },
	'st.done': { ru: 'Готово ✓', en: 'Done ✓' },
	'st.mark': { ru: 'Отметка', en: 'Mark' },
	// program
	'program.title': { ru: 'Программа', en: 'Program' },
	'program.intro': {
		ru: 'Восемь уровней, как семестры колледжа; в каждом — курсы техники, ритма и песен, теории, слуха, репертуара и импровизации. Уроки направлений, которые не выбраны в настройках, скрыты.',
		en: 'Eight levels, like college semesters; each has courses in technique, rhythm and songs, theory, ear training, repertoire and improvisation. Lessons of the tracks not chosen in the settings are hidden.'
	},
	'program.done': { ru: 'пройдено {d} из {n}', en: '{d} of {n} done' },
	'program.check': { ru: 'Проверить свой уровень', en: 'Check your level' },
	'program.changeIn': { ru: 'уровень меняется в', en: 'the level is changed in' },
	'program.settingsLink': { ru: 'настройках', en: 'settings' },
	'lesson.back': { ru: '‹ Программа, уровень {n}', en: '‹ Program, level {n}' },
	'lesson.perDay': { ru: 'мин в день', en: 'min a day' },
	'lesson.todo': { ru: 'Что делать', en: 'What to do' },
	'lesson.doneWhen': { ru: 'Готово, когда:', en: 'Done when:' },
	'lesson.pieces': { ru: 'Пьесы', en: 'Pieces' },
	'lesson.exercises': { ru: 'Упражнения', en: 'Exercises' },
	// settings
	'settings.back': { ru: '‹ Сегодня', en: '‹ Today' },
	'settings.level': { ru: 'Мой уровень', en: 'My level' },
	'settings.levelText': {
		ru: 'От уровня зависят пьесы, задания на день и программа. Уровни устроены как семестры колледжа; ориентир — класс музыкальной школы.',
		en: 'The pieces, the daily tasks and the program follow your level. Levels work like college semesters; the grade is a rough guide.'
	},
	'settings.notSure': { ru: 'Не уверены —', en: 'Not sure —' },
	'settings.check': { ru: 'проверка уровня', en: 'level check' },
	'settings.tracks': { ru: 'Направления', en: 'Tracks' },
	'settings.minutes': { ru: 'Обычная длина занятия', en: 'Usual session length' },
	'settings.language': { ru: 'Язык', en: 'Language' },
	'settings.saveFail': { ru: 'Не сохранилось', en: 'Not saved' },
	'track.classical': { ru: 'Классика', en: 'Classical' },
	'track.spanish': { ru: 'Испанская гитара', en: 'Spanish guitar' },
	'track.rock': { ru: 'Рок', en: 'Rock' },
	'track.jazz': { ru: 'Джаз', en: 'Jazz' },
	'track.blues': { ru: 'Блюз', en: 'Blues' },
	'track.pop': { ru: 'Поп', en: 'Pop' },
	// level check
	'check.title': { ru: 'Проверка уровня', en: 'Level check' },
	'check.intro': {
		ru: 'Отвечайте честно: «да» — если это получается уже сейчас, без долгой подготовки. Уровень — первый, где ответ «нет»: на нём и стоит работать.',
		en: 'Answer honestly: “yes” if you can do it now, without long preparation. Your level is the first one with a “no” — that is where to work.'
	},
	'check.yes': { ru: 'Да, могу', en: 'Yes, I can' },
	'check.no': { ru: 'Пока нет', en: 'Not yet' },
	'check.result': { ru: 'Ваш уровень —', en: 'Your level is' },
	'check.apply': { ru: 'Поставить уровень {n}', en: 'Set level {n}' },
	'check.back': { ru: '‹ Настройки', en: '‹ Settings' },
	// my scores
	'mine.title': { ru: 'Мои ноты', en: 'My scores' },
	'mine.intro': {
		ru: 'Свои PDF — например, купленные ноты. Файлы хранятся только на вашем NAS (в /data) и никуда не выкладываются. Тап — открыть на весь экран.',
		en: 'Your own PDFs — e.g. scores you bought. The files stay only on your NAS (in /data) and are never published. Tap to open full screen.'
	},
	'mine.file': { ru: 'PDF-файл', en: 'PDF file' },
	'mine.titlePh': { ru: 'Название (необязательно)', en: 'Title (optional)' },
	'mine.add': { ru: 'Добавить', en: 'Add' },
	'mine.uploading': { ru: 'Загружаю…', en: 'Uploading…' },
	'mine.choose': { ru: 'Выберите PDF', en: 'Choose a PDF' },
	'mine.fail': { ru: 'Не загрузилось', en: 'Upload failed' },
	'mine.delete': { ru: 'Удалить', en: 'Delete' },
	'mine.confirm': { ru: 'Удалить «{t}» из моих нот?', en: 'Delete “{t}” from my scores?' },
	'mine.empty': { ru: 'Пока пусто.', en: 'Nothing yet.' },
	mb: { ru: 'МБ', en: 'MB' },
	// placeholders
	'book.text': { ru: 'Главы по направлениям — классика, поп, джаз и блюз — этап 5.', en: 'Chapters by track — classical, pop, jazz and blues — stage 5.' },
	'program.levelsAria': { ru: 'Уровень', en: 'Level' }
} satisfies Record<string, L10n>;

export type Key = keyof typeof D;

/** the UI text of a key in the current language, with {name} filled in */
export function t(key: Key, vars: Record<string, string | number> = {}): string {
	let s = D[key][lang()];
	for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
	return s;
}
