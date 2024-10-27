/* Функция сравнивает массивы объектов.
Если в объекте есть функции на первом уровне, они так же буду проверены.
Глубже сравнение функций работать не будет и будет возвращаться false. */

import isEqual from 'lodash.isequal'
import stringifyObjectFuncs from './stringifyObjectFuncs'

export default function (source: any[], traget: any[]): boolean {
	const parsedSourceArr: any[] = []
	source.map((s) => parsedSourceArr.push(stringifyObjectFuncs(s)))

	const parsedTargetArr: any[] = []
	traget.map((t) => parsedTargetArr.push(stringifyObjectFuncs(t)))

	return isEqual(parsedSourceArr, parsedTargetArr)
}
