/* Модель record. Сожержит в себе все, что нужно для точечно реактивной отрисовки строк. */

import { type Instance, cast, getRoot, t } from 'mobx-state-tree'
import type { Item } from 'types'
import Cell from '../render/Cell'

interface RecordModel extends Instance<typeof recordModel> {
	item: Item
}

const recordModel = t
	.model('Record', {
		id: t.identifier,
		// Состояние готовности. Отражает состояние всего record, чтобы одновременно отборадать все виды ячеек.
		ready: false,
		//item: t.model()
		//accessors: t.model(),
		//templateCells: t.map(t.frozen<React.ReactNode>()),
		//expanded: false,
		//expansionReactNode: t.frozen<React.ReactNode>()
	})
	.views((self) => {
		// Рендер ячейки. Какого типа ячейку рендерить решается внутри Cell.
		function renderCell() {
			return <Cell root={getRoot(self)} record={cast(self)} /> // cast для типизации.
		}
		return { renderCell }
	})
	.actions((self) => {
		function setReady() {
			self.ready = true
		}
		return { setReady }
	})

export { recordModel, type RecordModel }
