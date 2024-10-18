/* Модель разворачиваемой строки.
Используется как кеш, т.к. нужно создавать/удалять строки при изменении items и до того как пользователь развернул строку. */

import type { NoodlNode } from '@packages/node'
import { observer } from 'mobx-react-lite'
import { flow, t } from 'mobx-state-tree'
import type { Item } from 'types'
import createExpansionRows from '../funcs/createExpansionRows'

const ExpansionRow = observer((p: { reactNode: React.ReactNode }) => {
	log.debug('ExpansionRow render')
	return p.reactNode || ''
})

//interface ExpansionRow extends Instance<typeof expansionRowModel> {}
// Структура. items: содержит map, где ключ - item id, значение - React-нода.
const expansionRowModel = t.model('ExpansionRow', { reactNodes: t.map(t.frozen<React.ReactNode>()) }).actions((self) => ({
	// Функция создает новые строки и удаляет старые.
	// Это функция-генератор - https://learn.javascript.ru/generator
	setExpansionRows: flow(function* setExpansionRows(noodlNode: NoodlNode, items: Item[], expansionTemplate: string) {
		const currentItemIds = Array.from(self.reactNodes.keys())

		// Добавление
		const newItems = items.filter((i) => !currentItemIds.includes(i.id))
		if (newItems.length) {
			const newExpansionRows: Map<string, React.ReactNode> = yield createExpansionRows(
				noodlNode,
				newItems.map((i) => i.id),
				expansionTemplate
			)
			for (const [itemId, reactNode] of newExpansionRows) {
				self.reactNodes.set(itemId, reactNode)
			}
		}

		// Удаление
		const toDeleteItemIds = currentItemIds.filter((i) => !items.map((i) => i.id).includes(i))
		if (toDeleteItemIds.length) toDeleteItemIds.map((i) => self.reactNodes.delete(i))
	}),
}))

export { expansionRowModel, ExpansionRow }
