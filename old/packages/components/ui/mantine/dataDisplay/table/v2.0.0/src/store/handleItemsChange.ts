// Функция для обработки изменений при смене items

import type { Props } from '../../types'
import { setExpansionRows } from '../models/expansionModel'
import { setSelectedItemsFromItems } from '../models/multiSelectionModel'
import { resetSelectedItem } from '../models/singleSelectionModel'
import { setTemplateCells } from '../models/templateCellModel'
import type { Store } from './store'

export default async (s: Store, p: Props) => {
	const { expansion, multiSelection, onRowClick } = s.cold.tableProps.get()

	if (p.items) {
		// Кастомные ячейки
		if (p.columnsDefinition?.some((i) => i.type === 'template')) {
			await setTemplateCells(s)
		}
		// Единичный выбор. Сбросим, если был выбор, но его нет в новых items.
		if (onRowClick === 'singleSelection') {
			const selectedItem = s.selectedItem.get()
			if (selectedItem && p.items && !p.items.some((i) => i.id === selectedItem.id)) resetSelectedItem(s)
		}
		// Мулти-выбор. Уберем из выбранных больше не существующие items.
		if (multiSelection && s.cold.selectedItems.get().length) setSelectedItemsFromItems(s)
		// Расширяемых строки.
		if (expansion.enabled) {
			// Запишем новые React-ноды для расширяемых строк. Функция сама проверит и добавит только то, что нужно.
			// Асинхронность работает (горячая хранилка дождется) только если в горячем хранилище использовать store.set
			await setExpansionRows(s)
		}
	}
}
