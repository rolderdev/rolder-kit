// Проверяет схему и выдает красиво в ошибках.

import '@shared/types-v0.1.0';
import { InferOutput } from 'valibot';
import { Props } from '../types';

const { array, check, integer, maxValue, minValue, number, optional, pipe, safeParse, strictObject, string, unknown } =
	R.libs.valibot;
const { typeOf, unique, last } = R.libs.just;

const FetchScheme = pipe(
	array(
		pipe(
			strictObject({
				dbClass: pipe(
					string('"dbClass" must be string.'),
					check((dbClass) => {
						return !R.dbClasses?.[dbClass] ? false : true;
					}, `There is no such DB class.`)
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
						let isValid = true;
						if (sorts) {
							if (!Array.isArray(sorts)) isValid = false;
							else {
								for (const sort of sorts) {
									if (typeOf(sort as Object) === 'object') {
										if (!Number.isNaN(parseInt(Object.keys(sort as any)[0]))) isValid = false;
										else if (!['asc', 'desc'].includes(Object.values(sort as any)[0] as any)) isValid = false;
									} else isValid = false;
								}
							}
						}
						return isValid;
					}, '"Sorts" must be array of objects with following format <code>{ [path.to.value]: "asc" | "desc" }</code>')
				),
				hierarchyFunc: optional(string('"hierarchyFunc" must be string to transfer over net.')),
			}),
			check((scheme) => (scheme.filters && scheme.filtersFunc ? false : true), 'Must be "filters" or "filtersFunc", choose one.')
		)
	),
	check((schemes) => (schemes.length !== unique(schemes.map((i) => i.dbClass)).length ? false : true), 'dbClass must be unique.')
);

export type FetchScheme = InferOutput<typeof FetchScheme>;

export const validateFetchScheme = (p: Props) => {
	const result = safeParse(FetchScheme, p.fetchScheme);
	if (!result.success) {
		// Через forof, т.к. map добовляет запятые.
		// <pre> делает красоту c JSON.stringify.
		let html = '<pre><p>Scheme errors:</p>';
		for (const issue of result.issues) {
			html += `<hr width="100%" size="0.5px">${
				issue.type === 'strict_object'
					? `There is no key "${last(issue.path || []).key}" at Scheme specification.`
					: issue.message
			}<br>${
				issue.path?.[0].value ? JSON.stringify(issue.path?.[0].value, null, '  ') : JSON.stringify(issue.input, null, '  ')
			}`;
		}
		html += '<hr width="100%" size="0.5px"></pre>';

		return html;
	}
	return true;
};
