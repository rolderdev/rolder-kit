/* Функция обновляет ключи на любом уровне глубины обеспечивая точечную реактивность. */

import { flatten } from 'flat';
import has from 'just-has';
import map from 'just-map-object';
import set from 'just-safe-set';
import unset from 'lodash.unset';

export default function (source: any, target: any) {
	const flatSource = flatten(source) as any;
	const flatTarget = flatten(target) as any;
	// Запись новых ключей.
	map(flatSource, (key, value) => set(target, key, value));
	// Удаление ключей.
	map(flatTarget as any, (key) => {
		if (!has(source, key)) unset(target, key);
	});
}
