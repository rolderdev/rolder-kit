import '@shared/types-v0.1.0';
import type { Props } from './definition';
import type { Item } from '@shared/types-v0.1.0';

export const validateColumns = (p: Props) => {
	const {
		array,
		check,
		optional,
		pipe,
		safeParse,
		looseObject,
		strictObject,
		string,
		number,
		picklist,
		function_,
		union,
		boolean,
		unknown,
	} = R.libs.valibot;

	const Columns = pipe(
		array(
			pipe(
				looseObject({
					title: optional(string('"title" must be string.')),
					type: picklist(['accessor', 'getValue', 'custom', 'template'], '"type" must by "accessor", "getValue" or "template".'),
					accessor: optional(string('"accessor" must be string.')),
					getValue: optional(function_('"getValue" must be function.')),
					template: optional(string('"template" must be string.')),
					width: optional(union([string(), number()], '"width" must be string or number.'), '100%'), // Дефолт в 100%
					sort: optional(union([boolean(), picklist(['asc', 'desc'])], '"sort" must be boolean, "asc" or "desc".')),
					sortPath: optional(string('"sortPath" must be string.')),
					filter: optional(
						strictObject({
							template: string('Filter "template" must be string.'),
							func: optional(function_('Filter "func" must be function.')),
							defaultState: optional(
								strictObject({
									enabled: boolean('Filter defaultState "enabled" must be boolean.'),
									value: pipe(
										unknown(),
										check((v) => (v ? true : false), 'Filter defaultState "value" required.')
									),
								})
							),
						})
					),
				}),
				check(
					(column) => (column.type === 'accessor' && !column.accessor ? false : true),
					'Must be "accessor" key for accessor type.'
				),
				check(
					(column) => (column.type === 'getValue' && !column.getValue ? false : true),
					'Must be "getValue" key for getValue type.'
				),
				check((column) => (column.type === 'custom' && !column.custom ? false : true), 'Must be "custom" key for custom type.'),
				check(
					(column) => (column.type === 'template' && !column.template ? false : true),
					'Must be "template" key for template type.'
				),
				check(
					(column) => (p.sort && p.sortType === 'frontend' && column.sort ? (column.sortPath ? true : false) : true),
					'Must be "sortPath" key for "Frontend" sort type.'
				)
			)
		),
		check(
			(columns) => (p.sort ? (columns.filter((i) => i.sort).length ? true : false) : true),
			'Columns must have at least one "sort" key with "Sort" enabled.'
		)
	);

	const result = safeParse(Columns, p.columnsDefinition);
	if (!result.success) {
		// Через forof, т.к. map добовляет запятые.
		// <pre> делает красоту c JSON.stringify.
		let html = '<pre><p>Columns errors:</p>';
		for (const issue of result.issues) {
			html += `<hr width="100%" size="0.5px">${issue.message}<br>${
				issue.path?.[0].value ? JSON.stringify(issue.path?.[0].value, null, '  ') : JSON.stringify(issue.input, null, '  ')
			}`;
		}
		html += '<hr width="100%" size="0.5px"></pre>';

		return html;
	}
	return true;
};

export const validateItems = (p: Props) => {
	const { array, optional, safeParse, looseObject, string, check, pipe } = R.libs.valibot;

	const Items = array(
		pipe(
			looseObject({ id: optional(string()) }),
			check((item) => (!item.id ? false : true))
		)
	);

	const result = safeParse(Items, p.items);
	if (!result.success) return 'Some items do not have "id".';
	return true;
};

export const validateExpandedItems = (items?: Item[], allowMultiple?: boolean) => {
	if (!allowMultiple && items && items?.length > 1) return 'Multiple expansion is not allowed. Array must contains one item.';
	return true;
};
