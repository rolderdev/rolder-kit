import { sendOutput, sendSignal } from '@packages/port-send'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { Props } from './types'
import { useForceUpdate } from '@mantine/hooks'
import {
	tableHandlerAtom,
	tableSelectionScopeAtom,
	tableSelectionScopeInternalAtom,
	tableselectionByDBClassAtom,
} from '@packages/scope'
import { Provider as JotaiProvider, useAtom } from 'jotai'

const HandlerTableSelectionScope = forwardRef((props: Props, ref) => {
	// Хука дял получения и перезаписывания атома

	const [tableSelectionScopeValue, setTableSelectionScopeValue] = useAtom(tableSelectionScopeAtom)
	const [tableSelectionByDBClassValue] = useAtom(tableselectionByDBClassAtom) // , setTableSelectionByDBClassValue
	const [tableSelectionScopeInternalValue, setTableSelectionScopeInternalValue] = useAtom(tableSelectionScopeInternalAtom)
	const [tableHandlerAtomValue, setTableHandlerAtomValue] = useAtom(tableHandlerAtom)

	const forceUpdate = useForceUpdate()
	const forceUpdateSelectionScope = () => {
		forceUpdate()
	}
	if (tableHandlerAtomValue['selectionScope'] === undefined) {
		setTableHandlerAtomValue((handlers) => ({ ...handlers, ['selectionScope']: forceUpdateSelectionScope }))
	}

	sendOutput(props.noodlNode, 'selectionScope', tableSelectionScopeValue)
	sendOutput(props.noodlNode, 'selectionByDBClass', tableSelectionByDBClassValue)
	sendSignal(props.noodlNode, 'changed')

	useEffect(() => {
		if (props.newSelectionScope) {
			setTableSelectionScopeValue(props.newSelectionScope)
			sendOutput(props.noodlNode, 'selectionScope', tableSelectionScopeValue)
			// Говорим, что нужно отрендерить 1 уровень таблиц
			const firstTableId = tableSelectionScopeInternalValue['allTableIdList'][0]
			if (firstTableId) {
				tableSelectionScopeInternalValue['forRenderTableId'] = {
					parentTableId: undefined,
					currentTableId: firstTableId,
					newTableId: [],
					childTableId: Object.keys(tableSelectionScopeInternalValue['parentTableIdByTableId']).filter(
						(key) => tableSelectionScopeInternalValue['parentTableIdByTableId'][key] === firstTableId
					),
				}
			}
		}
	}, [props.newSelectionScope])

	// При внешнем триггере reset очищаем молекулу
	useImperativeHandle(
		ref,
		() => ({
			reset() {
				// Сбросим селекты у всех записей
				for (const itemId in tableSelectionScopeValue) {
					tableSelectionScopeValue[itemId] = 'notSelected'
				}
				setTableSelectionScopeValue(tableSelectionScopeValue)

				// Очистим массив indeterminated
				tableSelectionScopeInternalValue['tableIndeterminatedItemsIdList'] = []
				setTableSelectionScopeInternalValue(tableSelectionScopeInternalValue)

				// Говорим, что нужно отрендерить 1 уровень таблиц
				const firstTableId = tableSelectionScopeInternalValue['allTableIdList'][0]
				if (firstTableId) {
					tableSelectionScopeInternalValue['forRenderTableId'] = {
						parentTableId: undefined,
						currentTableId: firstTableId,
						newTableId: [],
						childTableId: Object.keys(tableSelectionScopeInternalValue['parentTableIdByTableId']).filter(
							(key) => tableSelectionScopeInternalValue['parentTableIdByTableId'][key] === firstTableId
						),
					}
				}
				tableHandlerAtomValue[tableSelectionScopeInternalValue['allTableIdList'][0]]()
			},
		}),
		[]
	)

	return <>{props.children}</>
})

// Что за forwardRef и как он работатет
export default forwardRef((props: Props, ref) => {
	// При внешнем триггере reset очищаем молекулу
	const localRef = useRef<any>(null)
	useImperativeHandle(
		ref,
		() => ({
			reset() {
				localRef.current?.reset()
			},
		}),
		[]
	)

	return (
		<JotaiProvider>
			<HandlerTableSelectionScope ref={localRef} {...props} />
		</JotaiProvider>
	)
})
