// dayjs
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'
import weekYear from 'dayjs/plugin/weekYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(dayOfYear)
dayjs.extend(advancedFormat)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(weekday)
dayjs.extend(weekYear)
dayjs.extend(weekOfYear)
dayjs.extend(timezone)
dayjs.locale('ru')
window.R.libs.dayjs = dayjs

// just
import clone from "just-clone"
import map from "just-map-object"
import typeOf from "just-typeof"
import flush from "just-flush"
import template from "just-template"
import isEmpty from 'just-is-empty'
import omit from 'just-omit'
import insert from 'just-insert'
import get from 'just-safe-get'
import set from 'just-safe-set';
import last from "just-last"
import clamp from 'just-clamp'
import remove from 'just-remove'
import sortBy from 'just-sort-by';
import unique from 'just-unique'
import compare from 'just-compare'
import flatten from 'just-flatten-it';
import debounce from 'just-debounce-it'
import capitalize from 'just-capitalize';
import throttle from 'just-throttle';
import filter from 'just-filter-object'
import groupBy from 'just-group-by';
import memoize from 'just-memoize'
import range from 'just-range'
window.R.libs.just = {
    clone, map, typeOf, flush, template, isEmpty, omit, insert, get, set, clamp, last, remove, sortBy, unique, compare, flatten,
    debounce, capitalize, throttle, filter, groupBy, memoize, range
}

// lodash
import { isNil, unionBy } from 'lodash'
window.R.libs.lodash = { isNil, unionBy }

// form
import { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField } from '@mantine/form'
window.R.libs.form = { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField }

// numbro
import numbro from 'numbro';
import locale from 'numbro/dist/languages/ru-RU.min.js';
locale.delimiters.decimal = '.'
numbro.registerLanguage(locale);
numbro.setLanguage('ru-RU')
window.R.libs.numbro = numbro

import cookies from 'js-cookie'; window.R.libs.cookies = cookies
import { IMask } from 'react-imask'; window.R.libs.IMask = IMask
import { sort } from "fast-sort"; window.R.libs.sort = sort
import generatePassword from "omgopass"; window.R.libs.generatePassword = generatePassword
import ms from "ms"; window.R.libs.ms = ms
import deepEqual from 'fast-deep-equal'; window.R.libs.deepEqual = deepEqual