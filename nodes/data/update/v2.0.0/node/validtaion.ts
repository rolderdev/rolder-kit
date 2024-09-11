// Проверяет схему и выдает красиво в ошибках.

import '@shared/types-v0.1.0';
import type { Props } from '../node/definition';
import type { InferOutput } from 'shared/src/libs/valibot';
import type { Item } from '@shared/types-v0.1.0';

type UpdateSchemeSchema = InferOutput<ReturnType<typeof getTypedUpdateScheme>>;
export type UpdateScheme = (Omit<UpdateSchemeSchema[number], 'items'> & { items: Item[] })[];

const getTypedUpdateScheme = () => {
	const { unique, typeOf } = R.libs.just;
	const { array, check, optional, pipe, strictObject, string, boolean, unknown } = R.libs.valibot;

	return pipe(
		array(
			strictObject({
				dbClass: pipe(
					string('"dbClass" must be string.'),
					check((dbClass) => {
						return R.dbClasses ? (!R.dbClasses?.[dbClass] ? false : true) : true;
					}, `There is no such DB class.`)
				),
				items: array(
					pipe(
						unknown(),
						check((item) => typeOf(item) === 'object' || !item, '"item" must be object.'),
						check((item: any) => (!item.id ? false : true), '"item" must have "id".')
					)
				),
				history: optional(boolean()),
				deleteFields: optional(array(string())),
			})
		),
		check(
			(schemes) => (schemes.length !== unique(schemes.map((i) => i.dbClass)).length ? false : true),
			'dbClass must be unique.'
		)
	);
};

export const validateUpdateScheme = (p: Props) => {
	const result = R.libs.valibot.safeParse(getTypedUpdateScheme(), p.updateScheme);

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
