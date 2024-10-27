import '@shared/types-v0.1.0'

export const merge = (p: {
	object: any
	proxyObject: any
	parentKey?: string
	parentProxyObject?: any
	skipDelete?: boolean
}) => {
	const { map, typeOf } = R.libs.just
	const { object, proxyObject, parentKey, parentProxyObject, skipDelete } = p

	if (proxyObject) {
		// Обновление.
		map(object, (k, v) => {
			if (typeOf(v) === 'object')
				merge({
					object: v,
					proxyObject: proxyObject[k],
					parentKey: k,
					parentProxyObject: proxyObject,
				})
			// Массив просто перезапишем. Возможно, здесь нужно доработать.
			else proxyObject[k] = v
		})

		// Удаление.
		if (!skipDelete)
			map(proxyObject, (k, v) => {
				if ((object[k] === undefined || object[k] === null) && k !== 'roots' && typeOf(v) !== 'function') delete proxyObject[k]
			})
	} else if (parentKey && parentProxyObject) parentProxyObject[parentKey] = object
}
