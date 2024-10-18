/* Модель записи. */

import type { NoodlNode } from '@packages/node'
import type { Item } from 'types'
import { z } from 'zod'
import type { Store } from '../../types'
import flatUpdate from '../funcs/flatUpdate'
import getTemplateCell from '../funcs/getTemplateCell'
import type { Column } from './columnModel'

const recordSchema = z.object({
	id: z.string(),
	item: z.object({}).passthrough(),
	templateCells: z.record(z.string(), z.promise(z.any())).default({}),
})

type Record = z.infer<typeof recordSchema>

// Функция устанавливает первичное состояние records.
const getRecords = (noodlNode: NoodlNode, items: Item[], columns: Column[]) => {
	console.log('getRecords')
	const records = new Map<string, Record>()
	items.map((item) => {
		Noodl.Object.create(item)
		const record = recordSchema.parse({ id: item.id, item })
		if (columns.some((i) => i.type === 'template')) {
			columns.map((column, columnIdx) => {
				if (column.type === 'template' && column.template)
					record.templateCells[columnIdx] = getTemplateCell(noodlNode, column.template, record.id)
			})
		}
		records.set(record.id, record)
	})

	return records
}

const setRecords = (store: Store, items: Item[]) => {
	// Добавление и обновление.
	items.map((item) => {
		const record = store.records.get(item.id)
		if (record) {
			flatUpdate(item, record.item)
			Noodl.Objects[item.id].setAll(item)
		} else {
			const newRecord = recordSchema.parse({ id: item.id, item })
			if (store.columns.some((i) => i.type === 'template')) {
				store.columns.map((column, columnIdx) => {
					if (column.type === 'template' && column.template)
						newRecord.templateCells[columnIdx] = getTemplateCell(store.noodlNode, column.template, newRecord.id)
				})
			}
			store.records.set(newRecord.id, newRecord)
			Noodl.Object.create(item)
		}
	})
	// Удаление
	Array.from(store.records.values())
		.filter((record) => !items.map((i) => i.id).includes(record.id))
		.map((record) => store.records.delete(record.id))
}

export { getRecords, setRecords, type Record }
