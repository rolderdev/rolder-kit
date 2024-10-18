/* Меняет состояние выбора всех items иерархии при смене самой иерархии.
Делает это при первом проходе, устанавливая не выбрано для всех и при последующих изменениях.
Проходит по всей иерархии слево направо, снизу вверх - https://en.wikipedia.org/wiki/Tree_traversal#Post-order */

import type { TabelScopeStore } from './store'

export default function (store: TabelScopeStore) {
	store.set((s) => {
		if (s.hierarchy) {
			// Отчистим удаленные, чтобы иерархия ниже отработала.
			const deletedItemIds = Object.keys(s.selectionState).filter((i) => !s.hierarchy?.find((n) => n.data.id === i))
			for (const deletedItemId of deletedItemIds) delete s.selectionState[deletedItemId]

			s.hierarchy.eachAfter((node) => {
				const chCount = node.children?.length || 0
				const selectedChCount = node.children?.filter((i) => s.selectionState[i.data.id] === 'selected').length || 0
				const indeterminateChCount = node.children?.filter((i) => s.selectionState[i.data.id] === 'indeterminate').length || 0

				if (!s.selectionState[node.data.id]) s.selectionState[node.data.id] = 'notSelected'
				else if (indeterminateChCount) s.selectionState[node.data.id] = 'indeterminate'
				else if (chCount && !selectedChCount) s.selectionState[node.data.id] = 'notSelected'
				else if (selectedChCount && chCount !== selectedChCount) s.selectionState[node.data.id] = 'indeterminate'
				else if (selectedChCount && chCount === selectedChCount) s.selectionState[node.data.id] = 'selected'
			})
		}
	})
}
