import { store, createStoreContext } from '@davstack/store';
import type { HierarchyNode } from 'd3-hierarchy';
import type { NoodlNode } from '@packages/node';
import type { Item } from 'types';
import setHierarchy from './setHierarchy';
import setMultiSelection from './setMultiSelection';
import { sendOutput } from '@packages/port-send';

export type Selection = 'selected' | 'notSelected' | 'indeterminate';
type ItemState = { id: string; dbClass: string; item: Item };
type Hierarchy = HierarchyNode<ItemState>;
type SelectionState = Record<string, Selection>; // {[itemId]: SelectionState}
export type MultiSelectionFilterFunc = (item: Item) => boolean;

const tableScopeStore = store({
	noodlNode: {} as NoodlNode,
	selectionDbClasses: [] as string[], // Классы БД для установки выбранных items разных таблиц. Они же для вывода в порты.
	hierarchy: undefined as Hierarchy | undefined, // Иерархия items и их состояние. Не реактивно.
	selectionState: {} as SelectionState, // Состояние каждого item, включая корень (tableId). Реактивно.
	multiSelectionFilterFunc: undefined as MultiSelectionFilterFunc | undefined,
})
	.computed((s) => ({
		// Вернем реактивно выбранные items. Реагирует только на смену выбора, игнорируя indeterminate.
		selectedItems: (p: { items: Item[] }) => s.selectionState.use((s) => p.items.filter((item) => s[item.id] === 'selected')),
	}))
	.actions((s) => ({
		// Изменяет состояние иерархии items.
		setHierarchy: (rootId: string, items: Item[]) => setHierarchy(s as any, rootId, items),
		// Изменяет состояние выбора всей иерархии.
		setMultiSelection: (items: Item[], selectedItems: Item[]) => setMultiSelection(s as any, items, selectedItems),
	}))
	.effects((s) => ({
		// При каждой смене состояния выбора отправляем данные в порт для каждого класса отдельно.
		selectionStateChanges: () =>
			s.selectionState.onChange((selectionState) => {
				// Возьмем заданные классы
				for (const dbClass of s.selectionDbClasses.get()) {
					// Возьмем из иерархии все выбранные items текущего класса, исключив корень (у корня нет класса).
					const selectedItems = s.hierarchy
						.get()
						?.descendants()
						.filter((i) => i.data.dbClass === dbClass && selectionState[i.data.id] === 'selected')
						.map((i) => i.data.item);
					sendOutput(s.noodlNode.get(), dbClass, selectedItems || []);
				}
			}),
	}));

export type TabelScopeStore = typeof tableScopeStore;
export const { useStore, Provider } = createStoreContext(tableScopeStore);
export const useTableScopeStore = () => {
	try {
		return useStore();
	} catch (e) {
		return undefined;
	}
};
