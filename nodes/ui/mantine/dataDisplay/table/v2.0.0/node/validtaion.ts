import '@shared/types-v0.1.0'
import type { Item } from '@shared/types-v0.1.0'
import type { Props } from './definition'

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
	} = R.libs.valibot

	const Columns = pipe(
		array(
			pipe(
				looseObject({
					id: string('"id" must be string.'),
					title: optional(string('"title" must be string.')),
					type: picklist(
						['accessor', 'getValue', 'custom', 'template', 'empty'],
						'"type" must by "accessor", "getValue", "custom", "template" or "empty".'
					),
					accessor: optional(string('"accessor" must be string.')),
					getValue: optional(function_('"getValue" must be function.')),
					template: optional(string('"template" must be string.')),
					width: optional(union([string(), number()], '"width" must be string or number.'), '100%'), // Дефолт в 100%
					sort: optional(
						strictObject({
							defaultDirection: optional(picklist(['asc', 'desc'], '"sort" must be "asc" or "desc".')),
							sortPath: optional(string('"sortPath" must be string.')),
							func: optional(function_('Sort "func" must be function.')),
						})
					),
					filter: optional(
						strictObject({
							template: optional(string('Filter "template" must be string.')),
							func: optional(function_('Filter "func" must be function.')),
							defaultState: optional(
								strictObject({
									enabled: boolean('Filter defaultState "enabled" must be boolean.'),
									value: pipe(
										unknown(),
										check((v) => Boolean(v), 'Filter defaultState "value" required.')
									),
								})
							),
						})
					),
				}),
				check((column) => !(column.type === 'accessor' && !column.accessor), 'Must be "accessor" key for accessor type.'),
				check((column) => !(column.type === 'getValue' && !column.getValue), 'Must be "getValue" key for getValue type.'),
				check((column) => !(column.type === 'custom' && !column.custom), 'Must be "custom" key for custom type.'),
				check((column) => !(column.type === 'template' && !column.template), 'Must be "template" key for template type.'),
				check(
					(c) => !(c.type === 'empty' && (c.accessor || c.getValue || c.custom || c.template)),
					'"accessor", "getValue", "custom" and "template" must be omitted with "empty" type.'
				),
				check((column): boolean => {
					const sort = column.sort
					if (!sort) return true
					if (!p.sort && p.sortType !== 'frontend') return true
					return Boolean(sort.sortPath || column.type === 'accessor')
				}, '"sortPath" can by empty only with "accessor" column type or backend sort.')
			)
		),
		check(
			(columns) => R.libs.remeda.uniqueWith(columns, (a, b) => a.id === b.id).length === columns.length,
			'Columns must have unique ids.'
		),
		check((columns) => !p.sort || columns.some((i) => i.sort), 'Columns must have at least one "sort" key with "Sort" enabled.')
	)

	const result = safeParse(Columns, p.columnsDefinition)
	if (!result.success) {
		// Через forof, т.к. map добовляет запятые.
		// <pre> делает красоту c JSON.stringify.
		let html = '<pre><p>Columns errors:</p>'
		for (const issue of result.issues) {
			html += `<hr width="100%" size="0.5px">${issue.message}<br>${
				issue.path?.[0].value ? JSON.stringify(issue.path?.[0].value, null, '  ') : JSON.stringify(issue.input, null, '  ')
			}`
		}
		html += '<hr width="100%" size="0.5px"></pre>'

		return html
	}
	return true
}

export const validateItems = (p: Props) => {
	const { array, optional, safeParse, looseObject, string, check, pipe } = R.libs.valibot

	const Items = array(
		pipe(
			looseObject({ id: optional(string()) }),
			check((item) => Boolean(item.id))
		)
	)

	const result = safeParse(Items, p.items)
	if (!result.success) return 'Some items do not have "id".'
	return true
}

export const validateExpandedItems = (items?: Item[], allowMultiple?: boolean) => {
	if (!allowMultiple && items && items?.length > 1) return 'Multiple expansion is not allowed. Array must contains one item.'
	return true
}
