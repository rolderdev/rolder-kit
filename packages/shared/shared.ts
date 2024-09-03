import set from 'just-safe-set';
import { proxyMap } from 'valtio/utils';

// Base
set(window, ['R', 'params'], {});
// Обратная совместимость
set(window, ['R', 'states', 'backend'], 'notInitialized');
// Глобальные items и ноды иерархий.
set(window, ['R', 'items'], proxyMap());
set(window, ['R', 'nodes'], proxyMap());

// logs
const urlParams = new URLSearchParams(window.location.search);
const debug = parseInt(urlParams.get('debug') || '0');
//set(window, ['R', 'states', 'debug'], debug);

import { consola } from 'consola';
switch (debug) {
	case 0:
		consola.level = 0;
		break;
	case 1:
		consola.level = 2;
		break;
	case 2:
		consola.level = 3;
		break;
	case 3:
		consola.level = 4;
		break;
}

window.log = {
	start: () => performance.now(),
	end: (title, startTime) => consola.log(title, Math.round(performance.now() - startTime)),
	info: (title, ...args) => consola.info(title, ...args),
	debug: (title, ...args) => consola.debug(title, ...args),
	error: (title, ...args) => consola.error(title, ...args),
};

// RK version
import rKitJson from '../../package.json';
set(window, ['R', 'env', 'rolderKit'], rKitJson.version);

// icons
import * as icons from './src/icons';
export type Icons = typeof icons;
R.libs.icons = icons;

// libs
import './src/libs';

// utils
import utils from './src/utils';
export type Utils = typeof utils;
set(window, ['R', 'utils'], utils);
