import Cookies from 'js-cookie'
import Ms from 'ms';
import Clone from 'just-clone'
import Mustache from 'mustache'

import Dayjs from 'Dayjs'
import 'Dayjs/locale/ru'
import isBetween from 'Dayjs/plugin/isBetween'
import isSameOrAfter from 'Dayjs/plugin/isSameOrAfter'
import dayOfYear from 'Dayjs/plugin/dayOfYear'
import weekOfYear from 'Dayjs/plugin/weekOfYear'
import advancedFormat from 'Dayjs/plugin/advancedFormat'
import duration from 'Dayjs/plugin/duration'
import relativeTime from 'Dayjs/plugin/relativeTime'

import { setRefs } from '../utils/data/v.0.1.0/data';

export default function loadLibs() {
    window.Cookies = Cookies
    window.Ms = Ms
    window.Clone = Clone
    window.Mustache = Mustache

    Dayjs.extend(isBetween)
    Dayjs.extend(isSameOrAfter)
    Dayjs.extend(dayOfYear)
    Dayjs.extend(weekOfYear)
    Dayjs.extend(advancedFormat)
    Dayjs.extend(duration)
    Dayjs.extend(relativeTime)
    window.Dayjs = Dayjs

    window.SetRefs = setRefs
}