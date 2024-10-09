// Проверяет схему и выдает красиво в ошибках.

import '@shared/types-v0.1.0';
import type { Props } from '../node/definition';
import { type InferOutput } from 'shared/src/libs/valibot';

export type DeleteScheme = InferOutput<ReturnType<typeof getTypedDeleteScheme>>;

const getTypedDeleteScheme = () => {
	const { unique } = R.libs.just;
	const { array, check, pipe, strictObject, string, optional, union, number } = R.libs.valibot;

	return pipe(
		array(
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
						(dbClass) => (typeof dbClass === 'string' && R.dbClasses ? (!R.dbClasses[dbClass] ? false : true) : true),
						`There is no such DB class.`
					),
					check(
						(dbClassObj) =>
							typeof dbClassObj === 'object' && R.dbClasses ? (!R.dbClasses[dbClassObj.name] ? false : true) : true,
						`There is no such DB class.`
					),
					check(
						(dbClassObj) =>
							typeof dbClassObj === 'object' && R.dbClasses
								? !R.dbClasses[dbClassObj.name]?.versions?.includes(dbClassObj.version)
									? false
									: true
								: true,
						`There is no such version of DB class.`
					)
				),
				ids: pipe(
					array(string('"id" must be string.'), '"ids" is required.'),
					check((ids) => (ids.length !== unique(ids).length ? false : true), '"ids" must be unique.')
				),
			})
		),
		check(
			(schemes) => (schemes.length !== unique(schemes.map((i) => i.dbClass)).length ? false : true),
			'dbClass must be unique.'
		)
	);
};

export const validateDeleteScheme = (p: Props) => {
	const result = R.libs.valibot.safeParse(getTypedDeleteScheme(), p.deleteScheme);

	if (!result.success) {
		// Через forof, т.к. map добовляет запятые.
		// <pre> делает красоту c JSON.stringify.
		let html = '<pre><p>Scheme errors:</p>';
		for (const issue of result.issues) {
			html += `<hr width="100%" size="0.5px">${
				issue.type === 'strict_object'
					? `There is no key "${R.libs.just.last(issue.path || []).key}" at Scheme specification.`
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
