/* Функция обрабатывает исходную схему колонки для всех вариантов
Варианты ячеек:
	0. Стандартная ячейка - ничего не делаем, библиотека берет данные из accessor.
	1. getValue - запускает скрипт, заданный разработчиком в схеме.
	2. Кастомная ячейка - создается Repeater и React-ноды для каждой ячейки колонки.	
expander добавляет шеврон во все варианты.

column.render - функция библиотеки, позволяющая отрисовывать React-ноду. Когда не нужно подавать React-ноду (вариант 
	стандартной ячейки без шеврона), не используем render, оставляя стандартный способ библиотеки, через accessor.
	Эта функция рендерит ячейку 6 раз. Без нее хз, нельзя проверить. Но пофиг, без нее это всегда простой текст.
	Поэтому используется useMemo для оптимизации.
*/

import type { NoodlNode } from '@packages/node';
import type { Store } from '../models/storeModel';
//import type { ColumnDefinition } from '../models/columnModel';

// Используем items, т.к. records еще нет
export default async function getColumn(
	noodlNode: NoodlNode,
	tableProps: Store['tableProps']
	//columnDefinition: ColumnDefinition
) {
	// Опеределяем вариант ячейки

	// Кастомная ячейка. Первая, т.к. вариант getValue не имеет смысла с кастомной ячейкой.
	/* if (column.template && !column.getValue) {
		// Создаем кастомные ячейки. Noodl заставляет нас делать это асинхронно.
		const customCells = await createCustomCells(noodlNode, expansionTemplate, items);
		column.render = (record) => useMemo(() => customCells.find((i) => i.itemId === record.id)?.reactNode, []);
	}

	// Ячейка getValue
	if (!column.template && column.getValue) {
		// Проверим функцию на ошибки. Базовые ошибки проверит регистратор ноды, но лишним не будет
		try {
			column.render = (record) => useMemo(() => column.getValue?.(record), []);
		} catch (error: any) {
			// Ругаемся прямо в интерфейс, в консоль выдаем stack trace и колонку
			R.libs.mantine?.MantineError(
				'Системная ошибка!',
				`Table getValue function error at column ${column.accessor}: ${error.message}`
			);
			log.error('Table getValue function error', { column, error });
		}
	} */

	// Стандартная ячейка с шевроном
	// В типе данных accessor не может быть пустым, но кто помешает разработчику опечататься в Noodl?
	if (!columnDefinition.template && !columnDefinition.getValue && columnDefinition.accessor && columnDefinition.expander) {
		//column.render = (record) => useExpanderCell(tableId, onRowClick, record, getValue(record, column.accessor));
		//		column.render = (record: any) => 'TEST';
	}

	// Стандартная ячейка
	return columnDefinition;
}
