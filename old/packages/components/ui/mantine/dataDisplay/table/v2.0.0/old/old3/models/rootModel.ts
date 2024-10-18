/* Модель для хранения и управления состоянием всей таблицы.
Создаем одно большое хранилище и бесстрашно его меняем хоть внутри ячейки. В этом прелесть MobX.
Создается это за счет Reference - куда бы не передавался store, создается только ссылка на него, а не копия.
Точечная реактивность позвоялет в любом месте использовать actions, изменяя состояние нужной части таблицы.

Осбенности:
	- set из MobX добавляет данные в экземпляр модели. При этом делает он это с так:
		1. 
		1. Если подать в значение объект, он добавит его, но не будет реактивности. Это хорошо подходит, когда нужно использовать данные, но
		не нужно реагировать на их изменение. Здесь это используется в setRecords.
		2. Если подать путь к литералу и в данных сам литерал, то будет создана структура такого вида {'content.name': 'Кузьма'}.
		'content.name' при этом становится реактивным. Это 
	 Это значит, что можно динамически расширять модель по заранее не известным данным.
	Здесь пример в setColumns, где раширяется модель колонки, чтобы не описывать все стандартные параметры библиотеки. Пока, это 
	единственный мне известный способ делать реактивным конкретные поля не определяя их в модели. Такой же пример с setRecords.
*/

import type { NoodlNode } from '@packages/node'
import type { DataTableColumn } from 'mantine-datatable'
import { observable, set, values } from 'mobx'
import { type Instance, t } from 'mobx-state-tree'
import type { Item } from 'types'
import type { Props } from '../../types'
import { type ColumnDefinitionModel, type ColumnModel, columnDefinitionModel, columnModel } from './columnModel'
import { getLibProps, libPropsModel } from './libPropsModel'
import { type RecordModel, recordModel } from './recordModel'
import { getTableProps, tablePropsModel } from './tablePropsModel'

// Вытягивает тип из модели
interface RootModel extends Instance<typeof rootModel> {}

const rootModel = t
	.model('store', {
		noodlNode: t.frozen<NoodlNode>(),
		tableId: t.identifier,
		libProps: libPropsModel, // Стандартные настройки баблиотеки.
		tableProps: tablePropsModel, // Наши специфичные настройки.
		columnsDefinition: t.map(columnDefinitionModel),
		columns: t.map(columnModel),
		records: t.map(recordModel),
	})
	.views((self) => ({
		// Подготовим колонки для библиотеки. Преобразуем map в массив и добавим типизацию.
		/* get libColumns() {
			return Array.from(self.columns.values()).map((column) => {
				console.log('libColumns', column.definition);
				return { ...column.definition, ...column }; // Это делает реактивным каждый ключ схемы колонки.
			}) as DataTableColumn<RecordModel>[];
			const columns = Array.from(self.columns.values());
			return columns.map((column, columnIdx) => ({
				//...column.columnDefinition,
				...column,
				render(record) {
					return record.renderCell(); // Передаем в библиотеку свою функцию для рендера ячейки.
				},
				accessor: `${columnIdx}` // accessor для библиотеки - это id. Подменим на индекс, чтобы управлять этим реактивно.
			})) as DataTableColumn<RecordModel>[];
		}, */
		// Подготовим records для библиотеки. Преобразуем map в массив и добавим типизацию.
		get libRecords() {
			return Array.from(self.records.values()) as RecordModel[] // Почему то теряется Item из RecordModel.
		},
	}))
	.actions((self) => {
		function setProps(p: Props) {
			self.libProps = getLibProps(p)
			self.tableProps = getTableProps(p)
		}
		function setColumns(columnsDefinition: ColumnModel[]) {
			columnsDefinition.map((columnDefinition, columnIdx) => {
				// Установим ключи модели.

				self.columns.set(columnIdx, columnDefinition)
				const column = self.columns.get(columnIdx)
				if (column) set(column, columnDefinition)
				/*if (!column) {
					self.columns.set(columnIdx, { ...columnDefinition, columnIdx, definition: columnDefinition });
					const column = self.columns.get(columnIdx);
					if (column) set(column, columnDefinition);
				} else set(column, columnDefinition); */
				// Установим дополнительные ключи, не определенные в модели для использования стандартных настроек библиотеки, width, например.
				//if (column) set(column, columnDefinition);
				//console.log({ column: column?.definition });
			})
		}
		function setRecords(columnsDefinition: ColumnModel[], items: Item[]) {
			items.map((item) => {
				//self.records.set(item.id, { id: item.id }); // Создадим пустой record, указав только id для удобства.
				//const record = self.records.get(item.id);
				//if (record) set(record, { item }); // Наполним модель. Это не делает item реактинвым.
				// Добавляем реактивные ключи для колонок типа "accessor" и "getValue".
				/* 				columnsDefinition.map((columnDefinition) => {
					if (['accessor', 'getValue'].includes(i.type)) {
						// set из MobX создает ключи-пути, получается такой объект {some.nested.key: 'value'}
						if (columnDefinition.accessor) set(self.accessors, i.accessor, getValue(item, i.accessor));
						//if (i.accessors) i.accessors.map((accessor) => set(self.accessors, accessor, getValue(item, accessor)));
					}
				}); */
			})
		}

		return { setProps, setColumns, setRecords }
	})

export { rootModel, type RootModel }
