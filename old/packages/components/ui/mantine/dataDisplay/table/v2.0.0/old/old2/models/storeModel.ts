/* Модель для хранения и управления состоянием всей таблицы.
Создаем одно большое хранилище и бесстрашно его меняем хоть внутри ячейки. В этом прелесть MobX.
Создается это за счет Reference - куда бы не передавался store, создается только ссылка на него, а не копия.
Точечная реактивность позвоялет в любом месте использовать actions, изменяя состояние нужной части таблицы. */

import { flow, t, type Instance as TInstance } from 'mobx-state-tree';
import type { Item } from 'types';
import { getLibProps, libPropsModel } from './libPropsModel';
import { getTableProps, tablePropsModel } from './tablePropsModel';
import { columnModel, type Column } from './columnModel';
import { recordModel } from './recordModel';
import type { NoodlNode } from '@packages/node';
import type { Props } from '../../types';

// Вытягивает тип из модели
interface Store extends TInstance<typeof storeModel> {}

const storeModel = t
	.model('store', {
		noodlNode: t.frozen<NoodlNode>(),
		tableId: t.identifier,
		libProps: libPropsModel, // стандартные настройки баблиотеки
		tableProps: tablePropsModel, // наши специфичные настройки
		// Здесь map, т.к. у колонок нет id. В map ключ и есть id, за счет чего колонки становятся отдельными реактивными объектами.
		columns: t.map(columnModel),
		records: t.map(recordModel) // Здесь map для удобстав использования.
		//templateCells: templateCellModel // Хранилище кастомных ячеек.
	})
	.views((self) => ({
		ready() {},
		get expandedIds() {
			return Array.from(self.records.values())
				.filter((i) => i.expanded)
				.map((i) => i.id);
		}
	}))
	.actions((self) => {
		function setProps(p: Props) {
			self.libProps = getLibProps(p);
			self.tableProps = getTableProps(p);
		}

		function setColumns(columnsDefinition: Column[]) {
			columnsDefinition.map((columnDefinition, columnIdx) =>
				// ...columnDefinition - реактивные параметры.
				// columnIdx - индекс колонки как ключ в map и как ключ в объекте для удобства разработки.
				// columnDefinition - оригинальный объект, сюда разработчик кладет стандартные праметры библиотеки. Реактивность на весь объект.
				self.columns.set(columnIdx, { ...columnDefinition, columnIdx, columnDefinition })
			);
		}

		function setExpandedRows(expandedRowIds: string[]) {
			Array.from(self.records.values()).map((record) => {
				if (expandedRowIds.includes(record.id)) record.setExpanded(true);
				else record.setExpanded(false);
			});
		}

		const setTableState = flow(function* setState(columnsDefinition: Column[], items: Item[]) {
			// Важно выполнять асинхронные функции до установки колонок и items

			// Обновление кастомных ячеек. Нужно это делать до установки колонок, чтобы первичная загрузка не вела себя криво.
			// Проверка, что они нужны происходит внутри setTemplateCells
			//const templateCellsItemsStore = yield self.templateCells.setTemplateCells(self.noodlNode, columnsDefinition, items);

			// Обновление разворачиваемых строк
			//if (self.tableProps.expansion.enabled) yield setExpansionRows(items);

			// Установка колонок
			// Здесь мы только добавляем колонки, не делая преобразований как в прошлых версиях. Все кастомные потребности теперь в columnModel.
			columnsDefinition.map((column, columnIdx) => {
				self.columns.set(columnIdx, { ...column, columnIdx, columnDefinition: column });
				// Подготовим кастомные ячейки для одной колонки, если есть. Не страшно, что записываем каждый раз, MobX это разруливает.
				/* const templateCells = new Map<string, React.ReactNode>();
				if (column.type === 'template' && column.template && templateCellsItemsStore.size > 0) {
					for (let [itemId, itemColumnsCells] of templateCellsItemsStore) {
						templateCells.set(itemId, itemColumnsCells.find((i: any) => i.columnIdx === columnIdx).reactNode);
						self.columns
							.get(columnIdx)
							?.templateCells.set(itemId, itemColumnsCells.find((i: any) => i.columnIdx === columnIdx).reactNode);
					}
				} */
			});

			// Добавление и обновление records

			/* items.map((item) => {
				self.records.set(item.id, { id: item.id, item, accessors: {} });
				const record = self.records.get(item.id);
				record?.setState(self.noodlNode, item, Array.from(self.columns.values()), self.tableProps.expansion.template);
				if (record) {
					// Добавляем реактинвые поля из accessor каждой колонки. См. recordModel.
					//record.addAccessors(item, columns);
					// Добавляем кастомные ячейки.
					//record.setTemplateCells(self.noodlNode, columns);
					// Добавляем разворачиваемую React-ноду.
					//if (self.tableProps.expansion.enabled)
					//record.setExpansionReactNode(self.noodlNode, self.tableProps.expansion.template, item.id);
					// Пересоздаем Noodl-объекты для реактивности внутри кастомных ячеек.
					// Добавим функции для обновления таблицы из кастомной ячейки.
					//Noodl.Object.create({ ...item, updateRecord: record.updateRecord });
				}
			}); */

			// Удаление records
			Array.from(self.records.keys()).map((recordId) => {
				if (!items.map((i) => i.id).includes(recordId)) {
					self.records.delete(recordId);
				}
			});

			self.fetching = false; // Остановим анимацию загрузки
		});

		return { setProps, setColumns, setExpandedRows, setTableState };
	});

export { storeModel, type Store };
