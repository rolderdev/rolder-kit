import React = require('react')

const urlParams = new URLSearchParams(window.location.search)
const d = parseInt(urlParams.get('debug') || '0')
import { version } from '../../../../package.json'

import { consola } from "consola"
switch (d) {
    case 0: consola.level = 0; break
    case 1: consola.level = 2; break
    case 2: consola.level = 3; break
}

globalThis.log = {
    start: () => performance.now(),
    end: (title, startTime) => consola.log(title, Math.round(performance.now() - startTime)),
    info: (title, ...args) => consola.info(title, ...args),
    error: (title, ...args) => consola.error(title, ...args)
}

window.R = {
    env: { dbName: 'data' },
    libs: {},
    states: { backend: 'notInitialized', debug: d, devMode: false },
    params: {},
    utils: {},
}
window.Noodl = { getProjectSettings() { return { project: 'rk', projectVersion: version } } }

// =====================================================
import libs from '../../../../nodes/app/src/libs'; R.libs = libs
import utils from '../../../../nodes/app/src/utils'; R.utils = utils
import * as icons from '../../../../nodes/app/src/icons'; R.libs.icons = icons

// =====================================================

export default function (props: any) {
    return <>{props.children}</>
}