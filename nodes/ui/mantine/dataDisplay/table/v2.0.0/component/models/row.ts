import type { CheckboxProps } from '@mantine/core'
import { sendOutput, sendSignal } from '@shared/port-send-v1.0.0'
import type { Props } from '../../node/definition'
import { toggleRowExpansion } from '../models/expansion'
import type { TableRecord } from '../models/record'
import { setSelectedId } from '../models/singleSelection'
import useItem from '../shared/useItem'
import useNode from '../shared/useNode'
import type { Funcs, Store } from '../store'
import type { TableProps } from './tableProps'

export type Row = {
	props?: { pl?: number }
	checkBoxProps?: CheckboxProps
	hierarchyUnsub?: () => void
}

// Возвращает функцию обработки нажатия на строку в зависиимости от установленного параметра.
export const getRowClickHandler = (
	s: Store,
	onRowClickSn: TableProps['onRowClick'],
	clickFilterFuncSnap: Funcs['clickFilterFunc']
) => {
	if (onRowClickSn === 'disabled') return undefined

	return ({ record }: { record: TableRecord }) => {
		const item = useItem(record.id, 'store')
		const nodeSnap = useNode(s, record.id, 'snap')
		if (item)
			switch (onRowClickSn) {
				case 'signal': {
					// Если разработчик добавил проверку и она false, отменяем отправку.
					if (clickFilterFuncSnap && !clickFilterFuncSnap(item, nodeSnap)) return
					sendOutput(s.noodlNode, 'clickedItem', item)
					sendOutput(s.noodlNode, 'clickedNode', nodeSnap)
					sendSignal(s.noodlNode, 'rowClicked')
					return
				}

				case 'singleSelection': {
					setSelectedId(s, record.id)
					return
				}
				case 'expansion': {
					toggleRowExpansion(s, record.id)
					return
				}
			}
	}
}

// Возвращает состояние курсора.
export const getCursorState = (
	s: Store,
	id: string,
	onRowClickSn: TableProps['onRowClick'],
	clickFilterFuncSn: Funcs['clickFilterFunc'],
	singleSelectionFilterFuncSn: Funcs['singleSelectionFilterFunc'],
	expansionFilterFuncSn: Funcs['expansionFilterFunc']
) => {
	const itemSnap = useItem(id, 'snap')
	const nodeSnap = useNode(s, id, 'snap')

	if (itemSnap)
		switch (onRowClickSn) {
			case 'signal': {
				if (clickFilterFuncSn && !clickFilterFuncSn(itemSnap, nodeSnap)) return 'unset'
				return 'pointer'
			}
			case 'singleSelection': {
				if (singleSelectionFilterFuncSn && !singleSelectionFilterFuncSn(itemSnap, nodeSnap)) return 'unset'
				return 'pointer'
			}
			case 'expansion': {
				if (expansionFilterFuncSn && !expansionFilterFuncSn(itemSnap, nodeSnap)) return 'unset'
				return 'pointer'
			}
			default:
				return 'unset'
		}
	return 'unset'
}

export const getRowBgColor = (
	s: Store,
	id: string,
	selectedIdSn: Store['selectedId'],
	selectedIdsSn: Store['selectedIds'],
	rowStylesSn: TableProps['rowStyles']
) => {
	let bgColor = rowStylesSn.rowBackgroundColor

	if (selectedIdsSn[id]) bgColor = rowStylesSn.mutliSelectionRowBgColor
	// Единичный выбор перекрывает мульти-выбор.
	if (selectedIdSn === id) bgColor = rowStylesSn.singleSelectionRowBgColor

	return bgColor
}

// Расчет отступа функцией разработчика.
export const setRowPaddingLeft = (p: Props, s: Store, idsChanged: boolean, checkBoxPropsChanged?: boolean) => {
	if (!R.libs.just.compare(p.paddingLeftFunc, s.funcs.paddingLeftFunc) || idsChanged || checkBoxPropsChanged) {
		for (const id of s.originalIds) {
			const itemSnap = useItem(id, 'snap')

			try {
				if (itemSnap) {
					const level = s.hierarchy?.level
					const pl = p.paddingLeftFunc?.(level, itemSnap)
					R.libs.just.set(s.rows, [id, 'props', 'pl'], pl)

					if (s.tableProps.multiSelection.enabled) {
						const checkBoxProps = R.libs.just.get(s.rows, [id, 'checkBoxProps']) || {}
						checkBoxProps.pl = pl
						R.libs.just.set(s.rows, [id, 'checkBoxProps'], checkBoxProps)
					}
				}
			} catch (e: any) {
				log.error('paddingLeftFunc error', e)
				R.libs.mantine?.MantineError?.('Системная ошибка!', `paddingLeftFunc error. ${e.message}`)
			}
		}

		s.funcs.paddingLeftFunc = p.paddingLeftFunc
	}
}
