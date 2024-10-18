/* Модель мульти-выбора. */

import { sendOutput, sendSignal } from '@packages/port-send'
import isEqual from 'lodash.isequal'
import type { Item } from 'types'
import filterByItems from '../funcs/filterByItems'
import type { ChangeState, Store } from '../store/store'

// Метод установки новых строк с таблицы. Без проверок, т.к. библиотека сама это делает.
// Не проверяется функцией разработчика, т.к. функция не даст чекнуть чекбокс.
export const setSelectedItemsFromTable = (s: Store, newSelectedItems: Item[]) => {
	s.cold.selectedItems.set(newSelectedItems)
	s.changeState.selectedItems.set(true)
	setScopeSelectedItems(s)
	sendOutput(s.noodlNode.get(), 'selectedItems', newSelectedItems)
	sendSignal(s.noodlNode.get(), 'selectedItemsChanged')
}

// Метод установки новых строк с TableScope. Не делает проверок.
// Корректность состава items курирует setHierarchy, а изменения setMultiSelection.
// Не проверяется функцией разработчика, т.к. в scope попадает уже отфильтрованный выбор.
// Проверяет на изменения, чтобы не тригеть повторно.
export const setSelectedItemsFromScope = (s: Store, newSelectedItems: Item[]) => {
	// Пропустим проверку при первичном проходе, т.к. параметры еще не опеределены.
	if (!s.inited.get() || selectedItemsChanged(s, newSelectedItems)) {
		s.cold.selectedItems.set(newSelectedItems)
		s.changeState.selectedItems.set(true)
		sendOutput(s.noodlNode.get(), 'selectedItems', newSelectedItems)
		sendSignal(s.noodlNode.get(), 'selectedItemsChanged')
	}
}

// Метод установки дефолтных строк с порта. Проверяет на соответствие items, т.к. разработчик может подать то, чего нет.
// Срабатывает при условии наличия items в холодном хранилище, поданный массив не пустой и только первый раз.
// Проверяется функцией разработчика.
export const setDefaultSelectedItems = (s: Store, changeState: ChangeState, newSelectedItems?: Item[]) => {
	if (s.cold.items.get() && newSelectedItems?.length && !s.defaults.selectedItems.get()) {
		const selectedItems = filterItems(s, filterByItems(newSelectedItems, s.cold.items.get() || []))
		s.defaults.selectedItems.set(true)
		s.cold.selectedItems.set(selectedItems)
		setScopeSelectedItems(s)
		changeState.selectedItems = true
		// При установке дефолта отправим в порт значение, но не сигнал.
		sendOutput(s.noodlNode.get(), 'selectedItems', selectedItems)
	}
}

// Метод установки новых строк с порта. Может принять пустой массив, т.е. сбросить выбор как reset. Проверяет на соответсвие items.
// Срабатывает при условии наличия items в холодном хранилище и изменении выбора.
// Проверяется функцией разработчика.
export const setSelectedItemsFromPort = (s: Store, newSelectedItems: Item[]) => {
	if (s.cold.items.get() && selectedItemsChanged(s, newSelectedItems)) {
		const selectedItems = filterItems(s, filterByItems(newSelectedItems, s.cold.items.get() || []))
		s.cold.selectedItems.set(selectedItems)
		s.changeState.selectedItems.set(true)
		sendOutput(s.noodlNode.get(), 'selectedItems', selectedItems)
		sendSignal(s.noodlNode.get(), 'selectedItemsChanged')
	}
}

// Метод установки новых строк при смене items. Проверяет на соответсвие items.
// Срабатывает при условии наличия items в холодном хранилище и изменении выбора.
// Проверяется функцией разработчика.
export const setSelectedItemsFromItems = (s: Store) => {
	if (s.cold.items.get() && selectedItemsChanged(s, s.cold.items.get())) {
		const selectedItems = filterItems(s, filterByItems(s.cold.selectedItems.get() || [], s.cold.items.get() || []))
		s.cold.selectedItems.set(selectedItems)
		s.changeState.selectedItems.set(true)
		sendOutput(s.noodlNode.get(), 'selectedItems', selectedItems)
		sendSignal(s.noodlNode.get(), 'selectedItemsChanged')
	}
}

// Метод сброса строк с порта.
export const resetSelectedItems = (s: Store) => {
	if (s.cold.selectedItems.get().length) {
		s.cold.selectedItems.set([])
		setScopeSelectedItems(s)
		s.changeState.selectedItems.set(true)
		sendOutput(s.noodlNode.get(), 'selectedItems', [])
		sendSignal(s.noodlNode.get(), 'selectedItemsChanged')
	}
}

// Метод установки выбранных строк в TableScope.
const setScopeSelectedItems = (s: Store) => {
	const scopeDbClass = s.cold.tableProps.scope?.get((s) => s?.dbClass)
	const scopeStore = s.scopeStore.get()
	if (scopeDbClass && scopeStore) s.scopeStore.get()?.setMultiSelection(s.cold.items.get() || [], s.cold.selectedItems.get())
}

// Метод проверки новых строк функцией разработчика.
const filterItems = (s: Store, newSelectedItems: Item[]) => {
	const filterFunc = s.cold.tableProps.multiSelectionFilterFunc?.get()
	if (filterFunc) newSelectedItems.filter((i) => filterFunc(i))
	else return newSelectedItems
	return []
}

// Метод проверки на изменение состава выбранных строк.
const selectedItemsChanged = (s: Store, newSelectedItems?: Item[]) => {
	if (s.cold.tableProps.multiSelection.get() && newSelectedItems) {
		const oldSelectedIds = s.cold.selectedItems.get().map((i) => i.id)
		const newSelectedIds = newSelectedItems?.map((i) => i.id) || []
		// Не сравниваем содержимое items, это делается при изменении самих items.
		if (!isEqual(oldSelectedIds.sort(), newSelectedIds.sort())) return true
	}
	return false
}
