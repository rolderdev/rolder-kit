import Clone from 'just-clone'; window.Clone = Clone
import Mustache from 'mustache'; window.Mustache = Mustache
import Cookies from 'js-cookie'; window.Cookies = Cookies
import numbro from 'numbro';
import locale from 'numbro/dist/languages/ru-RU.min.js'; numbro.registerLanguage(locale); numbro.setLanguage('ru-RU'); window.Numbro = numbro;

import isEmpty from 'just-is-empty'; window.IsEmpty = isEmpty
import flush from 'just-flush'; window.Flush = flush
import last from 'just-last'; window.Last = last

import Dayjs from 'dayjs'
import 'dayjs/locale/ru'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
Dayjs.extend(isBetween)
Dayjs.extend(isSameOrAfter)
Dayjs.extend(dayOfYear)
Dayjs.extend(weekOfYear)
Dayjs.extend(advancedFormat)
Dayjs.extend(duration)
Dayjs.extend(relativeTime)
window.Dayjs = Dayjs

import { isNotEmpty, isEmail, isInRange, hasLength, matches, matchesField } from "@mantine/form";
window.FormValidators = { isNotEmpty, isEmail, isInRange, hasLength, matches, matchesField }

import filterBy from '../utils/filterBy/v0.2.0/filterBy'; window.FilterBy = filterBy

// #########################################################
import { defineModule } from '@noodl/noodl-sdk'
import reactNodes from './nodes/v0.1.0/rNodes';
import nodes from './nodes/v0.1.0/jsNodes';

defineModule({
    nodes,
    reactNodes,
    settings: [
        { name: 'envVersion', type: 'string', displayName: 'Environment version #deprecated', group: 'Connection #deprecated', tooltip: "Examples: d2, s2, p3", },
        { name: 'project', type: 'string', displayName: 'Project name', group: 'Project', tooltip: "Examples: rasko, tex" },
        { name: 'projectVersion', type: 'string', displayName: 'Project version', group: 'Project' },
        { name: 'dbVersion', type: 'number', displayName: 'Database version #deprecated', group: 'Connection #deprecated', default: 1 },
        { name: 'dbClasses', type: 'array', displayName: 'Database classes #deprecated', group: 'Connection #deprecated' },
        { name: 'sessionTimeout', type: 'string', displayName: 'Session timeout #deprecated', group: 'Auth #deprecated', tooltip: "milliseconds lib format: 1m, 3d", default: '5d' },
        { name: 'defaultDateFormat', type: 'string', displayName: 'Date format #deprecated', group: 'Defaults #deprecated', tooltip: "Dayjs format", default: 'YYYY-MM-DD' },
    ]
})