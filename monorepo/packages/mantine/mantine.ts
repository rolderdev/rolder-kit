const urlParams = new URLSearchParams(window.location.search)
const debug = parseInt(urlParams.get('debug') || '0')
window.R.states = { debug }
import rKitJson from '../../package.json'
window.R.env = { rolderKit: `v${rKitJson.version}` }

//====================================================================

import nodesStore from './nodes/nodesStore'

import { defineModule } from '@noodl/noodl-sdk'
defineModule({
    reactNodes: nodesStore,
    settings: [
        { name: 'envVersion', type: 'string', displayName: 'Environment version', group: 'Connection', tooltip: "Examples: d2, s2, p3", },
        { name: 'project', type: 'string', displayName: 'Project name', group: 'Connection', tooltip: "Examples: rasko, tex" },
        { name: 'projectVersion', type: 'string', displayName: 'Project version', group: 'General' },
        { name: 'dbVersion', type: 'number', displayName: 'Database version', group: 'Connection', default: 1 },
        { name: 'dbClasses', type: 'array', displayName: 'Database classes', group: 'Connection' },
        { name: 'sessionTimeout', type: 'string', displayName: 'Session timeout', group: 'Auth', tooltip: "milliseconds lib format: 1m, 3d", default: '5d' },
        { name: 'defaultDateFormat', type: 'string', displayName: 'Date format', group: 'Defaults', tooltip: "Dayjs format", default: 'YYYY-MM-DD' },
    ]
})