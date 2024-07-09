import { store, createStoreContext } from '@davstack/store';
import type { HierarchyNode } from 'd3-hierarchy';
import type { NoodlNode } from '@packages/node';
import type { Item } from 'types';
import setHierarchy from './setHierarchy';
import setMultiSelection from './setMultiSelection';

type State = 'checked' | 'notChecked' | 'indeterminate';
type ItemState = { id: string; dbClass: string; item: Item; state: State };
type Hierarchy = HierarchyNode<ItemState>;
type TablesSelectedItems = Record<string, Item[] | undefined>; // {[tableId]: selectedItems}
type Indeterminated = Record<string, boolean>; // {[tableId]: {[itemId]indeterminated}}
export type IsRecordSelectable = (item: Item) => boolean;

const tableScopeStore = store({
	noodlNode: {} as NoodlNode,
	selectionDbClasses: [] as string[], // Классы БД для установки выбранных items разных таблиц. Они же для вывода в порты.
	hierarchy: undefined as Hierarchy | undefined, // Иерархия items и их состояние. Не реактивно.
	tablesSelectedItems: {} as TablesSelectedItems, // Выбранные items для каждой таблицы. Реактивно.
	indeterminated: {} as Indeterminated, // Состояние indeterminated (полупокеры) для items. Реактивно.
	// Функция фильтрации. В отличии от такой же в таблице, применяется ко всему TableScope.
	isRecordSelectable: undefined as IsRecordSelectable | undefined,
}).actions((store) => ({
	//// Чтение состояния.
	getSelectedItems: (tableId: string, dbClass: string) => {
		// Вернем items только запрошенного класса, исключив items соседних таблиц.
		return store.tablesSelectedItems[tableId].get((s) => s?.filter((i) => i.dbClass === dbClass) || []);
	},
	useSelectedItems: (tableId: string, dbClass: string) => {
		return store.tablesSelectedItems[tableId].use((s) => s?.filter((i) => i.dbClass === dbClass) || []);
	},
	//// Установщики состояния.
	// Изменяет состояние иерархии items.
	setHierarchy: (rootId: string, items: Item[]) => setHierarchy(store as any, rootId, items),
	// Изменяет состояние выбора всей иерархии.
	setMultiSelection: (tableId: string, dbClass: string, selectedItems: Item[]) =>
		setMultiSelection(store as any, tableId, dbClass, selectedItems),
}));

export type TabelScopeStore = typeof tableScopeStore;

export const { useStore, Provider } = createStoreContext(tableScopeStore);

export const useTableScopeStore = () => {
	try {
		return useStore();
	} catch (error) {
		return undefined;
	}
};
