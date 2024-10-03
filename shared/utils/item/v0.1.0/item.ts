import '@shared/types-v0.1.0';

export const merge = (object: any, proxyObject: any, skipDelete?: boolean) => {
	const { map, typeOf } = R.libs.just;

	if (proxyObject) {
		// Обновление.
		map(object, (k, v) => {
			if (typeOf(v) === 'object') merge(v as any, proxyObject[k] as any);
			// Массив просто перезапишем. Возможно, здесь нужно доработать.
			else proxyObject[k] = v;
		});

		// Удаление.
		if (!skipDelete)
			map(proxyObject, (k, v) => {
				if ((object[k] === undefined || object[k] === null) && k !== 'roots' && typeOf(v) !== 'function') delete proxyObject[k];
			});
	}
};
