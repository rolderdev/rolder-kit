/* Модель мульти-выбора. */

import { sendOutput, sendSignal } from '@packages/port-send'
import type { DataTableProps } from 'mantine-datatable'
import { useEffect } from 'react'
import type { Item } from 'types'
import type { Props } from '../../types'
import isArrayEqual from '../funcs/isArrayEqual'
import type { Store } from '../store'

// Метод обновляет состояние выбранных строк.
// Метод используется, как при выборе чекбоксами, так и при внешних изменениях, например, при смене самих items.
// Это позволяет покрыть такие сценарии, как удаление выбранных строк из items.
export const setSelectedItems = (store: Store, selectedItems: Item[]) => {
	// Отфильтруем, чтобы узнать есть ли у нас выбранные строки, которых уже нет.
	const newSelectedItems = store.items.get((items) => items.filter((i) => selectedItems.map((i) => i.id).includes(i.id)))
	if (!isArrayEqual(store.selectedItems.get(), newSelectedItems)) {
		store.selectedItems.assign(newSelectedItems)
	}
}

// Метод отправки выбранных строк.
export const sendSelectedItems = (store: Store, newSelectedItems: Item[]) => {
	sendOutput(store.noodlNode.get(), 'selectedItems', newSelectedItems)
	// Не отправляем сигнал, когда есть изначально выбранные строки.
	if (store.selectedItemsFirstRun.get()) store.selectedItemsFirstRun.set(false)
	else sendSignal(store.noodlNode.get(), 'selectedItemsChanged')
}

// Хук, меняющий состояние чекбокса в заголовке корневой таблицы.
export const useHeaderCheckboxProps = (store: Store, p: Props) => {
	const indeterminate = store.scope.get()?.indeterminated.use((s) => s[store.tableId.get()])

	useEffect(() => {
		if (!store.isChild.get() && store.scope.get()) {
			const allRecordsSelectionCheckboxProps: DataTableProps<Item>['allRecordsSelectionCheckboxProps'] = {
				...p.customProps?.allRecordsSelectionCheckboxProps,
				indeterminate,
			}

			store.libProps.set((libProps) => {
				libProps.allRecordsSelectionCheckboxProps = allRecordsSelectionCheckboxProps as any
			})
		}
	}, [indeterminate])
}
