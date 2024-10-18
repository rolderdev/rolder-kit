// Проверяет схему и выдает красиво в ошибках.

import '@shared/types-v0.1.0'
import type { InferOutput } from 'shared/src/libs/valibot'
import type { Props } from '../node/definition'

export type FetchScheme = InferOutput<ReturnType<typeof getTypedFetchScheme>>

const getTypedFetchScheme = () => {
	const { typeOf, unique } = R.libs.just
	const { array, check, integer, maxValue, minValue, number, optional, pipe, strictObject, string, unknown, union } =
		R.libs.valibot

	return pipe(
		array(
			pipe(
				strictObject({
					dbName: optional(string('"dbName" must be string.')),
					dbClass: pipe(
						union([
							string('"dbClass" must be string.'),
							strictObject({
								name: string('"dbClass" must be string.'),
								version: number('"version" must be number.'),
							}),
						]),
						check(
							(dbClass): boolean => (typeof dbClass === 'string' && R.dbClasses ? !!R.dbClasses[dbClass] : true),
							'There is no such DB class.'
						),
						check(
							(dbClassObj): boolean => (typeof dbClassObj === 'object' && R.dbClasses ? !!R.dbClasses[dbClassObj.name] : true),
							'There is no such DB class.'
						),
						check(
							(dbClassObj) =>
								typeof dbClassObj === 'object' && R.dbClasses
									? R.dbClasses[dbClassObj.name]?.versions?.includes(dbClassObj.version)
									: true,
							'There is no such version of DB class.'
						)
					),
					order: optional(
						pipe(
							number('"order" must be integer.'),
							integer('"order" must be integer.'),
							minValue(0, '"order" cannot be negative.')
						)
					),
					size: optional(
						pipe(
							number('"size" must be integer.'),
							integer('"size" must be integer.'),
							minValue(0, '"size" must be at least 0.'),
							maxValue(1000, '"size" must not exceed 1000.')
						)
					),
					// Запара с объектами, ключи которых не статичны. Приходится действовать через unknown и проверять руками.
					filters: pipe(
						unknown(),
						check((filters) => typeOf(filters) === 'object' || !filters, '"filters" must be object.')
					),
					filtersFunc: optional(string('"filtersFunc" must be string to transfer over net.')),
					sorts: pipe(
						unknown(),
						check((sorts) => {
							let isValid = true
							if (sorts) {
								if (!Array.isArray(sorts)) isValid = false
								else {
									for (const sort of sorts) {
										if (typeOf(sort as Record<string, unknown>) === 'object') {
											if (!Number.isNaN(Number.parseInt(Object.keys(sort as any)[0]))) isValid = false
											else if (!['asc', 'desc'].includes(Object.values(sort as any)[0] as any)) isValid = false
										} else isValid = false
									}
								}
							}
							return isValid
						}, '"Sorts" must be array of objects with following format <code>{ [path.to.value]: "asc" | "desc" }</code>')
					),
					childrenFunc: optional(string('"childrenFunc" must be string to transfer over net.')),
					recursionFunc: optional(string('"recursionFunc" must be string to transfer over net.')),
					aggregations: pipe(
						unknown(),
						check((filters) => typeOf(filters) === 'object' || !filters, '"aggregations" must be object.')
					),
					history: optional(
						pipe(
							number('"history" must be integer.'),
							integer('"history" must be integer.'),
							minValue(1, '"history" must be at least 1.'),
							maxValue(100, '"history" must not exceed 100.')
						)
					),
				}),
				check((scheme) => !(scheme.filters && scheme.filtersFunc), 'Must be "filters" or "filtersFunc", choose one.'),
				check((scheme) => {
					let isValid = true
					if (scheme.filtersFunc)
						try {
							Function(scheme.filtersFunc)
						} catch (e: any) {
							log.error(e)
							isValid = false
						}
					return isValid
				}, '"filtersFunc" eval error. Details at the console.'),
				check((scheme) => {
					let isValid = true
					if (scheme.childrenFunc)
						try {
							Function(scheme.childrenFunc)
						} catch (e: any) {
							log.error(e)
							isValid = false
						}
					return isValid
				}, '"childrenFunc" eval error. Details at the console.'),
				check((scheme) => {
					let isValid = true
					if (scheme.recursionFunc)
						try {
							Function(scheme.recursionFunc)
						} catch (e: any) {
							log.error(e)
							isValid = false
						}
					return isValid
				}, '"recursionFunc" eval error. Details at the console.')
			)
		),
		check((schemes) => schemes.length === unique(schemes.map((i) => i.dbClass)).length, 'dbClass must be unique.')
	)
}

export const validateFetchScheme = (p: Props) => {
	const result = R.libs.valibot.safeParse(getTypedFetchScheme(), p.fetchScheme)

	if (!result.success) {
		// Через forof, т.к. map добовляет запятые.
		// <pre> делает красоту c JSON.stringify.
		let html = '<pre><p>Scheme errors:</p>'
		for (const issue of result.issues) {
			html += `<hr width="100%" size="0.5px">${
				issue.type === 'strict_object'
					? `There is no key "${R.libs.just.last(issue.path || []).key}" at Scheme specification.`
					: issue.message
			}<br>${issue.path?.[0].value ? JSON.stringify(issue.path?.[0].value, null, '  ') : JSON.stringify(issue.input, null, '  ')}`
		}
		html += '<hr width="100%" size="0.5px"></pre>'

		return html
	}
	return true
}
