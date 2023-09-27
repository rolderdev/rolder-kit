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

import cookies from 'js-cookie'; window.R.libs.cookies = cookies

// just
import clone from "just-clone"; window.R.libs.clone = clone
import map from "just-map-object"; window.R.libs.map = map
import typeOf from "just-typeof"; window.R.libs.typeOf = typeOf
import flush from "just-flush"; window.R.libs.flush = flush

// lodash
import { isNil } from 'lodash'
window.R.libs.isNil = isNil