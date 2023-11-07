import Cookies from 'js-cookie'
import ms from 'ms'
import clone from 'just-clone'
import mustache from 'mustache'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

import { setRefs } from '../../../utils/data/v.0.1.0/data'

export default function loadLibs() {
    window.cookies = Cookies
    window.ms = ms
    window.clone = clone
    window.mustache = mustache

    dayjs.extend(isBetween)
    dayjs.extend(isSameOrAfter)
    dayjs.extend(dayOfYear)
    dayjs.extend(weekOfYear)
    dayjs.extend(advancedFormat)
    dayjs.extend(duration)
    dayjs.extend(relativeTime)
    window.dayjs = dayjs

    window.setRefs = setRefs
}