/* Функция задает цвет для выделенных строк
Если строка выделена одновременно через множественный и одиночный выбор, выигрывает цвет одиночного.
*/

import type { Item } from 'types'
import type { TableState } from '../../types'

export default function (selection: TableState['selection'], rowStyles: TableState['rowStyles'], currentRecord: Item) {
	let bgColor = rowStyles.rowBackgroundColor

	if (selection.single.enabled && currentRecord.id === selection.single.selectedItem?.id)
		bgColor = rowStyles.singleSelectionRowBgColor
	else if (selection.multi.enabled && selection.multi.selectedItems.map((i) => i.id).includes(currentRecord.id))
		bgColor = rowStyles.mutliSelectionRowBgColor

	return bgColor
}
