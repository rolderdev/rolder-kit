import { set } from './just'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import minMax from 'dayjs/plugin/minMax'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import weekday from 'dayjs/plugin/weekday'

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
dayjs.extend(minMax)
dayjs.locale('ru')
export type Dayjs = typeof dayjs
set(window, ['R', 'libs', 'dayjs'], dayjs)
