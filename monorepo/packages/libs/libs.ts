// dayjs
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(dayOfYear)
dayjs.extend(weekOfYear)
dayjs.extend(advancedFormat)
dayjs.extend(duration)
dayjs.extend(relativeTime)
window.R.libs.dayjs = dayjs

// just
import clone from "just-clone"; window.R.libs.clone = clone
import map from "just-map-object"; window.R.libs.map = map
import typeOf from "just-typeof"; window.R.libs.typeOf = typeOf
import flush from "just-flush"; window.R.libs.flush = flush
import template from "just-template"; window.R.libs.template = template
import isObjectEmpty from 'just-is-empty'; window.R.libs.isObjectEmpty = isObjectEmpty
import isEmpty from 'just-is-empty'
import omit from 'just-omit'; window.R.libs.omit = omit
import insert from 'just-insert'; window.R.libs.insert = insert
import get from 'just-safe-get'; window.R.libs.get = get;
import set from 'just-safe-set';
import last from "just-last"
import clamp from 'just-clamp'
import remove from 'just-remove'
import sortBy from 'just-sort-by';
import unique from 'just-unique'
import compare from 'just-compare'
import flatten from 'just-flatten-it';
window.R.libs.just = {
    clone, map, typeOf, flush, template, isEmpty, omit, insert, get, set, clamp, last, remove, sortBy, unique, compare, flatten
}

// lodash
import { isNil } from 'lodash'
window.R.libs.isNil = isNil
window.R.libs.lodash = { isNil }

// form
import { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField } from '@mantine/form'
window.R.libs.form = { isNotEmpty, isEmail, matches, isInRange, hasLength, matchesField }

import cookies from 'js-cookie'; window.R.libs.cookies = cookies
import numbro from 'numbro'; window.R.libs.numbro = numbro
import { IMask } from 'react-imask'; window.R.libs.IMask = IMask
import { sort } from "fast-sort"; window.R.libs.sort = sort
