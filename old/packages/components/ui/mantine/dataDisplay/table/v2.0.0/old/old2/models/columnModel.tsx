/* Модель колонки. Обеспечивает рендер ячеек. */

import { type Instance, t } from 'mobx-state-tree'

/* // Оборачиваем ячейку типа accessor для точечной реаткивности.
// Реактивна на ключ в подготовленном объекте "accessors".
const AccessorCell = observer((p: { accessors: Record['accessors']; accessor: string }) => {
	log.debug('AccessorCell render');
	return get(p.accessors, p.accessor);
});

// Работает как accessor ячейка, но зависимости массив, а результат - выполненная функция, которую задал сам разработчик.
// getValue работает по принципу реактивной функции. Т.е. функция getValue срабатывает тогда, когда изменились зависимости.
// Разработчик должен самостоятельно указать зависимости в схеме - accessors.
// В отличии от предыдущих реализаций, getValue параметром передает не весь item, а только данные, которые были указаны в зависимостях.
// p.record.getValue - view в модели record.
const GetValueCell = observer((p: { record: Record; column: any }) => {
	log.debug('GetValueCell render');
	return p.record.getValue(p.column);
});

// У этой ячейки нет повторных рендеров. Здесь observer останавливает рендеринг, т.к. ему нечего отслеживать.
// Реактивность отдана в Noodl через Object, где указание ключей и есть точечная реактивность.
// Для этого в store.setState при изменении items объекты Noodl, используемые в reactNode пересоздаются.
const TemplateCell = observer((p: { reactNode: React.ReactNode }) => {
	log.debug('TemplateCell render');
	return p.reactNode || '';
}); */

interface Column extends Instance<typeof columnModel> {}
const columnModel = t
	.model('Column', {
		columnIdx: t.identifierNumber,
		// columnDefinition - здесь храним оригинальную схему колонки, чтобы передать ее в библиотеку, перезаписав совпадения параметрами ниже
		// Это нужно для того, чтобы разработчик мог передать стандартные параметры библиотеки.
		columnDefinition: t.frozen(),
		type: t.enumeration(['accessor', 'getValue', 'template']),
		accessor: '', // Здесь дефолт пустая строка, чтобы не конфликтовать с таким же параметром в библиотеке, где это обязательноей поле.
		accessors: t.maybe(t.array(t.string)), // Реактивные поля
		getValue: t.frozen(),
		template: t.maybe(t.string),
		// frozen - значет не задана структура и нет реактинвости на внутрянку.
		//templateCells: t.optional(t.map(t.frozen<React.ReactNode>()), {}),
		expander: false,
	})
	.views((self) => ({
		// Реактивная функция для отрисовки ячейки.
		/* render(record: Record, onRowClick: TableProps['onRowClick']) {
			let cell: React.ReactNode;
			// Ячейка с шевроном. Observer добавляет реактивность.
			const eCell = <Observer>{() => <ExpanderCell cell={cell} onRowClick={onRowClick} record={record} />}</Observer>;

			// Для каждого типа ячейки своя компонента.
			switch (self.type) {
				case 'accessor':
					cell = <AccessorCell accessors={record.accessors} accessor={self.accessor} />;
					break;
				case 'getValue':
					cell = <GetValueCell record={record} column={self} />;
					break;
				case 'template':
					cell = <TemplateCell reactNode={self.templateCells.get(record.id)} />;
					break;
				default:
					return '';
			}

			return self.expander ? eCell : cell;
		} */
	}))

export { columnModel, type Column }
