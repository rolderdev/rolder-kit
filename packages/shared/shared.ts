import '@shared/types-v0.1.0'
import set from 'just-safe-set'
import { proxy } from 'valtio'

// Base
set(window, ['R', 'params'], {})
// Реактивное остояние инициализации приложения.
set(window, ['R', 'states', 'init'], proxy({ value: 'initializing' }))
// Обратная совместимость
set(window, ['R', 'states', 'backend'], 'notInitialized')
// Глобальные items и ноды иерархий.
set(window, ['R', 'items'], proxy())
set(window, ['R', 'itemsHistory'], proxy())
set(window, ['R', 'nodes'], proxy())

// logs
const urlParams = new URLSearchParams(window.location.search)
const debug = Number.parseInt(urlParams.get('debug') || '0')
//set(window, ['R', 'states', 'debug'], debug);

import { consola } from 'consola'
switch (debug) {
	case 0:
		consola.level = 0
		break
	case 1:
		consola.level = 2
		break
	case 2:
		consola.level = 3
		break
	case 3:
		consola.level = 4
		break
}

window.log = {
	start: () => performance.now(),
	end: (title, startTime) => consola.log(title, Math.round(performance.now() - startTime)),
	info: (title, ...args) => consola.info(title, ...args),
	debug: (title, ...args) => consola.debug(title, ...args),
	error: (title, ...args) => consola.error(title, ...args),
}

// RK version
import rKitJson from '../../package.json'
set(window, ['R', 'env', 'rolderKit'], rKitJson.version)

// icons
import * as icons from './src/icons'
export type Icons = typeof icons
R.libs.icons = icons

// libs
import './src/libs'

// Сменим состояние инициализации приложения.
R.states.init.value = 'shared'
