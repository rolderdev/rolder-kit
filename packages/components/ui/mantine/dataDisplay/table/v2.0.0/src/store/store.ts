import { store, createStoreContext } from '@davstack/store';
import type { DataTableColumn } from 'mantine-datatable';
import type { NoodlNode } from '@packages/node';
import { sendOutput } from '@packages/port-send';
import type { TabelScopeStore } from '@packages/table-scope-v0.1.0/src/store';
import type { Item } from 'types';
import type { Props } from '../../types';
import handleItemsChange from './handleItemsChange';
import handleStateChange from './handleStateChange';
import { libPropsChanged, setLibProps, type LibProps } from '../models/libPropsModel';
import { setTableProps, tablePropsChanged, type TableProps } from '../models/tablePropsModel';
import { columnsDefinitionChanged, setColumnsDefinition, type Column } from '../models/columnModel';
import { itemsChanged, itemsContentChanged, setItems } from '../models/itemModel';
import { setDefaultSelectedItem } from '../models/singleSelectionModel';
import { setDefaultSelectedItems } from '../models/multiSelectionModel';
import { setDefaultExpandedItems, setExpansion } from '../models/expansionModel';
import handleItemsContentChange from './handleItemsContentChange';

export type ChangeState = {
	libProps: boolean;
	tableProps: boolean;
	columns: boolean;
	items: boolean;
	itemsContent: boolean;
	selectedItems: boolean;
	expandedItems: boolean;
};

