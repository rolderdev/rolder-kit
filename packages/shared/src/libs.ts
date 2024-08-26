// jsut
import typeOf from 'just-typeof';
import compare from 'just-compare';
import clone from 'just-clone';
//// object
import has from 'just-has';
import get from 'just-safe-get';
import set from 'just-safe-set';
import map from 'just-map-object';
import pick from 'just-pick';
import omit from 'just-omit';
import template from 'just-template';
import flush from 'just-flush';
import isEmpty from 'just-is-empty';
//// array
import last from 'just-last';
import unique from 'just-unique';
import insert from 'just-insert';
import range from 'just-range';
import sortBy from 'just-sort-by';
//// string
import capitalize from 'just-capitalize';

export type Just = {
	typeOf: typeof typeOf;
	compare: typeof compare;
	clone: typeof clone;
	has: typeof has;
	get: typeof get;
	set: typeof set;
	map: typeof map;
	pick: typeof pick;
	omit: typeof omit;
	template: typeof template;
	flush: typeof flush;
	isEmpty: typeof isEmpty;
	last: typeof last;
	unique: typeof unique;
	insert: typeof insert;
	range: typeof range;
	sortBy: typeof sortBy;
	capitalize: typeof capitalize;
};
set(window, ['R', 'libs', 'just'], {
	typeOf,
	compare,
	clone,
	has,
	get,
	set,
	map,
	pick,
	omit,
	template,
	flush,
	isEmpty,
	last,
	unique,
	insert,
	range,
	sortBy,
	capitalize,
});

// lodash
import unset from 'lodash.unset';
export type Lodash = { unset: typeof unset };
set(window, ['R', 'libs', 'lodash'], { unset });

// dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import weekYear from 'dayjs/plugin/weekYear';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(dayOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(weekday);
dayjs.extend(weekYear);
dayjs.extend(weekOfYear);
dayjs.extend(timezone);
dayjs.locale('ru');
export type Dayjs = typeof dayjs;
set(window, ['R', 'libs', 'dayjs'], dayjs);
import { nanoid } from 'nanoid';
export type Nanoid = typeof nanoid;
set(window, ['R', 'libs', 'nanoid'], nanoid);
import { sort } from 'fast-sort';
export type Sort = typeof sort;
set(window, ['R', 'libs', 'sort'], sort);
import * as valibot from 'valibot';
export type Valibot = typeof valibot;
set(window, ['R', 'libs', 'valibot'], valibot);
import generatePassword from 'omgopass';
export type Omgopass = typeof generatePassword;
set(window, ['R', 'libs', 'generatePassword'], generatePassword);

// valtio
import * as valtioModule from 'valtio';
import { proxyMap } from 'valtio/utils';
import { derive, underive } from 'derive-valtio';
const valtio = { ...valtioModule, proxyMap, derive, underive };
export type Valtio = typeof valtio;
set(window, ['R', 'libs', 'valtio'], valtio);

// numbro
import numbro from 'numbro';
// @ts-ignore
import locale from 'numbro/dist/languages/ru-RU.min.js';
locale.delimiters.decimal = '.';
numbro.registerLanguage(locale);
numbro.setLanguage('ru-RU');
export type Numbro = typeof numbro;
set(window, ['R', 'libs', 'numbro'], numbro);
