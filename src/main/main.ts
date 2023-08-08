import Clone from 'just-clone'; window.Clone = Clone
import Mustache from 'mustache'; window.Mustache = Mustache

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

import filterBy from '../utils/data/v0.3.0/filterBy'; window.FilterBy = filterBy

// #########################################################
import { defineModule } from '@noodl/noodl-sdk'
import reactNodes from './nodes/v0.1.0/rNodes';
import nodes from './nodes/v0.1.0/jsNodes';

defineModule({
    nodes,
    reactNodes,
    settings: [
        { name: 'envVersion', type: 'string', displayName: 'Environment version', group: 'Connection', tooltip: "Examples: d2, s2, p3", },
        { name: 'project', type: 'string', displayName: 'Project name', group: 'Connection', tooltip: "Examples: rasko, tex" },
        { name: 'projectVersion', type: 'string', displayName: 'Project version', group: 'General' },
        { name: 'dbVersion', type: 'number', displayName: 'Database version', group: 'Connection', default: 1 },
        { name: 'sessionTimeout', type: 'string', displayName: 'Session timeout', group: 'Auth', tooltip: "milliseconds lib format: 1m, 3d" },
    ]
})