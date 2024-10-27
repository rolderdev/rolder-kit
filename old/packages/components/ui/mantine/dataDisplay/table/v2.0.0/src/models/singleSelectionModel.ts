/* Модель единичного выбора. */

import { sendOutput, sendSignal } from '@packages/port-send'
import type { Item } from 'types'
import type { Store } from '../store/store'

// Метод проверки новой строкм с порта. Проверяет на соответсвие items и функцией разработчика.
export const getSelectedItem = (s: Store, newSelectedItem: Item) => {
	if (s.cold.items.get()?.some((i) => i.id === newSelectedItem.id)) {
		const singleSelectionFilterFunc = s.cold.tableProps.singleSelectionFilterFunc?.get()
		if (singleSelectionFilterFunc && !singleSelectionFilterFunc(newSelectedItem)) return null
		return newSelectedItem
	}
	return null
}

// Метод установки дефолтного выбора. Устанавливает только, если не установлено. Фильтрует по items.
export const setDefaultSelectedItem = (s: Store, defaultSelectedItem?: Item) => {
	if (defaultSelectedItem && !s.defaults.selectedItem.get()) {
		const selectedItem = getSelectedItem(s, defaultSelectedItem)
		s.defaults.selectedItem.set(true)
		s.selectedItem.set(selectedItem)
		// При установке дефолта отправим в порт значение, но не сигнал.
		sendOutput(s.noodlNode.get(), 'selectedItem', selectedItem)
	}
}

// Метод установки выбора с порта. Фильтрует по items. Не срабатывает, если undefined. Раработчик доожен использовать reset.
// Устанавливает новый выбор, если новый не совпадает со старым.
// Сбрасывает выбор, если новый совпадает со старым.
export const setSelectedItem = (s: Store, newSelectedItem: Item) => {
	const selectedItem = getSelectedItem(s, newSelectedItem)
	if (selectedItem) {
		if (s.selectedItem.get()?.id !== selectedItem.id) {
			const singleSelectionFilterFunc = s.cold.tableProps.singleSelectionFilterFunc?.get()
			if (singleSelectionFilterFunc && !singleSelectionFilterFunc(selectedItem)) return
			s.selectedItem.set(selectedItem)
		} else s.selectedItem.set(null)
		sendOutput(s.noodlNode.get(), 'selectedItem', s.selectedItem.get())
		sendSignal(s.noodlNode.get(), 'selectedItemChanged')
	}
}

// Метод сброса выбора. Проверяет есть ли что сбрасывать.
export const resetSelectedItem = (s: Store) => {
	if (s.selectedItem.get()) {
		s.selectedItem.set(null)
		sendOutput(s.noodlNode.get(), 'selectedItem', null)
		sendSignal(s.noodlNode.get(), 'selectedItemChanged')
	}
}
