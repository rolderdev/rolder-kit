/* Модель колонки. Реактивны все поля описанные в модели */

import { type Instance, t } from 'mobx-state-tree'

interface ColumnDefinitionModel extends Instance<typeof columnModel> {}

const columnDefinitionModel = t.model('ColumnDefinition', {
	columnIdx: t.identifierNumber,
	n: t.model({ t: t.string }),
})

interface ColumnModel extends Instance<typeof columnModel> {}
const columnModel = t.model('Column', {
	//definition: t.reference(t.late(() => columnDefinitionModel)),
	//columnIdx: t.identifierNumber,
	type: t.enumeration(['accessor', 'getValue', 'template']),
	accessor: '', // Здесь дефолт пустая строка, чтобы не конфликтовать с таким же параметром в библиотеке, где это обязательноей поле.
	n: t.model({ t: t.string }),
	title: '',
	/* n: t.refinement(t.map(t.string), (value) => {
		console.log(value);
		if (value) return Object.keys(value).every((key) => typeof key === 'string' && typeof value[key] === 'string');
		else return false;
	}) */
	//accessors: t.maybe(t.array(t.string)), // Реактивные поля для ячеек типа "accessor" и "getValue".
	//getValue: t.frozen(),
	//template: t.maybe(t.string),
	// frozen - значет не задана структура и нет реактинвости на внутрянку.
	//templateCells: t.optional(t.map(t.frozen<React.ReactNode>()), {}),
	//expander: false
})
/* 	.views((self) => ({}))

	.actions((self) => {
		return {};
	}); */

export { columnModel, columnDefinitionModel, type ColumnModel, type ColumnDefinitionModel }
