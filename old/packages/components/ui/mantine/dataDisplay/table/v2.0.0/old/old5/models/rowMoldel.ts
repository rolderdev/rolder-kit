/* Модель строки. */

import isEqual from 'lodash.isequal'
import type { Item } from 'types'
import { z } from 'zod'
import isObjectEqual from '../funcs/isObjectEqual'
import setRow from '../funcs/setRow'
import type { State, Store } from '../store/store'

const rowSchema = z.object({
	id: z.string(),
	state: z.object({ templateCells: z.boolean().default(true), expansionRow: z.boolean().default(true) }).default({}),
	ready: z.boolean().default(true),
	item: z.object({}).passthrough(),
	templateCells: z.map(z.number(), z.any()).default(new Map()),
	expansionRow: z.any().optional(),
})

export type Row = z.infer<typeof rowSchema>

// Метод подготавливает строки.
export const getRows = (items: Item[]) => {
	const rows = new Map<string, Row>()
	items.map((item) => rows.set(item.id, rowSchema.parse({ id: item.id, item })))
	return rows
}

// Методы setRows обновляют состояние строк. 2 сценария работы:
// 1. Функция выдает готовые строки, которые присваиваются при первичном запуске или при обновлении. Это один рендер.
// 2. Если есть кастомные ячейки или разворачиваемые строки, то выданные строки будут в статусе ready = false, что отобразит скелетоны.
// Далее запускаются асинхронные функции, создающие кастомные ячейки и разворачиваемые строки, в которые передается store.
// Через store устнавливается новое состояние. Zustand так умеет - устанавливать состояние из асинхронных функций.
// При этом результат работы функций для установки кастомных ячеек и разворачиваемых строк отслеживается в Table.
// Там же и установка ready разом. Так легче добиться одного рендера, т.к. трудно асинхронно принимать решение ready или нет.

export const setRows = (store: Store, newItems: Item[]) => {
	const newRows = getRows(newItems)
	const resultRows = new Map<string, Row>(store.getState().rows) // Легче мутировать, чем пересоздавать.
	let itemsChanged = false
	let itemIdsChanged = false
	const newState: Partial<State> = {}

	// Проходим по прилетевшим строкам в их порядке, сравнив существующие, добавив новые.
	Array.from(newRows.values()).map((newRow) => {
		const currentRow = resultRows.get(newRow.id)

		if (currentRow) {
			// Сравниваем только источник данных - item.
			if (!isObjectEqual(currentRow.item, newRow.item)) {
				itemsChanged = true
				resultRows.set(newRow.id, setRow(store, newRow))
			}
		} else {
			// Добавим новую строку, установив в нее кастомные расширения.
			resultRows.set(newRow.id, setRow(store, newRow))
			itemsChanged = true
			itemIdsChanged = true
		}
	})

	// Удаление.
	if (
		!isEqual(
			Array.from(resultRows.keys()),
			newItems.map((i) => i.id)
		)
	) {
		itemIdsChanged = true
		Array.from(resultRows.values()).map((row) => {
			if (!newRows.get(row.id)) resultRows.delete(row.id)
		})
	}

	if (itemsChanged || itemIdsChanged) newState.rows = resultRows
	if (itemIdsChanged) newState.rowIds = newItems.map((i) => i.id)
	if (itemsChanged || itemIdsChanged) store.setState(newState)
}