const tableStore = store({
	// Базовые статичные настройки
	noodlNode: {} as NoodlNode,
	tableId: '',
	isChild: false,
	level: 0,
	inited: false,
	fetching: true,
	changeState: {
		libProps: false,
		tableProps: false,
		columns: false,
		items: false,
		selectedItems: false,
		expandedItems: false,
	} as ChangeState,
	templateCells: {} as Record<number, Record<string, React.ReactNode>>,
	expansionRows: {} as Record<string, React.ReactNode>, // React-ноды разворачиваемых строк.
	scopeStore: undefined as TabelScopeStore | undefined, // Хранилище TableScope.
	selectedItem: null as Item | null, // Выбранная строка.
	defaults: {
		selectedItem: false,
		selectedItems: false,
		expandedItems: false,
	},
	cold: {
		libProps: {} as LibProps,
		tableProps: {} as TableProps,
		columnsDefinition: [] as Partial<Column>[], // Оргинальная схема колонок для сравнения.
		items: undefined as Item[] | undefined, // Оригинальные items.
		selectedItems: [] as Item[], // Выбранные строки.
		expandedItems: [] as Item[], // Равзернутые строки.
	},
	hot: {
		libProps: {} as LibProps,
		tableProps: {} as TableProps,
		columns: [] as DataTableColumn<Item>[], // Подготовленные колонки для библиотеки.
		items: [] as Item[], // Подготовленные items. Отличаютя от оригинальных тем, что могу храниться в другом порядке.
		selectedItems: [] as Item[], // Выбранные строки.
		expandedIds: [] as string[], // Id равзернутых строк.
	},
	//sortState: undefined as DataTableSortStatus<Item> | undefined, // Состояние сортировки.
})
	.extend((s) => {
		// Фукция обновления холодного состяния с портов и настроек. Сравнивает состояния.
		// В отличии от горячего, важен порядок из-за зависимостей.
		const updateColdState = async (p: Props) => {
			//// Этап базовых данных. Нужно разбивать на 2 этапа, чтобы к моменту проверки основные данные были готовы.
			// Зафиксируем базовые изменения.
			const changeState = {
				libProps: libPropsChanged(s as any, p),
				tableProps: tablePropsChanged(s as any, p),
				columns: columnsDefinitionChanged(s as any, p),
				items: itemsChanged(s as any, p.items || []),
				itemsContent: itemsContentChanged(s as any, p.items || []),
			} as ChangeState;

			// Запишем базовые изменения.
			if (changeState.libProps) setLibProps(s as any, p);
			if (changeState.tableProps) setTableProps(s as any, p);
			if (changeState.columns) setColumnsDefinition(s as any, p);
			if (changeState.items || changeState.itemsContent) setItems(s as any, p);

			//// Этап зависимых данных.
			// Зафиксируем дефолты.
			setDefaultSelectedItem(s as any, p.defaultSelectedItem);
			setDefaultSelectedItems(s as any, changeState, p.defaultSelectedItems);
			setDefaultExpandedItems(s as any, changeState, p.defaultExpandedItems);

			// Зафиксируем изначально выбранные, прилетевшие из TableScope.
			if (s.scopeStore.get() && !s.inited.get() && s.cold.selectedItems.get().length) changeState.selectedItems = true;

			// Запишем зависимые изменения.
			// Изменения, которые нужно делать при смене содержания items.
			// Важно выполнить до handleItemsChange, т.к. здесь пересоздается иерархия.
			if (changeState.itemsContent) await handleItemsContentChange(s as any, p);
			// Изменения, которые нужно делать при смене состава items.
			if (changeState.items) await handleItemsChange(s as any, p);
			// Изменения, которые нужно делать при смене настроек. Решение об изменении принимается внтури каждой функции.
			await setExpansion(s as any, changeState);

			s.changeState.set(changeState);
		};

		return { updateColdState };
	})
	.effects((s) => ({
		// Запускаем каждый раз при смене changeState. Внутри функция проверит на то есть ли изменения.
		stateChganged: () => s.changeState.onChange((changeState) => handleStateChange(s as any, changeState)),

		//// Выходные сигналы и постобработка.
		// Мульти-выбор
		/* selectedItemsChanged: () =>
			s.cold.selectedItems.onChange((selectedItems) => {
				sendSelectedItems(s as any);
				// Установим состояние выбора для всей иерархии, если есть TableScope.
				// Здесь мы устанавливаем TableScope, а в TableInstance слушаем, что прилетает.
				const scopeDbClass = s.cold.tableProps.scope?.get((s) => s?.dbClass);
				const scopeStore = s.scopeStore.get();
				if (scopeDbClass && scopeStore) {
					// Выбранные могут находиться в TableScope еще до монтирования текущей таблицы.
					// Проверим это, чтобы не повторяться. Так TableScope будет выдавать изменения один раз.
					const scopedSelectedIds = scopeStore.getSelectedItems(s.tableId.get(), scopeDbClass).map((i) => i.id);
					const selectedIds = selectedItems.map((i) => i.id);
					if (!isEqual(scopedSelectedIds, selectedIds))
						s.scopeStore.get()?.setMultiSelection(s.tableId.get(), scopeDbClass, s.cold.selectedItems.get());
				}
			}), */
		// Расширяемые строки.
		//expandedItemsChanged: () => s.cold.expandedItems.onChange(() => sendExpandedItems(s as any)),
		// Запускается один раз.
		levelChanged: () => s.level.onChange(() => sendOutput(s.noodlNode.get(), 'level', s.level.get()), { fireImmediately: true }),

		// Реактивность на изменение настроек таблицы.
		/* tablePropsChanged: () =>
			store.tableProps.onChange((newProps, oldProps) => {
				//console.log('tablePropsChanged', { oldProps, newProps });
				// Установим новое состояние sortState и колонок, если произошло изменение настроек сортировки.
				if (!isEqual(oldProps.sort, newProps.sort)) {
					setDefaultSortState(store as any);
					setColumns(store as any);
				}
			}),

		// Реактивность на изменение схемы колонок.
		originalColumnsChanged: () =>
			store.originalColumns.onChange((newColumns, oldColumns) => {
				//console.log('originalColumnsChanged', { oldColumns, newColumns });
				//setColumns(store as any);
				// Установим новое состояние сортировки, если в схеме колонок она изменилась.
				if (
					!isEqual(
						oldColumns.find((i) => typeof i.sort === 'string'),
						newColumns.find((i) => typeof i.sort === 'string')
					)
				)
					setDefaultSortState(store as any);
			}),

		// Реактивность на изменение items. Срабатывает как при первичном проходе, так и при последующих исзенениях.
		// Здесь живет вся подготовка данных для первой и последующих отрисовок.
		originalItemsChanged: () =>
			store.originalItems.onChange(async (newItems) => {
				console.log('originalItemsChanged', newItems);

				// Пересоздадим Noodl-объекты, если нужны.
				if (store.tableProps.needsNoodlObjects.get()) for (const item of newItems) Noodl.Object.create(item);
				// Разворачивание. Создадим React-ноды для новых items. Проверка внутри.
				await setExpansionRows(store as any);
				// Заполним все нужные состояния разом, но после асинхронных операций, т.к. их нельзхя делать в store.set из-за immer.
				store.set((s) => {
					s.items = newItems;
					s.state = 'ready';
				});
				// Отправим в порт.
				//sendExpandedItems(store as any);
				// Сортировка
				//store.items.set(frontSortItems(store as any));
			}),

		// Реактивность на изменение состояния сортировки.
		sortStateChanged: () =>
			store.sortState.onChange(() => {
				//console.log('sortStateChanged');
				store.items.set(frontSortItems(store as any));
				sendSortState(store as any);
			}), */
	}));

export type Store = typeof tableStore;

export const { useStore, Provider } = createStoreContext(tableStore);
