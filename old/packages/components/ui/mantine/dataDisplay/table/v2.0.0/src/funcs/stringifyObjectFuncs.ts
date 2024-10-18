/* Функция преобразует объект, заменяя функции их текстовым значением. */

import map from 'just-map-object'
import isFunction from 'lodash.isfunction'

export default function (object: Record<string, unknown>): Record<string, unknown> {
	const parsedObject: any = {}
	map(object, (key, value) => {
		if (isFunction(value)) parsedObject[key] = value.toString()
		else parsedObject[key] = value
	})
	return parsedObject
}
