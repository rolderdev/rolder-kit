let libs: any = {}

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
libs.dayjs = dayjs

// just
import typeOf from "just-typeof"
import clone from "just-clone"
import flush from "just-flush"
import omit from 'just-omit'
import insert from 'just-insert'
import map from "just-map-object"
import capitalize from 'just-capitalize'
import range from 'just-range'
import last from "just-last"
import unique from 'just-unique'
import sortBy from 'just-sort-by'
libs.just = { typeOf, clone, flush, omit, insert, map, capitalize, range, last, unique, sortBy }

// form
import { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField } from '@mantine/form'
libs.form = { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField }

// numbro
import numbro from 'numbro';
//@ts-ignore
import locale from 'numbro/dist/languages/ru-RU.min.js';
locale.delimiters.decimal = '.'
numbro.registerLanguage(locale);
numbro.setLanguage('ru-RU')
libs.numbro = numbro

import { sort } from "fast-sort"; libs.sort = sort
import generatePassword from "omgopass"; libs.generatePassword = generatePassword
import deepEqual from 'fast-deep-equal'; libs.deepEqual = deepEqual

import { get, getMany, set, setMany, update, del, delMany, keys } from "idb-keyval"
libs.indexedDb = { get, getMany, set, setMany, update, del, delMany, keys }

export default libs